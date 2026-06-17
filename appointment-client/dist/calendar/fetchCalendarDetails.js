import { CalendarModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { unwrapCalendarGetData, pickOpeningHoursArrayFromCalendarPayload, normalizeParticipantOpeningHoursResponse, } from "./fetchCalendarWithOpeningHours.js";
import { buildUnifiedCalendarView } from "./buildUnifiedCalendarView.js";
import { fetchCalendarAppointmentLocations } from "./fetchCalendarLocations.js";
import { fetchCalendarAppointmentForm } from "./fetchCalendarForm.js";
import { emptyCalendarPreferencesBundle, fetchCalendarPreferences, } from "../preference/fetchCalendarPreferences.js";
import { mergePreferencesIntoCalendarView } from "../preference/mergePreferencesIntoCalendarView.js";
import { mapToFrontendCalendarView, } from "./mapToFrontendCalendarView.js";
import { mapToDesiredCalendarResponse } from "./mapToDesiredResponse.js";
/**
 * Normalizes the REST envelope from `calendar.getParticipantOpeningHours()`
 * (`GET /Calendar/Participant/OpeningHours/Get`) into a plain row array.
 */
export function normalizeOpeningHours(res) {
    const { list } = normalizeParticipantOpeningHoursResponse(res);
    return Array.isArray(list) ? list : [];
}
function normalizeAllParticipantOpeningHoursResult(raw) {
    if (Array.isArray(raw))
        return raw;
    const { list } = normalizeParticipantOpeningHoursResponse(raw);
    return Array.isArray(list) ? list : [];
}
/** Prefer union of `/Participant/All` and `/Participant/Get` so members reconcile when either list is incomplete. */
function mergeParticipantSnapshots(a, b) {
    const byKey = new Map();
    const ingest = (p) => {
        if (p == null)
            return;
        const participantId = String(p.participantId ?? p.ParticipantId ?? p.participant_id ?? "").trim().toLowerCase();
        const calPartId = String(p.calendarParticipantId ?? p.CalendarParticipantId ?? p.calendarparticipant_id ?? "").trim()
            .toLowerCase();
        const key = participantId || calPartId;
        if (!key)
            return;
        if (!byKey.has(key))
            byKey.set(key, p);
    };
    if (Array.isArray(a))
        a.forEach(ingest);
    if (Array.isArray(b))
        b.forEach(ingest);
    return [...byKey.values()];
}
/** Coerce MST / envelope / nested `data` shapes into a plain array for participants and GetInfo lists. */
function unwrapModelList(raw) {
    if (raw == null)
        return [];
    if (Array.isArray(raw))
        return raw;
    if (typeof raw === "string") {
        try {
            return unwrapModelList(JSON.parse(raw));
        }
        catch {
            return [];
        }
    }
    if (typeof raw !== "object")
        return [];
    const topArr = raw.items ?? raw.Items;
    if (Array.isArray(topArr))
        return topArr;
    const d = raw.data ?? raw.Data;
    if (Array.isArray(d))
        return d;
    if (d != null && typeof d === "object") {
        const inner = d.data ?? d.Data ?? d.items ?? d.Items;
        if (Array.isArray(inner))
            return inner;
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
 * 4. **Preferences** (when `includePreferences`, default with unified view) — parallel
 *    `GET /preference/{SMSEventReminder|EmailEventReminder|InAppEventReminder|CalendarTheme}?keys={calendarId}`;
 *    merged as **`preferences`**, plus **`appointmentReminders`** / **`logoUrl`** / **`color`** when not already on the calendar payload.
 *
 * Server still performs multiple HTTP calls; on the client, **`calendarView`** is returned as **one object**.
 */
export async function fetchCalendarDetails(calendarId, options = {}) {
    const { includeParticipantsInfo = false, includeUnifiedCalendarView = true, preferAllParticipantOpeningHours = true, includePreferences: includePreferencesOpt, includeLocations: includeLocationsOpt, includeFormFields: includeFormFieldsOpt, viewFormat = "frontend", baseUrl: optBaseUrl, consumer: optConsumer, } = options;
    const includePreferences = includePreferencesOpt ?? includeUnifiedCalendarView;
    const includeLocations = includeLocationsOpt ?? includePreferences;
    const includeFormFields = includeFormFieldsOpt ?? includeUnifiedCalendarView;
    const conn = ensureBlazeoHttpReady({ baseUrl: optBaseUrl, consumer: optConsumer });
    if (!conn.ok) {
        return {
            calendar: null,
            cal: null,
            calendarView: null,
            openingHours: [],
            participants: [],
            participantsInfo: null,
            allParticipantOpeningHours: null,
            embeddedFromGet: [],
            fromCalendarGet: false,
            fromParticipantApi: false,
            participantOpeningHoursResponse: null,
            rawGet: null,
            meta: { ok: false, reason: "missing_base_url", detail: conn.error },
        };
    }
    const fetchParticipantsInfo = includeParticipantsInfo || includeUnifiedCalendarView;
    const fetchAllHours = includeUnifiedCalendarView && preferAllParticipantOpeningHours;
    // Calendar: `GET /Calendar/Get` is used to get the raw data first.
    const rawRes = await CalendarModel.getRaw(calendarId);
    const payload = unwrapCalendarGetData(rawRes);
    if (!payload) {
        return {
            calendar: null,
            cal: null,
            calendarView: null,
            openingHours: [],
            participants: null,
            participantsInfo: null,
            allParticipantOpeningHours: null,
            embeddedFromGet: [],
            fromCalendarGet: false,
            fromParticipantApi: false,
            participantOpeningHoursResponse: null,
            rawGet: rawRes,
            meta: { ok: false, reason: "calendar_not_found" },
        };
    }
    // Build the model instance manually to ensure the environment is correctly set.
    // The static CalendarModel.get in calendar-client has a bug where it wraps env in { env: ... }.
    const cal = CalendarModel.create({ ...payload, calendarId }, { baseUrl: conn.baseUrl, consumer: conn.consumer });
    const embedded = pickOpeningHoursArrayFromCalendarPayload(payload) ?? [];
    let participantOpeningHoursResponse = null;
    let resolved = embedded.length > 0 ? embedded : null;
    if ((resolved == null || resolved.length === 0) && cal != null) {
        participantOpeningHoursResponse = await cal.getParticipantOpeningHours({ calendarId });
        const { list } = normalizeParticipantOpeningHoursResponse(participantOpeningHoursResponse);
        if (list != null && list.length > 0)
            resolved = list;
    }
    const openingHours = Array.isArray(resolved) ? resolved : [];
    // 2) Participants + participant info + all participant opening hours (parallel)
    const getCalPart = CalendarModel.getCalendarParticipant;
    const participantsViaGetPromise = includeUnifiedCalendarView && typeof getCalPart === "function"
        ? getCalPart.call(CalendarModel, calendarId)
        : Promise.resolve(null);
    const preferencesPromise = includePreferences
        ? fetchCalendarPreferences(calendarId, {
            baseUrl: conn.baseUrl,
            consumer: conn.consumer,
        })
        : Promise.resolve(null);
    const locationsPromise = includeLocations
        ? fetchCalendarAppointmentLocations(calendarId, {
            baseUrl: conn.baseUrl,
            consumer: conn.consumer,
        })
        : Promise.resolve(null);
    const formFieldsPromise = includeFormFields
        ? fetchCalendarAppointmentForm(calendarId, {
            baseUrl: conn.baseUrl,
            consumer: conn.consumer,
        })
        : Promise.resolve(null);
    const [participantsRaw, participantsViaGet, participantsInfoRaw, allHoursRaw, preferencesBundle, appointmentLocations, appointmentUserDefinedFields,] = await Promise.all([
        cal.getParticipants(),
        participantsViaGetPromise,
        fetchParticipantsInfo ? cal.getParticipantsInfo() : Promise.resolve(null),
        fetchAllHours ? cal.getAllParticipantOpeningHours() : Promise.resolve(null),
        preferencesPromise,
        locationsPromise,
        formFieldsPromise,
    ]);
    const participantList = mergeParticipantSnapshots(unwrapModelList(participantsRaw), unwrapModelList(participantsViaGet));
    const infoList = unwrapModelList(participantsInfoRaw);
    // Merge participantList and infoList to ensure we have all members
    const mergedParticipantsMap = new Map();
    // Prefer the participantId GUID; fall back to numeric id.
    const getAnyId = (obj) => obj.participantId ?? obj.ParticipantId ?? obj.participant_id ?? obj.id ?? obj.Id;
    // 1. Add from standard list
    participantList.forEach((p) => {
        const id = getAnyId(p);
        if (id) {
            mergedParticipantsMap.set(String(id).toLowerCase(), {
                id: id,
                name: p.name ?? p.Name ?? p.alias ?? p.Alias ?? "",
                email: p.email ?? p.Email,
                status: p.status ?? p.Status ?? 0,
            });
        }
    });
    // 2. Add from info list (fallback/enrich)
    infoList.forEach((i) => {
        const id = getAnyId(i);
        if (!id)
            return;
        const key = String(id).toLowerCase();
        const existing = mergedParticipantsMap.get(key);
        if (!existing) {
            mergedParticipantsMap.set(key, {
                id: id,
                name: i.alias || i.Alias || i.name || i.Name || "",
                email: i.email || i.Email,
                status: i.status ?? i.Status ?? (i.isApproved ? 1 : 0),
            });
        }
        else {
            // Enrich existing with email/name if missing
            if (!existing.email)
                existing.email = i.email || i.Email;
            if (!existing.name) {
                existing.name = i.alias || i.Alias || i.name || i.Name || existing.name;
            }
        }
    });
    // 3. Synthetic Fallback: If openingHours reference a member we don't have, add them.
    openingHours.forEach((oh) => {
        const mid = oh.member ?? oh.Member ?? oh.participantId ?? oh.ParticipantId;
        if (mid) {
            const key = String(mid).toLowerCase();
            if (!mergedParticipantsMap.has(key)) {
                mergedParticipantsMap.set(key, {
                    id: mid,
                    name: "",
                    email: null,
                    status: 0,
                });
            }
        }
    });
    const finalParticipantList = Array.from(mergedParticipantsMap.values());
    const allParticipantOpeningHours = fetchAllHours ? normalizeAllParticipantOpeningHoursResult(allHoursRaw) : null;
    const openingHoursForUnifiedView = includeUnifiedCalendarView &&
        preferAllParticipantOpeningHours &&
        allParticipantOpeningHours != null &&
        allParticipantOpeningHours.length > 0
        ? allParticipantOpeningHours
        : openingHours;
    const calendarViewRaw = includeUnifiedCalendarView
        ? buildUnifiedCalendarView(payload, openingHoursForUnifiedView, finalParticipantList, infoList)
        : null;
    const calendarView = calendarViewRaw ? mapToDesiredCalendarResponse(calendarViewRaw, calendarViewRaw.openingHours, calendarViewRaw.members) : null;
    const unifiedUsedAllEndpoint = includeUnifiedCalendarView &&
        preferAllParticipantOpeningHours &&
        allParticipantOpeningHours != null &&
        allParticipantOpeningHours.length > 0;
    if (!calendarView)
        return null;
    // Use the mapper to normalize the final output, ensuring all fields like duration, 
    // bookingPageTitle, calendarId, etc. are correctly picked and named.
    let finalView = mapToDesiredCalendarResponse(payload, calendarView.openingHours, calendarView.members);
    if (includePreferences) {
        const prefs = preferencesBundle ?? emptyCalendarPreferencesBundle();
        finalView = mergePreferencesIntoCalendarView(finalView, prefs);
    }
    if (includeFormFields &&
        Array.isArray(appointmentUserDefinedFields) &&
        appointmentUserDefinedFields.length > 0) {
        finalView.appointmentUserDefinedFields = appointmentUserDefinedFields;
    }
    let responseView = finalView;
    if (viewFormat === "frontend") {
        responseView = mapToFrontendCalendarView(finalView, payload, openingHoursForUnifiedView, Array.isArray(appointmentLocations) ? appointmentLocations : []);
    }
    // Attach metadata as non-enumerable properties so they don't show up in JSON.stringify
    // but are still accessible for debugging if needed.
    Object.defineProperties(responseView, {
        _cal: { value: cal, enumerable: false },
        _participants: { value: participantList, enumerable: false },
        _openingHours: { value: openingHours, enumerable: false },
        _rawGet: { value: rawRes, enumerable: false },
        _enriched: { value: finalView, enumerable: false },
        _meta: {
            value: {
                ok: true,
                viewFormat,
                calendarViewUsedAllParticipantOpeningHours: unifiedUsedAllEndpoint,
                calendarViewMemberCount: calendarView.members.length,
                calendarViewOpeningHourCount: calendarView.openingHours.length,
                preferencesIncluded: includePreferences,
                preferenceSmsOptionCount: finalView?.preferences?.smsEventReminder?.options?.length ?? 0,
                preferenceEmailOptionCount: finalView?.preferences?.emailEventReminder?.options?.length ?? 0,
                preferenceInAppOptionCount: finalView?.preferences?.inAppEventReminder?.options?.length ?? 0,
                preferenceThemeLoaded: (finalView?.preferences?.calendarTheme?.options?.length ?? 0) > 0,
                locationsIncluded: includeLocations,
                appointmentLocationCount: Array.isArray(appointmentLocations)
                    ? appointmentLocations.length
                    : 0,
                formFieldsIncluded: includeFormFields,
                appointmentUserDefinedFieldCount: Array.isArray(appointmentUserDefinedFields)
                    ? appointmentUserDefinedFields.length
                    : 0,
            },
            enumerable: false
        },
    });
    return responseView;
}
/**
 * Single return value only: unified calendar **`calendarView`** —
 * snapshot fields plus **`members`** (with **`participantInfo`**) plus **`openingHours`**
 * (prefers all-participant opening hours when available). Same shape as `fetchCalendarDetails().calendarView`.
 * Returns **`null`** if the calendar cannot be loaded (`CalendarModel.get`).
 */
export async function fetchCalendarBundle(calendarId, connection) {
    const d = await fetchCalendarDetails(calendarId, {
        includeUnifiedCalendarView: true,
        includeParticipantsInfo: true,
        preferAllParticipantOpeningHours: true,
        viewFormat: connection?.viewFormat ?? "frontend",
        ...connection,
    });
    if (!d)
        return null;
    return d;
}
