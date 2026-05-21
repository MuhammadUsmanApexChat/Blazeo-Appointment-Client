import { PreferenceScope } from "@blazeo.com/calendar-client";
import {
  collectAppointmentReminders,
  mapRemindersToPreferencePayload,
  type ReminderChannelConfig,
} from "./mapEventReminderPreference.js";
import { setPreferenceAsync, type BlazeoPreferenceConnection } from "./setPreference.js";

const CALENDAR_SCOPE_NAME = "Calendar";

function isFailureStatus(res: any) {
  return res?.status != null && res.status !== "success" && res.status !== "Success";
}

export type SaveCalendarEventReminderResult =
  | { ok: true; skipped: true }
  | {
      ok: true;
      skipped: false;
      payload: ReturnType<typeof mapRemindersToPreferencePayload>;
      response: unknown;
    }
  | { ok: false; error: string; detail?: string; apiResponse?: unknown };

/**
 * `POST /preference/Calendar/{calendarId}/{option}` for one reminder channel.
 */
export async function saveCalendarEventReminderPreference(
  calendarId: string,
  calendar: any,
  config: ReminderChannelConfig,
  connection: BlazeoPreferenceConnection = {}
): Promise<SaveCalendarEventReminderResult> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return {
      ok: false,
      error: `calendarId is required to save ${config.option} preference.`,
    };
  }

  const payload = mapRemindersToPreferencePayload(collectAppointmentReminders(calendar), config);
  if (payload.length === 0) {
    return { ok: true, skipped: true };
  }

  const scope =
    CALENDAR_SCOPE_NAME in PreferenceScope
      ? CALENDAR_SCOPE_NAME
      : String(PreferenceScope.Calendar);

  const result = await setPreferenceAsync(scope, id, config.option, payload, connection);
  if (!result.ok) {
    return { ok: false, error: "Blazeo HTTP is not configured.", detail: result.detail };
  }

  if (isFailureStatus(result.response)) {
    const res = result.response as any;
    const msg =
      res.message ??
      (typeof res.data === "string" ? res.data : undefined) ??
      JSON.stringify(res);
    return {
      ok: false,
      error: msg || `${config.option} preference save failed`,
      apiResponse: res,
    };
  }

  return { ok: true, skipped: false, payload, response: result.response };
}
