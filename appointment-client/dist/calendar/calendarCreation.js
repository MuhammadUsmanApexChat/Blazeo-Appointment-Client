import { calendarPayloadHasEventReminders } from "../preference/mapEventReminderPreference.js";
import { calendarPayloadHasTheme } from "../preference/mapCalendarThemePreference.js";
import { calendarPayloadHasFormFields } from "./mapCalendarForm.js";
import { calendarPayloadHasLocations } from "./mapCalendarLocation.js";
import { saveCalendarRelationsAfterSave } from "./saveCalendarRelationsAfterSave.js";
import { addParticipantToCalendar, removeParticipantFromCalendar, saveCalendarOpeningHoursBatch } from "./blazeoCalendarRelationMethods.js";
import { createCalendarAsync, updateCalendarAsync, deleteCalendarAsync } from "./createCalendar.js";
import { buildRelationSaveFailure } from "./buildCalendarCreateResult.js";
import { resolveCalendarIdAfterSave } from "./resolveCalendarIdAfterSave.js";
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
function effectiveCalendarId(calendarNode, input, apiResponse) {
    return resolveCalendarIdAfterSave(calendarNode, input, apiResponse);
}
async function saveRelationsAfterCalendarSave(calendar, calendarIdStr, options, baseSuccess, replaceLocationsOnSave = false) {
    if (options.localOnly) {
        return baseSuccess;
    }
    return saveCalendarRelationsAfterSave(calendar, calendarIdStr, {
        ...options,
        replaceLocationsOnSave,
        preserveBaseOnRelationFailure: Boolean(options.preserveBaseOnRelationFailure),
    }, baseSuccess);
}
export function calendarPayloadHasRelations(calendar) {
    return (calendarPayloadHasEventReminders(calendar) ||
        calendarPayloadHasTheme(calendar) ||
        calendarPayloadHasLocations(calendar) ||
        calendarPayloadHasFormFields(calendar));
}
/**
 * Orchestrates the same steps as Apex `CalendarCreation.CreateCalendarAsync`:
 * save calendar (`POST /Calendar/Create`), then add participants, then save opening hours
 * per day (`POST /Calendar/Participant/Availability/OpeningHour/Save`).
 */
export async function createCalendarWithRelationsAsync(calendar, options = {}) {
    const createOptions = { ...options, preserveBaseOnRelationFailure: true };
    const hasMembers = (calendar.members?.length ?? 0) > 0;
    const hasHours = (calendar.openingHours?.length ?? 0) > 0;
    try {
        if (!hasMembers && !hasHours) {
            const r = await createCalendarAsync(calendar, createOptions);
            if (!r.ok)
                return r;
            const calendarIdStr = effectiveCalendarId(r.calendar, calendar, r.apiResponse);
            if (!calendarIdStr) {
                return { ...r, membersAdded: 0, openingHoursSaved: 0 };
            }
            return saveRelationsAfterCalendarSave(calendar, calendarIdStr, createOptions, { ...r, calendarId: calendarIdStr, membersAdded: 0, openingHoursSaved: 0 });
        }
        if (createOptions.localOnly) {
            const r = await createCalendarAsync(calendar, createOptions);
            if (!r.ok)
                return r;
            return { ...r, membersAdded: 0, openingHoursSaved: 0 };
        }
        const created = await createCalendarAsync(calendar, createOptions);
        if (!created.ok)
            return created;
        return runMembersAndOpeningHoursAfterCalendarSave(calendar, created.calendar, created, createOptions, false, true);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
    }
}
function relationFailure(baseSuccess, calendarId, error, options, apiResponse) {
    if (options?.preserveBaseOnRelationFailure && baseSuccess?.ok) {
        return buildRelationSaveFailure(baseSuccess, calendarId, error, apiResponse);
    }
    return {
        ok: false,
        error,
        ...(apiResponse != null ? { apiResponse } : {}),
    };
}
/**
 * After calendar `create` or `update`, add members and opening hours (same order as Apex facade).
 */
async function runMembersAndOpeningHoursAfterCalendarSave(calendar, calendarNode, baseSuccess, options = {}, replaceLocationsOnSave = false, isCreate = false) {
    const calendarIdStr = effectiveCalendarId(calendarNode, calendar, baseSuccess?.apiResponse);
    if (!calendarIdStr) {
        return relationFailure(baseSuccess, "", "Could not resolve calendar id after save. Ensure the API returned a calendar id.", options);
    }
    // 1. Participant reconciliation — skip fetch on create (new calendar has no members yet).
    let currentParticipantIds = [];
    if (!isCreate) {
        try {
            const currentRaw = await calendarNode.getParticipants();
            currentParticipantIds = unwrapParticipantIds(currentRaw);
        }
        catch (err) {
            console.warn("[calendarCreation] Failed to fetch current participants for reconciliation. Proceeding with additive mode.", err);
        }
    }
    const desiredMembers = calendar.members ?? [];
    const desiredIds = new Set(desiredMembers.map((m) => normalizeParticipantGuid(m.id)).filter(Boolean));
    if (!isCreate) {
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
    }
    const existingIdSet = new Set(currentParticipantIds);
    let membersAdded = 0;
    for (const m of desiredMembers) {
        const pid = normalizeParticipantGuid(m.id);
        if (!pid) {
            return relationFailure(baseSuccess, calendarIdStr, `Member id ${m.id}: thirdPartyMemberId is required to add a participant.`, options);
        }
        if (!existingIdSet.has(pid)) {
            const res = await addParticipantToCalendar(calendarNode, pid);
            if (isFailureStatus(res)) {
                const msg = res.message ??
                    (typeof res.data === "string" ? res.data : undefined) ??
                    JSON.stringify(res);
                return relationFailure(baseSuccess, calendarIdStr, `addParticipant failed for member ${m.id}: ${msg}`, options, res);
            }
            membersAdded += 1;
        }
    }
    const openingHours = calendar.openingHours ?? [];
    const hoursByParticipant = new Map();
    for (const oh of openingHours) {
        const participantId = resolveParticipantIdForOpeningHour(oh);
        if (!participantId) {
            return relationFailure(baseSuccess, calendarIdStr, `Opening hour id ${oh.id}: participantId is required.`, options);
        }
        if (!hoursByParticipant.has(participantId)) {
            hoursByParticipant.set(participantId, []);
        }
        const activeDays = oh.days ?? [];
        for (let day = 0; day <= 6; day++) {
            const isIncluded = activeDays.includes(day);
            const isOff = isIncluded ? !!oh.off : true;
            hoursByParticipant.get(participantId)?.push({
                calendarId: calendarIdStr,
                participantId,
                day,
                startHour: oh.startHour,
                startMinute: oh.startMinute,
                endHour: oh.endHour,
                endMinute: oh.endMinute,
                off: isOff,
                openingHourId: newOpeningHourId(),
            });
        }
    }
    let openingHoursSaved = 0;
    for (const [participantId, payload] of hoursByParticipant.entries()) {
        if (payload.length === 0)
            continue;
        if (!isCreate) {
            await calendarNode.removeParticipantOpeningHours(participantId);
        }
        const res = await saveCalendarOpeningHoursBatch(calendarNode, payload);
        if (isFailureStatus(res)) {
            const msg = res.message ??
                (typeof res.data === "string" ? res.data : undefined) ??
                JSON.stringify(res);
            return relationFailure(baseSuccess, calendarIdStr, `saveOpeningHours batch failed for participant ${participantId}: ${msg}`, options, res);
        }
        openingHoursSaved += payload.length;
    }
    const withPrefs = await saveRelationsAfterCalendarSave(calendar, calendarIdStr, options, {
        ...baseSuccess,
        calendarId: calendarIdStr,
        membersAdded,
        openingHoursSaved,
    }, replaceLocationsOnSave);
    return withPrefs;
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
        const calendarIdStr = effectiveCalendarId(r.calendar, calendar, r.apiResponse);
        if (!calendarIdStr) {
            return { ...r, membersAdded: 0, openingHoursSaved: 0 };
        }
        const withPrefs = await saveRelationsAfterCalendarSave(calendar, calendarIdStr, options, { ...r, membersAdded: 0, openingHoursSaved: 0 }, true);
        return withPrefs;
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
    return runMembersAndOpeningHoursAfterCalendarSave(calendar, updated.calendar, updated, options, true);
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
