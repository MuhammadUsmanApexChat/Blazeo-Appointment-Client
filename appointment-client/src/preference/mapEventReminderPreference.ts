/** ApexFlows `ChannelType` */
export const SMS_CHANNEL_TYPE = 1;
export const EMAIL_CHANNEL_TYPE = 2;
export const NOTIFICATION_CHANNEL_TYPE = 3;

export const SMS_EVENT_REMINDER_OPTION = "SMSEventReminder";
export const EMAIL_EVENT_REMINDER_OPTION = "EmailEventReminder";
export const IN_APP_EVENT_REMINDER_OPTION = "InAppEventReminder";

/** Portal / Apex `RecipientType` — maps to preference `Recipient` payload values. */
export const REMINDER_RECIPIENTS = {
  Lead: 0,
  Agent: 1,
  LeadAndAgent: 2,
} as const;

export type ReminderRecipientType =
  (typeof REMINDER_RECIPIENTS)[keyof typeof REMINDER_RECIPIENTS];

export type AppointmentReminderInput = {
  channelType?: number;
  channelId?: number;
  recipientType?: number;
  beforeEventTime?: number;
  unit?: number;
};

export type EventReminderPreferenceRow = {
  Recipient: number[] | number;
  Before: number;
  Unit: number;
  Name: string;
  Enabled: boolean;
};

export type ReminderChannelConfig = {
  channelType: number;
  option: string;
  /** InApp preference uses a single `Recipient` int; SMS/Email use arrays. */
  recipientAsScalar: boolean;
};

export const REMINDER_CHANNEL_CONFIGS: ReminderChannelConfig[] = [
  { channelType: SMS_CHANNEL_TYPE, option: SMS_EVENT_REMINDER_OPTION, recipientAsScalar: false },
  { channelType: EMAIL_CHANNEL_TYPE, option: EMAIL_EVENT_REMINDER_OPTION, recipientAsScalar: false },
  {
    channelType: NOTIFICATION_CHANNEL_TYPE,
    option: IN_APP_EVENT_REMINDER_OPTION,
    recipientAsScalar: true,
  },
];

function pick<T>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k] as T;
  }
  return undefined;
}

/** True when a preference row has a valid recipient (including Lead = 0). */
export function isValidPreferenceRecipient(recipient: number[] | number): boolean {
  if (Array.isArray(recipient)) {
    return recipient.length > 0;
  }
  const n = Number(recipient);
  return Number.isFinite(n) && n >= REMINDER_RECIPIENTS.Lead;
}

/**
 * Normalize portal `recipientType` to {@link REMINDER_RECIPIENTS}.
 * Supports legacy values: 1 = Agent, 3 = LeadAndAgent (old both).
 */
export function normalizeReminderRecipientType(recipientType: number): ReminderRecipientType {
  const n = Number(recipientType);
  if (n === REMINDER_RECIPIENTS.Lead) return REMINDER_RECIPIENTS.Lead;
  if (n === REMINDER_RECIPIENTS.Agent) return REMINDER_RECIPIENTS.Agent;
  if (n === REMINDER_RECIPIENTS.LeadAndAgent) return REMINDER_RECIPIENTS.LeadAndAgent;
  if (n === 3) return REMINDER_RECIPIENTS.LeadAndAgent;
  if (n === 1) return REMINDER_RECIPIENTS.Agent;
  return REMINDER_RECIPIENTS.Lead;
}

/** `recipientType` → preference `Recipient` array for SMS / Email reminders. */
export function mapReminderRecipients(recipientType: number): number[] {
  switch (normalizeReminderRecipientType(recipientType)) {
    case REMINDER_RECIPIENTS.Lead:
      return [REMINDER_RECIPIENTS.Lead];
    case REMINDER_RECIPIENTS.Agent:
      return [REMINDER_RECIPIENTS.Agent];
    case REMINDER_RECIPIENTS.LeadAndAgent:
      return [REMINDER_RECIPIENTS.Lead, REMINDER_RECIPIENTS.Agent];
    default:
      return [];
  }
}

export function formatPreferenceRecipient(
  recipientType: number,
  asScalar: boolean
): number[] | number {
  const normalized = normalizeReminderRecipientType(recipientType);
  if (asScalar) {
    return normalized;
  }
  return mapReminderRecipients(normalized);
}

export function recipientValueToArray(recipient: unknown): number[] {
  if (Array.isArray(recipient)) {
    return recipient.map(Number).filter((n) => !Number.isNaN(n));
  }
  if (typeof recipient === "number" && !Number.isNaN(recipient)) {
    return [recipient];
  }
  return [];
}

function reminderChannelType(reminder: AppointmentReminderInput): number | undefined {
  const v = pick<number>(reminder, "channelType", "ChannelType", "channelId", "ChannelId");
  return v != null ? Number(v) : undefined;
}

/**
 * Collect reminders from a calendar payload (flat `appointmentReminders` or nested `reminderChannelStatuses`).
 */
export function collectAppointmentReminders(calendar: any): AppointmentReminderInput[] {
  const flat = calendar?.appointmentReminders ?? calendar?.AppointmentReminders;
  if (Array.isArray(flat)) {
    return flat.map((r) => ({
      channelType: pick<number>(r, "channelType", "ChannelType", "channelId", "ChannelId"),
      recipientType: pick<number>(r, "recipientType", "RecipientType"),
      beforeEventTime: pick<number>(r, "beforeEventTime", "BeforeEventTime"),
      unit: pick<number>(r, "unit", "Unit"),
    }));
  }

  const statuses =
    calendar?.reminderChannelStatuses ?? calendar?.ReminderChannelStatuses ?? [];
  if (!Array.isArray(statuses)) return [];

  const out: AppointmentReminderInput[] = [];
  for (const status of statuses) {
    const statusChannel = pick<number>(
      status,
      "channelType",
      "ChannelType",
      "channelId",
      "ChannelId"
    );
    const list = status?.appointmentReminders ?? status?.AppointmentReminders ?? [];
    if (!Array.isArray(list)) continue;
    for (const r of list) {
      out.push({
        channelType:
          pick<number>(r, "channelType", "ChannelType", "channelId", "ChannelId") ??
          statusChannel,
        recipientType: pick<number>(r, "recipientType", "RecipientType"),
        beforeEventTime: pick<number>(r, "beforeEventTime", "BeforeEventTime"),
        unit: pick<number>(r, "unit", "Unit"),
      });
    }
  }
  return out;
}

export function mapRemindersToPreferencePayload(
  reminders: AppointmentReminderInput[],
  config: ReminderChannelConfig
): EventReminderPreferenceRow[] {
  return reminders
    .filter((r) => reminderChannelType(r) === config.channelType)
    .map((r) => {
      const recipientType = Number(r.recipientType ?? REMINDER_RECIPIENTS.Lead);
      const recipient = formatPreferenceRecipient(recipientType, config.recipientAsScalar);
      return {
        Recipient: recipient,
        Before: Number(r.beforeEventTime ?? 0),
        Unit: Number(r.unit ?? 1),
        Name: config.option,
        Enabled: true,
      };
    })
    .filter((row) => isValidPreferenceRecipient(row.Recipient) && row.Before > 0);
}

export function mapSmsRemindersToPreferencePayload(reminders: AppointmentReminderInput[]) {
  return mapRemindersToPreferencePayload(reminders, REMINDER_CHANNEL_CONFIGS[0]);
}

export function mapEmailRemindersToPreferencePayload(reminders: AppointmentReminderInput[]) {
  return mapRemindersToPreferencePayload(reminders, REMINDER_CHANNEL_CONFIGS[1]);
}

export function mapInAppRemindersToPreferencePayload(reminders: AppointmentReminderInput[]) {
  return mapRemindersToPreferencePayload(reminders, REMINDER_CHANNEL_CONFIGS[2]);
}

export function calendarPayloadHasEventReminders(calendar: any): boolean {
  const reminders = collectAppointmentReminders(calendar);
  return REMINDER_CHANNEL_CONFIGS.some(
    (config) => mapRemindersToPreferencePayload(reminders, config).length > 0
  );
}

export type SmsEventReminderPreferenceRow = EventReminderPreferenceRow & {
  Name: typeof SMS_EVENT_REMINDER_OPTION;
  Recipient: number[];
};
