import { CalendarModel } from "@blazeo.com/calendar-client";
import { getSnapshot } from "mobx-state-tree";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import {
  unwrapCalendarGetData,
  pickOpeningHoursArrayFromCalendarPayload,
  normalizeParticipantOpeningHoursResponse,
} from "./fetchCalendarWithOpeningHours.js";
import { buildUnifiedCalendarView, type UnifiedCalendarView } from "./buildUnifiedCalendarView.js";
import { mapToDesiredCalendarResponse } from "./mapToDesiredResponse.js";

/**
 * Normalizes the REST envelope from `calendar.getParticipantOpeningHours()`
 * (`GET /Calendar/Participant/OpeningHours/Get`) into a plain row array.
 */
export function normalizeOpeningHours(res: any): any[] {
  const { list } = normalizeParticipantOpeningHoursResponse(res);
  return Array.isArray(list) ? list : [];
}

function normalizeAllParticipantOpeningHoursResult(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  const { list } = normalizeParticipantOpeningHoursResponse(raw);
  return Array.isArray(list) ? list : [];
}

/** Prefer union of `/Participant/All` and `/Participant/Get` so members reconcile when either list is incomplete. */
function mergeParticipantSnapshots(
  a: any[] | null | undefined,
  b: any[] | null | undefined
): any[] {
  const byKey = new Map<string, any>();
  const ingest = (p: any) => {
    if (p == null) return;
    const participantId = String(
      p.participantId ?? p.ParticipantId ?? p.participant_id ?? ""
    ).trim().toLowerCase();
    const calPartId = String(
      p.calendarParticipantId ?? p.CalendarParticipantId ?? p.calendarparticipant_id ?? ""
    ).trim()
      .toLowerCase();
    const key = participantId || calPartId;
    if (!key) return;
    if (!byKey.has(key)) byKey.set(key, p);
  };
  if (Array.isArray(a)) a.forEach(ingest);
  if (Array.isArray(b)) b.forEach(ingest);
  return [...byKey.values()];
}

/** Coerce MST / envelope / nested `data` shapes into a plain array for participants and GetInfo lists. */
function unwrapModelList(raw: any): any[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      return unwrapModelList(JSON.parse(raw));
    } catch {
      return [];
    }
  }
  if (typeof raw !== "object") return [];
  const topArr = (raw as any).items ?? (raw as any).Items;
  if (Array.isArray(topArr)) return topArr;
  const d = raw.data ?? raw.Data;
  if (Array.isArray(d)) return d;
  if (d != null && typeof d === "object") {
    const inner = (d as any).data ?? (d as any).Data ?? (d as any).items ?? (d as any).Items;
    if (Array.isArray(inner)) return inner;
  }
  return [];
}

/**
 * Calendar + legacy opening hours + full detail bundle (`fetchCalendarDetails`), **or**
 * only the **single unified object** via {@link fetchCalendarBundle}.
 *
 * **Flow**
 * 1. **Calendar** — parallel `CalendarModel.get` + `getRaw` (both `GET /Calendar/Get`: model + raw envelope).
 * 2. **Legacy `openingHours`** — embed from raw, else `getParticipantOpeningHours` (narrow endpoint).
 * 3. **`calendarView` (one object)** — in parallel after calendar is known:
 *    - `GET /Calendar/Participant/All` and optional `/Participant/Get` merge when both return rows.
 *    - `GET /Calendar/Participants/GetInfo`
 *    - `GET /Calendar/Participant/OpeningHours/All/Get` when options enable it (`preferAllParticipantOpeningHours`)
 *    Then `calendarView` = calendar snapshot fields + **`members`** (with **`participantInfo`**) + **`openingHours`**
 *    (`openingHours[].member` → `members[].id`).
 *
 * Server still performs multiple HTTP calls; on the client, **`calendarView`** is returned as **one object**.
 */
export async function fetchCalendarDetails(
  calendarId: string,
  options: {
    includeParticipantsInfo?: boolean;
    includeUnifiedCalendarView?: boolean;
    /** Prefer all-participant opening hours for **`calendarView`** when the API returns rows (default `true`). */
    preferAllParticipantOpeningHours?: boolean;
    /** Optional; applied with `resolveBlazeoConnection` so `CalendarModel.get` sees `baseUrl` without prior global `configure`. */
    baseUrl?: string;
    consumer?: string;
  } = {}
) {
  const {
    includeParticipantsInfo = false,
    includeUnifiedCalendarView = true,
    preferAllParticipantOpeningHours = true,
    baseUrl: optBaseUrl,
    consumer: optConsumer,
  } = options;

  const conn = ensureBlazeoHttpReady({ baseUrl: optBaseUrl, consumer: optConsumer });
  if (!conn.ok) {
    return {
      calendar: null,
      cal: null,
      calendarView: null as UnifiedCalendarView | null,
      openingHours: [] as any[],
      participants: [] as any[],
      participantsInfo: null as any,
      allParticipantOpeningHours: null as any[] | null,
      embeddedFromGet: [] as any[],
      fromCalendarGet: false,
      fromParticipantApi: false,
      participantOpeningHoursResponse: null as any,
      rawGet: null as any,
      meta: { ok: false as const, reason: "missing_base_url" as const, detail: conn.error },
    };
  }

  const fetchParticipantsInfo = includeParticipantsInfo || includeUnifiedCalendarView;
  const fetchAllHours = includeUnifiedCalendarView && preferAllParticipantOpeningHours;

  // Calendar: `GET /Calendar/Get` is used to get the raw data first.
  const rawRes = await (CalendarModel as any).getRaw(calendarId);
    const payload = unwrapCalendarGetData(rawRes);
    if (!payload) {
      return {
        calendar: null,
        cal: null,
        calendarView: null as UnifiedCalendarView | null,
        openingHours: [],
        participants: null,
        participantsInfo: null,
        allParticipantOpeningHours: null,
        embeddedFromGet: [],
        fromCalendarGet: false,
        fromParticipantApi: false,
        participantOpeningHoursResponse: null as any,
        rawGet: rawRes,
        meta: { ok: false as const, reason: "calendar_not_found" },
      };
    }

    // Build the model instance manually to ensure the environment is correctly set.
    // The static CalendarModel.get in calendar-client has a bug where it wraps env in { env: ... }.
    const cal: any = (CalendarModel as any).create(
      { ...payload, calendarId },
      { baseUrl: conn.baseUrl, consumer: conn.consumer }
    );

  const embedded = pickOpeningHoursArrayFromCalendarPayload(payload) ?? [];
  let participantOpeningHoursResponse: any = null;
  let resolved: any[] | null = embedded.length > 0 ? embedded : null;

  if ((resolved == null || resolved.length === 0) && cal != null) {
    participantOpeningHoursResponse = await cal.getParticipantOpeningHours({ calendarId });
    const { list } = normalizeParticipantOpeningHoursResponse(participantOpeningHoursResponse);
    if (list != null && list.length > 0) resolved = list;
  }

  const openingHours = Array.isArray(resolved) ? resolved : [];

  // 2) Participants + participant info + all participant opening hours (parallel)
  const getCalPart = (CalendarModel as any).getCalendarParticipant;
  const participantsViaGetPromise =
    includeUnifiedCalendarView && typeof getCalPart === "function"
      ? getCalPart.call(CalendarModel, calendarId)
      : Promise.resolve(null);

  const [participantsRaw, participantsViaGet, participantsInfoRaw, allHoursRaw] = await Promise.all([
    cal.getParticipants(),
    participantsViaGetPromise,
    fetchParticipantsInfo ? cal.getParticipantsInfo() : Promise.resolve(null),
    fetchAllHours ? cal.getAllParticipantOpeningHours() : Promise.resolve(null),
  ]);

  const participantList = mergeParticipantSnapshots(
    unwrapModelList(participantsRaw),
    unwrapModelList(participantsViaGet)
  );
  
  const infoList = unwrapModelList(participantsInfoRaw);


  // Merge participantList and infoList to ensure we have all members
  const mergedParticipantsMap = new Map<string, any>();
  
  // Prefer the participantId GUID; fall back to numeric id.
  const getAnyId = (obj: any) =>
    obj.participantId ?? obj.ParticipantId ?? obj.participant_id ?? obj.id ?? obj.Id;

  // 1. Add from standard list
  participantList.forEach((p: any) => {
    const id = getAnyId(p);
    if (id) {
      mergedParticipantsMap.set(String(id).toLowerCase(), {
        id: id,
        name: p.name ?? p.Name ?? p.alias ?? p.Alias ?? "Member",
        email: p.email ?? p.Email,
        status: p.status ?? p.Status ?? 0,
      });
    }
  });

  // 2. Add from info list (fallback/enrich)
  infoList.forEach((i: any) => {
    const id = getAnyId(i);
    if (!id) return;
    const key = String(id).toLowerCase();
    const existing = mergedParticipantsMap.get(key);
    
    if (!existing) {
      mergedParticipantsMap.set(key, {
        id: id,
        name: i.alias || i.Alias || i.name || i.Name || "Member",
        email: i.email || i.Email,
        status: i.status ?? i.Status ?? (i.isApproved ? 1 : 0),
      });
    } else {
      // Enrich existing with email/name if missing
      if (!existing.email) existing.email = i.email || i.Email;
      if (!existing.name || existing.name === "Member") {
        existing.name = i.alias || i.Alias || i.name || i.Name || existing.name;
      }
    }
  });

  // 3. Synthetic Fallback: If openingHours reference a member we don't have, add them.
  openingHours.forEach((oh: any) => {
    const mid = oh.member ?? oh.Member ?? oh.participantId ?? oh.ParticipantId;
    if (mid) {
      const key = String(mid).toLowerCase();
      if (!mergedParticipantsMap.has(key)) {
        mergedParticipantsMap.set(key, {
          id: mid,
          name: "Member",
          email: null,
          status: 0,
        });
      }
    }
  });

  const finalParticipantList = Array.from(mergedParticipantsMap.values());
  const allParticipantOpeningHours = fetchAllHours ? normalizeAllParticipantOpeningHoursResult(allHoursRaw) : null;

  const openingHoursForUnifiedView =
    includeUnifiedCalendarView &&
    preferAllParticipantOpeningHours &&
    allParticipantOpeningHours != null &&
    allParticipantOpeningHours.length > 0
      ? allParticipantOpeningHours
      : openingHours;

  const calendarViewRaw = includeUnifiedCalendarView
    ? buildUnifiedCalendarView(payload as any, openingHoursForUnifiedView, finalParticipantList, infoList)
    : null;

  const calendarView = calendarViewRaw ? mapToDesiredCalendarResponse(calendarViewRaw, calendarViewRaw.openingHours, calendarViewRaw.members) : null;


  const unifiedUsedAllEndpoint =
    includeUnifiedCalendarView &&
    preferAllParticipantOpeningHours &&
    allParticipantOpeningHours != null &&
    allParticipantOpeningHours.length > 0;

  if (!calendarView) return null as any;

  // Attach metadata as non-enumerable properties so they don't show up in JSON.stringify
  // but are still accessible for debugging if needed.
  Object.defineProperties(calendarView, {
    _cal: { value: cal, enumerable: false },
    _participants: { value: participantList, enumerable: false },
    _openingHours: { value: openingHours, enumerable: false },
    _rawGet: { value: rawRes, enumerable: false },
    _meta: { 
      value: {
        ok: true,
        calendarViewUsedAllParticipantOpeningHours: unifiedUsedAllEndpoint,
        calendarViewMemberCount: calendarView.members.length,
        calendarViewOpeningHourCount: calendarView.openingHours.length,
      }, 
      enumerable: false 
    },
  });

  return calendarView as any;
}

/**
 * Single return value only: unified calendar **`calendarView`** —
 * snapshot fields plus **`members`** (with **`participantInfo`**) plus **`openingHours`**
 * (prefers all-participant opening hours when available). Same shape as `fetchCalendarDetails().calendarView`.
 * Returns **`null`** if the calendar cannot be loaded (`CalendarModel.get`).
 */
export async function fetchCalendarBundle(
  calendarId: string,
  connection?: { baseUrl?: string; consumer?: string }
): Promise<UnifiedCalendarView | null> {
  const d = await fetchCalendarDetails(calendarId, {
    includeUnifiedCalendarView: true,
    includeParticipantsInfo: true,
    preferAllParticipantOpeningHours: true,
    ...connection,
  });
  if (!d) return null;
  return d;
}
