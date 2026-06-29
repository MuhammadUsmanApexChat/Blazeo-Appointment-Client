import type { CalendarThemePreferenceRow } from "./mapCalendarThemePreference.js";
import {
  EMAIL_CHANNEL_TYPE,
  EMAIL_EVENT_REMINDER_OPTION,
  IN_APP_EVENT_REMINDER_OPTION,
  NOTIFICATION_CHANNEL_TYPE,
  REMINDER_RECIPIENTS,
  SMS_CHANNEL_TYPE,
  SMS_EVENT_REMINDER_OPTION,
  type AppointmentReminderInput,
  type EventReminderPreferenceRow,
  isValidPreferenceRecipient,
  recipientValueToArray,
} from "./mapEventReminderPreference.js";

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

function normalizeEventReminderRows(
  rows: Record<string, unknown>[],
  optionName: string
): EventReminderPreferenceRow[] {
  return rows
    .filter((row) => {
      const name = pick<string>(row, "Name", "name");
      return !name || name === optionName;
    })
    .map((row) => {
      const recipientRaw = pick(row, "Recipient", "recipient");
      const recipientArr = recipientValueToArray(recipientRaw);
      const recipient =
        typeof recipientRaw === "number"
          ? recipientRaw
          : recipientArr.length === 1 && optionName === IN_APP_EVENT_REMINDER_OPTION
            ? recipientArr[0]
            : recipientArr;
      return {
        Recipient: recipient,
        Before: Number(pick(row, "Before", "before") ?? 0),
        Unit: Number(pick(row, "Unit", "unit") ?? 1),
        Name: optionName,
        Enabled: pick(row, "Enabled", "enabled") !== false,
      };
    })
    .filter((row) => row.Enabled && isValidPreferenceRecipient(row.Recipient) && row.Before > 0);
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

/** Preference `Recipient` → frontend `recipientType` ({@link REMINDER_RECIPIENTS}). */
export function mapPreferenceRecipientsToRecipientType(recipient: unknown): number {
  const ids = recipientValueToArray(recipient);
  const sorted = [...new Set(ids)].sort((a, b) => a - b);

  if (
    sorted.length === 2 &&
    sorted[0] === REMINDER_RECIPIENTS.Lead &&
    sorted[1] === REMINDER_RECIPIENTS.Agent
  ) {
    return REMINDER_RECIPIENTS.LeadAndAgent;
  }
  // Legacy preference rows stored LeadAndAgent as [1, 2].
  if (sorted.length === 2 && sorted[0] === 1 && sorted[1] === 2) {
    return REMINDER_RECIPIENTS.LeadAndAgent;
  }

  if (sorted.length === 1) {
    if (sorted[0] === REMINDER_RECIPIENTS.Lead) return REMINDER_RECIPIENTS.Lead;
    if (sorted[0] === REMINDER_RECIPIENTS.Agent) return REMINDER_RECIPIENTS.Agent;
    if (sorted[0] === REMINDER_RECIPIENTS.LeadAndAgent) {
      return REMINDER_RECIPIENTS.LeadAndAgent;
    }
    // Legacy: Lead was stored as Recipient [2].
    if (sorted[0] === 2) return REMINDER_RECIPIENTS.Lead;
    // Legacy: Agent as [1] — same numeric value as new Agent recipientType.
    if (sorted[0] === 1) return REMINDER_RECIPIENTS.Agent;
  }

  if (typeof recipient === "number" && !Number.isNaN(recipient)) {
    if (recipient === REMINDER_RECIPIENTS.LeadAndAgent) return REMINDER_RECIPIENTS.LeadAndAgent;
    if (recipient === REMINDER_RECIPIENTS.Agent) return REMINDER_RECIPIENTS.Agent;
    if (recipient === REMINDER_RECIPIENTS.Lead) return REMINDER_RECIPIENTS.Lead;
  }

  return sorted[0] ?? REMINDER_RECIPIENTS.Lead;
}

export function mapEventReminderPreferenceToAppointmentReminders(
  rows: EventReminderPreferenceRow[],
  channelType: number
): AppointmentReminderInput[] {
  return rows.map((row) => ({
    channelType,
    recipientType: mapPreferenceRecipientsToRecipientType(row.Recipient),
    beforeEventTime: row.Before,
    unit: row.Unit,
  }));
}

export function mapSmsPreferenceToAppointmentReminders(
  rows: EventReminderPreferenceRow[]
): AppointmentReminderInput[] {
  return mapEventReminderPreferenceToAppointmentReminders(rows, SMS_CHANNEL_TYPE);
}

export function mapEmailPreferenceToAppointmentReminders(
  rows: EventReminderPreferenceRow[]
): AppointmentReminderInput[] {
  return mapEventReminderPreferenceToAppointmentReminders(rows, EMAIL_CHANNEL_TYPE);
}

export function mapInAppPreferenceToAppointmentReminders(
  rows: EventReminderPreferenceRow[]
): AppointmentReminderInput[] {
  return mapEventReminderPreferenceToAppointmentReminders(rows, NOTIFICATION_CHANNEL_TYPE);
}

export function mapAllPreferenceRemindersToAppointmentReminders(
  bundle: CalendarPreferencesBundle
): AppointmentReminderInput[] {
  return [
    ...mapSmsPreferenceToAppointmentReminders(bundle.smsEventReminder.options),
    ...mapEmailPreferenceToAppointmentReminders(bundle.emailEventReminder.options),
    ...mapInAppPreferenceToAppointmentReminders(bundle.inAppEventReminder.options),
  ];
}

export type CalendarPreferencesBundle = {
  smsEventReminder: { raw: unknown; options: EventReminderPreferenceRow[] };
  emailEventReminder: { raw: unknown; options: EventReminderPreferenceRow[] };
  inAppEventReminder: { raw: unknown; options: EventReminderPreferenceRow[] };
  calendarTheme: { raw: unknown; options: CalendarThemePreferenceRow[] };
};

export function buildCalendarPreferencesBundle(
  smsRaw: unknown,
  emailRaw: unknown,
  inAppRaw: unknown,
  themeRaw: unknown
): CalendarPreferencesBundle {
  return {
    smsEventReminder: {
      raw: smsRaw,
      options: normalizeEventReminderRows(
        parsePreferenceOptionRows(smsRaw),
        SMS_EVENT_REMINDER_OPTION
      ),
    },
    emailEventReminder: {
      raw: emailRaw,
      options: normalizeEventReminderRows(
        parsePreferenceOptionRows(emailRaw),
        EMAIL_EVENT_REMINDER_OPTION
      ),
    },
    inAppEventReminder: {
      raw: inAppRaw,
      options: normalizeEventReminderRows(
        parsePreferenceOptionRows(inAppRaw),
        IN_APP_EVENT_REMINDER_OPTION
      ),
    },
    calendarTheme: {
      raw: themeRaw,
      options: normalizeThemeRows(parsePreferenceOptionRows(themeRaw)),
    },
  };
}
