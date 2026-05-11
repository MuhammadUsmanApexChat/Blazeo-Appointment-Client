import { CalendarModel, CalendarParticipantModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";

/**
 * Fetches all calendars for a company and populates each with its members (participants).
 * Fetches both Participant List and Participant Info to ensure names and emails are included,
 * while still skipping heavy data like opening hours.
 */
export async function getCalendarsByCompany(
  companyKey: string,
  connection: { baseUrl?: string; consumer?: string } = {}
) {
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    throw new Error(ready.error);
  }

  // 1. Get all calendars for the company
  const result = await CalendarModel.getByCompany(companyKey);
  const calendars = Array.isArray(result) ? result : (result as any)?.calendars ?? [];

  if (!calendars || calendars.length === 0) {
    return [];
  }

  // 2. Fetch lightweight members for each calendar in parallel
  const enrichedCalendars = await Promise.all(
    calendars.map(async (cal: any) => {
      const calendarId = cal.calendarId ?? String(cal.id ?? "");
      if (!calendarId) return null;

      try {
        // We need both List and Info to get the names/emails
        const [partsRaw, infoRaw] = await Promise.all([
          CalendarParticipantModel.getByCalendar(calendarId),
          CalendarParticipantModel.getInfoByCalendar(calendarId)
        ]);

        const parts = Array.isArray(partsRaw) ? partsRaw : (partsRaw as any)?.participants ?? [];
        const info = Array.isArray(infoRaw) ? infoRaw : (infoRaw as any)?.info ?? [];

        // Merge logic to ensure names are matched to IDs
        const membersMap = new Map<string, any>();
        
        // Use participantId GUID as the primary key
        const getAnyId = (obj: any) =>
          obj.participantId ?? obj.ParticipantId ?? obj.participant_id ?? obj.id ?? obj.Id;

        // 1. Initialize with basic participant data
        parts.forEach((p: any) => {
          const mid = getAnyId(p);
          if (mid) {
            membersMap.set(String(mid).toLowerCase(), {
              id: mid,
              name: p.name ?? p.Name ?? "Member",
              email: p.email ?? p.Email,
              status: p.status ?? p.Status ?? 1,
              uuId: mid
            });
          }
        });

        // 2. Enrich with detailed info (Name, Email, Alias)
        info.forEach((i: any) => {
          const mid = getAnyId(i);
          if (!mid) return;
          const key = String(mid).toLowerCase();
          const existing = membersMap.get(key);
          
          const resolvedEmail = i.email ?? i.Email ?? i.userSsoEmail ?? i.UserSsoEmail ?? existing?.email;

          const memberData = {
            id: mid,
            name: i.name ?? i.Name ?? i.alias ?? i.Alias ?? (existing?.name || "Member"),
            email: resolvedEmail,
            alias: i.alias ?? i.Alias ?? i.name ?? i.Name,
            userSsoEmail: resolvedEmail,
            uuId: mid,
            status: i.status ?? i.Status ?? existing?.status ?? 1
          };

          if (!existing) {
            membersMap.set(key, memberData);
          } else {
            Object.assign(existing, memberData);
          }
        });

        const members = Array.from(membersMap.values());

        // Map to the EXACT schema requested by the user
        return {
          id: cal.id ?? cal.Id,
          calendarLink: cal.calendarLink ?? cal.CalendarLink ?? "",
          uuid: calendarId,
          createdOn: cal.createdOn ?? cal.CreatedOn,
          name: cal.name ?? cal.Name,
          timeZoneId: cal.timeZoneId ?? cal.TimeZoneId,
          description: cal.description ?? cal.Description ?? "",
          assignmentType: cal.assignmentMethod ?? cal.AssignmentMethod ?? cal.assignmentType,
          status: cal.status ?? cal.Status ?? 1,
          location: cal.location ?? cal.Location ?? "",
          members
        };
      } catch (err) {
        console.error(`[getCalendarsByCompany] Error fetching members for ${calendarId}:`, err);
        return {
          id: cal.id ?? cal.Id,
          calendarLink: cal.calendarLink ?? cal.CalendarLink ?? "",
          uuid: calendarId,
          createdOn: cal.createdOn ?? cal.CreatedOn,
          name: cal.name ?? cal.Name,
          timeZoneId: cal.timeZoneId ?? cal.TimeZoneId,
          description: cal.description ?? cal.Description ?? "",
          assignmentType: cal.assignmentMethod ?? cal.AssignmentMethod ?? cal.assignmentType,
          status: cal.status ?? cal.Status ?? 1,
          location: cal.location ?? cal.Location ?? "",
          members: []
        };
      }
    })
  );

  return enrichedCalendars.filter(c => c !== null);
}
