import { getSnapshot } from "mobx-state-tree";
import { addParticipantToCalendar, removeParticipantFromCalendar, saveCalendarOpeningHoursBatch } from "./blazeoCalendarRelationMethods.js";
import { createCalendarAsync, updateCalendarAsync, deleteCalendarAsync } from "./createCalendar.js";
function isFailureStatus(res) {
    return res.status !== "success" && res.status !== "Success";
}
function normalizeParticipantGuid(id) {
    if (id == null || !String(id).trim())
        return undefined;
    return String(id).trim().replace(/^\{|\}$/g, "").toLowerCase();
}
/** Coerce MST / envelope shapes into a plain ID list for comparison. */
function unwrapParticipantIds(raw) {
    if (raw == null)
        return [];
    let list = [];
    if (Array.isArray(raw)) {
        list = raw;
    }
    else {
        const d = raw.data ?? raw.Data ?? raw.items ?? raw.Items ?? raw;
        list = Array.isArray(d) ? d : (d?.items ?? d?.Items ?? []);
    }
    return list.map(p => {
        const id = p.participantId ?? p.ParticipantId ?? p.participant_id ?? p.id ?? p.Id;
        return normalizeParticipantGuid(id);
    }).filter(Boolean);
}
function newOpeningHourId() {
    const c = globalThis.crypto;
    if (c?.randomUUID)
        return c.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
/**
 * Resolves Blazeo `participantId` for an opening-hour row: explicit `participantId`,
 * matching `CalendarCreation.SaveOpeningHours`.
 */
export function resolveParticipantIdForOpeningHour(openingHour) {
    const direct = normalizeParticipantGuid(openingHour.participantId);
    if (direct)
        return direct;
    return undefined;
}
function effectiveCalendarId(calendarNode, input) {
    const snap = getSnapshot(calendarNode);
    const fromNode = snap.calendarId?.trim();
    if (fromNode && fromNode !== "new")
        return fromNode;
    return (input.calendarId?.trim() || undefined);
}
/**
 * Orchestrates the same steps as Apex `CalendarCreation.CreateCalendarAsync`:
 * save calendar (`POST /Calendar/Create`), then add participants, then save opening hours
 * per day (`POST /Calendar/Participant/Availability/OpeningHour/Save`).
 */
export async function createCalendarWithRelationsAsync(calendar, options = {}) {
    const hasMembers = (calendar.members?.length ?? 0) > 0;
    const hasHours = (calendar.openingHours?.length ?? 0) > 0;
    if (!hasMembers && !hasHours) {
        const r = await createCalendarAsync(calendar, options);
        if (!r.ok)
            return r;
        return { ...r, membersAdded: 0, openingHoursSaved: 0 };
    }
    if (options.localOnly) {
        const r = await createCalendarAsync(calendar, options);
        if (!r.ok)
            return r;
        return { ...r, membersAdded: 0, openingHoursSaved: 0 };
    }
    const created = await createCalendarAsync(calendar, options);
    if (!created.ok)
        return created;
    return runMembersAndOpeningHoursAfterCalendarSave(calendar, created.calendar, created);
}
/**
 * After calendar `create` or `update`, add members and opening hours (same order as Apex facade).
 */
async function runMembersAndOpeningHoursAfterCalendarSave(calendar, calendarNode, baseSuccess) {
    const calendarIdStr = effectiveCalendarId(calendarNode, calendar);
    if (!calendarIdStr) {
        return {
            ok: false,
            error: "Could not resolve calendar id after save. Ensure the API returned a calendar id.",
        };
    }
    // 1. Participant Reconciliation (Diff-based)
    // Fetch current participants to see who needs to be removed
    let currentParticipantIds = [];
    try {
        const currentRaw = await calendarNode.getParticipants();
        currentParticipantIds = unwrapParticipantIds(currentRaw);
    }
    catch (err) {
        console.warn("[calendarCreation] Failed to fetch current participants for reconciliation. Proceeding with additive mode.", err);
    }
    const desiredMembers = calendar.members ?? [];
    const desiredIds = new Set(desiredMembers.map((m) => normalizeParticipantGuid(m.id)).filter(Boolean));
    // A. Remove missing members
    for (const existingId of currentParticipantIds) {
        if (!desiredIds.has(existingId)) {
            try {
                await removeParticipantFromCalendar(calendarNode, existingId);
            }
            catch (err) {
                console.warn(`[calendarCreation] Failed to remove participant ${existingId}:`, err);
            }
        }
    }
    // B. Add new members
    const existingIdSet = new Set(currentParticipantIds);
    let membersAdded = 0;
    for (const m of desiredMembers) {
        const pid = normalizeParticipantGuid(m.id);
        if (!pid) {
            return {
                ok: false,
                error: `Member id ${m.id}: thirdPartyMemberId is required to add a participant.`,
            };
        }
        // Only add if not already there
        if (!existingIdSet.has(pid)) {
            const res = await addParticipantToCalendar(calendarNode, pid);
            if (isFailureStatus(res)) {
                const msg = res.message ??
                    (typeof res.data === "string" ? res.data : undefined) ??
                    JSON.stringify(res);
                return {
                    ok: false,
                    error: `addParticipant failed for member ${m.id}: ${msg}`,
                    apiResponse: res,
                };
            }
            membersAdded += 1;
        }
    }
    // 2. Save Opening Hours (Plan V2: Grouped by participant with explicit off-days per slot)
    const openingHours = calendar.openingHours ?? [];
    const hoursByParticipant = new Map();
    for (const oh of openingHours) {
        const participantId = resolveParticipantIdForOpeningHour(oh);
        if (!participantId) {
            return {
                ok: false,
                error: `Opening hour id ${oh.id}: participantId is required.`,
            };
        }
        if (!hoursByParticipant.has(participantId)) {
            hoursByParticipant.set(participantId, []);
        }
        // Plan V2 Logic: For every opening hour object, generate EXACTLY 7 entries (days 0-6).
        // If the day is in oh.days, it's ON. If not, it's OFF.
        const activeDays = oh.days ?? [];
        const openingHourId = oh.openingHourId?.trim() || newOpeningHourId();
        for (let day = 0; day <= 6; day++) {
            const isIncluded = activeDays.includes(day);
            const isOff = isIncluded ? !!oh.off : true; // If not in days array, it's explicitly OFF
            hoursByParticipant.get(participantId)?.push({
                calendarId: calendarIdStr,
                participantId,
                day,
                startHour: oh.startHour,
                startMinute: oh.startMinute,
                endHour: oh.endHour,
                endMinute: oh.endMinute,
                off: isOff,
                // Plan V2 Optimization: Generate a unique ID for EVERY day record.
                // This prevents the backend from deduplicating/overwriting when multiple 
                // records for the same participant + slot are sent in one batch.
                openingHourId: newOpeningHourId(),
            });
        }
    }
    let openingHoursSaved = 0;
    for (const [participantId, payload] of hoursByParticipant.entries()) {
        if (payload.length === 0)
            continue;
        // Plan V2 Optimization: Clear existing records for this participant first.
        // This ensures that when we save the new batch (with unique per-day IDs), 
        // we don't leak orphaned records or create duplicates during updates.
        await calendarNode.removeParticipantOpeningHours(participantId);
        // Use the batch save method (plural)
        const res = await saveCalendarOpeningHoursBatch(calendarNode, payload);
        if (isFailureStatus(res)) {
            const msg = res.message ??
                (typeof res.data === "string" ? res.data : undefined) ??
                JSON.stringify(res);
            return {
                ok: false,
                error: `saveOpeningHours batch failed for participant ${participantId}: ${msg}`,
                apiResponse: res,
            };
        }
        openingHoursSaved += payload.length;
    }
    return {
        ...baseSuccess,
        membersAdded,
        openingHoursSaved,
    };
}
/**
 * Calendar body update, then same member + opening-hour saves as create (Apex-style follow-up).
 * For member add/remove *diffs* against existing DB membership, use server-side Apex; this client
 * only performs additive Blazeo calls matching the payload.
 */
export async function updateCalendarWithRelationsAsync(calendar, options = {}) {
    const hasMembers = (calendar.members?.length ?? 0) > 0;
    const hasHours = (calendar.openingHours?.length ?? 0) > 0;
    if (!hasMembers && !hasHours) {
        const r = await updateCalendarAsync(calendar, options);
        if (!r.ok)
            return r;
        return { ...r, membersAdded: 0, openingHoursSaved: 0 };
    }
    if (options.localOnly) {
        const r = await updateCalendarAsync(calendar, options);
        if (!r.ok)
            return r;
        return { ...r, membersAdded: 0, openingHoursSaved: 0 };
    }
    const updated = await updateCalendarAsync(calendar, options);
    if (!updated.ok)
        return updated;
    return runMembersAndOpeningHoursAfterCalendarSave(calendar, updated.calendar, updated);
}
/**
 * Aligned with `CalendarCreation`: create/update with members & opening hours,
 * or delete calendar only.
 */
export class CalendarCreation {
    static createWithRelationsAsync = createCalendarWithRelationsAsync;
    static updateWithRelationsAsync = updateCalendarWithRelationsAsync;
    static deleteCalendarAsync = deleteCalendarAsync;
}
