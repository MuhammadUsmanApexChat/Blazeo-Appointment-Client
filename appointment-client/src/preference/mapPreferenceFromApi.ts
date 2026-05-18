import type { CalendarThemePreferenceRow } from "./mapCalendarThemePreference.js";
import {
  SMS_CHANNEL_TYPE,
  SMS_EVENT_REMINDER_OPTION,
  type AppointmentReminderInput,
  type SmsEventReminderPreferenceRow,
} from "./mapSmsEventReminderPreference.js";

function pick<T>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k] as T;
  }
  return undefined;
}

/** Parse `PreferenceModel.get` rows (`options`, `Options`, or `optionsJson`). */
export function parsePreferenceOptionRows(raw: unknown): Record<string, unknown>[] {
  if (raw == null) return [];

  const fromRecords = (records: any[]): Record<string, unknown>[] =>
    records.flatMap((record) => {
      const direct = record?.options ?? record?.Options;
      if (Array.isArray(direct)) {
        return direct.map((o) => (typeof o === "object" && o != null ? o : {}));
      }
      const json = record?.optionsJson ?? record?.OptionsJson;
      if (typeof json === "string" && json.trim()) {
        try {
          const parsed = JSON.parse(json);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === "object") return [parsed];
        } catch {
          return [];
        }
      }
      return [];
    });

  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    const first = raw[0];
    if (first?.options != null || first?.Options != null || first?.optionsJson != null) {
      return fromRecords(raw);
    }
    return raw.filter((o) => o && typeof o === "object") as Record<string, unknown>[];
  }

  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const direct = o.options ?? o.Options;
    if (Array.isArray(direct)) return direct as Record<string, unknown>[];
    const json = o.optionsJson ?? o.OptionsJson;
    if (typeof json === "string" && json.trim()) {
      try {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" ? [parsed] : [];
      } catch {
        return [];
      }
    }
  }

  return [];
}

function normalizeSmsRows(rows: Record<string, unknown>[]): SmsEventReminderPreferenceRow[] {
  return rows
    .filter((row) => {
      const name = pick<string>(row, "Name", "name");
      return !name || name === SMS_EVENT_REMINDER_OPTION;
    })
    .map((row) => ({
      Recipient: (pick<number[]>(row, "Recipient", "recipient") ?? []).map(Number),
      Before: Number(pick(row, "Before", "before") ?? 0),
      Unit: Number(pick(row, "Unit", "unit") ?? 1),
      Name: SMS_EVENT_REMINDER_OPTION as SmsEventReminderPreferenceRow["Name"],
      Enabled: pick(row, "Enabled", "enabled") !== false,
    }))
    .filter((row) => row.Enabled && row.Recipient.length > 0 && row.Before > 0);
}

function normalizeThemeRows(rows: Record<string, unknown>[]): CalendarThemePreferenceRow[] {
  return rows
    .filter((row) => {
      const name = pick<string>(row, "Name", "name");
      return !name || name === "CalendarTheme";
    })
    .map((row) => ({
      logoUrl: String(pick(row, "logoUrl", "LogoUrl") ?? "").trim(),
      color: String(pick(row, "color", "Color") ?? "").trim(),
      Name: "CalendarTheme" as const,
      Enabled: pick(row, "Enabled", "enabled") !== false,
    }))
    .filter((row) => row.Enabled && (row.logoUrl || row.color));
}

/** Preference `Recipient` ints → frontend `recipientType`. */
export function mapPreferenceRecipientsToRecipientType(recipient: number[]): number {
  const ids = [...new Set(recipient.map(Number).filter((n) => !Number.isNaN(n)))].sort((a, b) => a - b);
  if (ids.length === 2 && ids[0] === 1 && ids[1] === 2) return 3;
  if (ids.length === 1 && ids[0] === 1) return 1;
  if (ids.length === 1 && ids[0] === 2) return 2;
  return ids[0] ?? 0;
}

export function mapSmsPreferenceToAppointmentReminders(
  rows: SmsEventReminderPreferenceRow[]
): AppointmentReminderInput[] {
  return rows.map((row) => ({
    channelType: SMS_CHANNEL_TYPE,
    recipientType: mapPreferenceRecipientsToRecipientType(row.Recipient),
    beforeEventTime: row.Before,
    unit: row.Unit,
  }));
}

export type CalendarPreferencesBundle = {
  smsEventReminder: {
    raw: unknown;
    options: SmsEventReminderPreferenceRow[];
  };
  calendarTheme: {
    raw: unknown;
    options: CalendarThemePreferenceRow[];
  };
};

export function buildCalendarPreferencesBundle(
  smsRaw: unknown,
  themeRaw: unknown
): CalendarPreferencesBundle {
  return {
    smsEventReminder: {
      raw: smsRaw,
      options: normalizeSmsRows(parsePreferenceOptionRows(smsRaw)),
    },
    calendarTheme: {
      raw: themeRaw,
      options: normalizeThemeRows(parsePreferenceOptionRows(themeRaw)),
    },
  };
}
