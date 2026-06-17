import { CalendarModel, CalendarParticipantModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { fetchCalendarAppointmentLocations } from "./fetchCalendarLocations.js";
import {
  emptyCalendarPreferencesBundle,
  fetchCalendarPreferences,
} from "../preference/fetchCalendarPreferences.js";
import { mergePreferencesIntoCalendarView } from "../preference/mergePreferencesIntoCalendarView.js";
import { mapToFrontendCalendarView } from "./mapToFrontendCalendarView.js";
import { mapToDesiredCalendarResponse } from "./mapToDesiredResponse.js";

/**
 * Fetches all calendars for a company and populates each with its members (participants).
 * Uses a highly optimized single-request approach per calendar to ensure speed in list views.
 * Results are normalized via mapToDesiredCalendarResponse.
 */
export async function getCalendarsByCompany(
  companyKey: string,
  connection: any = {}
) {
  const {
    includePreferences = false,
    includeLocations: includeLocationsOpt,
    viewFormat = "frontend",
    calendarIds: calendarIdsFilter,
    ...httpConnection
  } = connection ?? {};
  const includeLocations = includeLocationsOpt ?? includePreferences;
  const ready = ensureBlazeoHttpReady(httpConnection);
  if (!ready.ok) {
    throw new Error(ready.error);
  }

  // 1. Get all calendars for the company
  const result = await CalendarModel.getByCompany(companyKey, httpConnection);
  const calendars = Array.isArray(result) ? result : (result as any)?.calendars ?? [];

  if (!calendars || calendars.length === 0) {
    return [];
  }

  const filterIds = Array.isArray(calendarIdsFilter) ? calendarIdsFilter : [];
  const filterSet =
    filterIds.length > 0 &&
    new Set(
      filterIds
        .map((id: unknown) => String(id ?? "").trim().toLowerCase())
        .filter((id) => id.length > 0)
    );

  const calendarsToLoad = filterSet
    ? calendars.filter((cal: any) => {
        const id = String(cal.calendarId ?? cal.id ?? "").toLowerCase();
        return id && filterSet.has(id);
      })
    : calendars;

  // 2. Fetch lightweight members for each calendar in parallel
  const enrichedCalendars = await Promise.all(
    calendarsToLoad.map(async (cal: any) => {
      const calendarId = cal.calendarId ?? String(cal.id ?? "");
      if (!calendarId) return null;

      try {
        // Optimization: Use only getInfoByCalendar to get names/emails in a single request.
        // This is much faster for a list view than fetching both list and info records.
        const infoRaw = await CalendarParticipantModel.getInfoByCalendar(calendarId);
        const info = Array.isArray(infoRaw) ? infoRaw : (infoRaw as any)?.info ?? [];

        // Merge logic to ensure names are matched to IDs
        const membersMap = new Map<string, any>();

        // Use participantId GUID as the primary key
        const getAnyId = (obj: any) =>
          obj.participantId ?? obj.ParticipantId ?? obj.participant_id ?? obj.id ?? obj.Id;

        // 1. Process info list (Name, Email, Alias)
        info.forEach((i: any) => {
          const mid = getAnyId(i);
          if (!mid) return;
          const key = String(mid).toLowerCase();

          const resolvedEmail = i.email ?? i.Email ?? i.userSsoEmail ?? i.UserSsoEmail;
          const resolvedAliasRaw = i.alias ?? i.Alias ?? null;
          const resolvedNameRaw = i.name ?? i.Name ?? null;
          const resolvedAlias =
            resolvedAliasRaw != null && String(resolvedAliasRaw).trim() !== ""
              ? String(resolvedAliasRaw)
              : "";
          const resolvedName =
            resolvedNameRaw != null && String(resolvedNameRaw).trim() !== ""
              ? String(resolvedNameRaw)
              : "";
          const memberData = {
            id: mid,
            name: resolvedName || resolvedAlias || "",
            alias: resolvedAlias,
            email: resolvedEmail,
            status: i.status ?? i.Status ?? 1,
          };

          if (!membersMap.has(key)) {
            membersMap.set(key, memberData);
          }
        });

        const members = Array.from(membersMap.values());

        let view = mapToDesiredCalendarResponse(cal, [], members) as Record<string, any>;
        const [prefs, appointmentLocations] = await Promise.all([
          includePreferences
            ? fetchCalendarPreferences(calendarId, httpConnection)
            : Promise.resolve(null),
          includeLocations
            ? fetchCalendarAppointmentLocations(calendarId, httpConnection)
            : Promise.resolve(null),
        ]);
        if (prefs) {
          view = mergePreferencesIntoCalendarView(
            view,
            prefs ?? emptyCalendarPreferencesBundle()
          );
        }
        if (viewFormat === "frontend") {
          return mapToFrontendCalendarView(
            view,
            cal,
            [],
            Array.isArray(appointmentLocations) ? appointmentLocations : []
          );
        }
        return view;
      } catch (err) {
        console.error(`[getCalendarsByCompany] Error fetching members for ${calendarId}:`, err);
        // Fallback to minimal mapping if enrichment fails
        return mapToDesiredCalendarResponse(cal, [], []);
      }
    })
  );

  return enrichedCalendars.filter(Boolean);
}
