import { PreferenceScope } from "@blazeo.com/calendar-client";
import {
  CALENDAR_THEME_OPTION,
  mapCalendarThemeToPreferencePayload,
} from "./mapCalendarThemePreference.js";
import { setPreferenceAsync, type BlazeoPreferenceConnection } from "./setPreference.js";

const CALENDAR_SCOPE_NAME = "Calendar";

function isFailureStatus(res: any) {
  return res?.status != null && res.status !== "success" && res.status !== "Success";
}

/**
 * `POST /preference/Calendar/{calendarId}/CalendarTheme` from calendar `logoUrl` / `color`.
 */
export async function saveCalendarThemePreference(
  calendarId: string,
  calendar: any,
  connection: BlazeoPreferenceConnection = {}
): Promise<
  | { ok: true; skipped: true }
  | {
      ok: true;
      skipped: false;
      payload: ReturnType<typeof mapCalendarThemeToPreferencePayload>;
      response: unknown;
    }
  | { ok: false; error: string; detail?: string; apiResponse?: unknown }
> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { ok: false, error: "calendarId is required to save calendar theme preference." };
  }

  const payload = mapCalendarThemeToPreferencePayload(calendar);
  if (payload.length === 0) {
    return { ok: true, skipped: true };
  }

  const scope =
    CALENDAR_SCOPE_NAME in PreferenceScope
      ? CALENDAR_SCOPE_NAME
      : String(PreferenceScope.Calendar);

  const result = await setPreferenceAsync(scope, id, CALENDAR_THEME_OPTION, payload, connection);
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
      error: msg || "Calendar theme preference save failed",
      apiResponse: res,
    };
  }

  return { ok: true, skipped: false, payload, response: result.response };
}
