import { getSnapshot } from "mobx-state-tree";
import { addParticipantToCalendar, saveCalendarOpeningHour, saveCalendarOpeningHoursBatch } from "./blazeoCalendarRelationMethods.js";
import { createCalendarAsync, updateCalendarAsync, deleteCalendarAsync } from "./createCalendar.js";

function isFailureStatus(res: any) {
  return res.status !== "success" && res.status !== "Success";
}

function normalizeParticipantGuid(id: any) {
  if (id == null || !String(id).trim()) return undefined;
  return String(id).trim().replace(/^\{|\}$/g, "");
}

function newOpeningHourId() {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Resolves Blazeo `participantId` for an opening-hour row: explicit `participantId`,
 * matching `CalendarCreation.SaveOpeningHours`.
 */
export function resolveParticipantIdForOpeningHour(openingHour: any) {
  const direct = normalizeParticipantGuid(openingHour.participantId);
  if (direct) return direct;
  return undefined;
}

function effectiveCalendarId(calendarNode: any, input: any) {
  const snap = getSnapshot(calendarNode) as any;
  const fromNode = snap.calendarId?.trim();
  if (fromNode && fromNode !== "new") return fromNode;
  return (input.calendarId?.trim() || undefined);
}

/**
 * Orchestrates the same steps as Apex `CalendarCreation.CreateCalendarAsync`:
 * save calendar (`POST /Calendar/Create`), then add participants, then save opening hours
 * per day (`POST /Calendar/Participant/Availability/OpeningHour/Save`).
 */
export async function createCalendarWithRelationsAsync(calendar: any, options: any = {}) {
  const hasMembers = (calendar.members?.length ?? 0) > 0;
  const hasHours = (calendar.openingHours?.length ?? 0) > 0;

  if (!hasMembers && !hasHours) {
    const r = await createCalendarAsync(calendar, options);
    if (!r.ok) return r;
    return { ...r, membersAdded: 0, openingHoursSaved: 0 };
  }

  if (options.localOnly) {
    const r = await createCalendarAsync(calendar, options);
    if (!r.ok) return r;
    return { ...r, membersAdded: 0, openingHoursSaved: 0 };
  }

  const created = await createCalendarAsync(calendar, options);
  if (!created.ok) return created;

  return runMembersAndOpeningHoursAfterCalendarSave(calendar, created.calendar, created);
}

/**
 * After calendar `create` or `update`, add members and opening hours (same order as Apex facade).
 */
async function runMembersAndOpeningHoursAfterCalendarSave(calendar: any, calendarNode: any, baseSuccess: any) {
  const calendarIdStr = effectiveCalendarId(calendarNode, calendar);
  if (!calendarIdStr) {
    return {
      ok: false,
      error: "Could not resolve calendar id after save. Ensure the API returned a calendar id.",
    };
  }

  let membersAdded = 0;
  for (const m of calendar.members ?? []) {
    const pid = normalizeParticipantGuid(m.id);
    if (!pid) {
      return {
        ok: false,
        error: `Member id ${m.id}: thirdPartyMemberId is required to add a participant.`,
      };
    }
    const res = await addParticipantToCalendar(calendarNode, pid);
    if (isFailureStatus(res)) {
      const msg =
        res.message ??
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

  // 2. Save Opening Hours (Plan V2: Grouped by participant with explicit off-days per slot)
  const openingHours = calendar.openingHours ?? [];
  const hoursByParticipant = new Map<string, any[]>();

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
        openingHourId: openingHourId,
      });
    }
  }

  let openingHoursSaved = 0;
  for (const [participantId, payload] of hoursByParticipant.entries()) {
    if (payload.length === 0) continue;

    // Use the batch save method (plural)
    const res = await saveCalendarOpeningHoursBatch(calendarNode, payload);
    
    if (isFailureStatus(res)) {
      const msg =
        res.message ??
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
export async function updateCalendarWithRelationsAsync(calendar: any, options: any = {}) {
  const hasMembers = (calendar.members?.length ?? 0) > 0;
  const hasHours = (calendar.openingHours?.length ?? 0) > 0;

  if (!hasMembers && !hasHours) {
    const r = await updateCalendarAsync(calendar, options);
    if (!r.ok) return r;
    return { ...r, membersAdded: 0, openingHoursSaved: 0 };
  }

  if (options.localOnly) {
    const r = await updateCalendarAsync(calendar, options);
    if (!r.ok) return r;
    return { ...r, membersAdded: 0, openingHoursSaved: 0 };
  }

  const updated = await updateCalendarAsync(calendar, options);
  if (!updated.ok) return updated;

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
