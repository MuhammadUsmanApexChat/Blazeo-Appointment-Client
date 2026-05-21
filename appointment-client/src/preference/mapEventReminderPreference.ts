/** ApexFlows `ChannelType` */
export const SMS_CHANNEL_TYPE = 1;
export const EMAIL_CHANNEL_TYPE = 2;
export const NOTIFICATION_CHANNEL_TYPE = 3;

export const SMS_EVENT_REMINDER_OPTION = "SMSEventReminder";
export const EMAIL_EVENT_REMINDER_OPTION = "EmailEventReminder";
export const IN_APP_EVENT_REMINDER_OPTION = "InAppEventReminder";

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

/** ApexFlows `RecipientType` → preference `Recipient` value. */
export function mapReminderRecipients(recipientType: number): number[] {
  switch (recipientType) {
    case 1:
      return [1];
    case 2:
      return [2];
    case 3:
      return [1, 2];
    default:
      return [];
  }
}

export function formatPreferenceRecipient(
  recipientType: number,
  asScalar: boolean
): number[] | number {
  const arr = mapReminderRecipients(recipientType);
  if (asScalar) return arr[0] ?? 0;
  return arr;
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
      const recipientType = Number(r.recipientType ?? 0);
      const recipient = formatPreferenceRecipient(recipientType, config.recipientAsScalar);
      const hasRecipient = Array.isArray(recipient)
        ? recipient.length > 0
        : Number(recipient) > 0;
      return {
        Recipient: recipient,
        Before: Number(r.beforeEventTime ?? 0),
        Unit: Number(r.unit ?? 1),
        Name: config.option,
        Enabled: true,
      };
    })
    .filter((row) => {
      const hasRecipient = Array.isArray(row.Recipient)
        ? row.Recipient.length > 0
        : Number(row.Recipient) > 0;
      return hasRecipient && row.Before > 0;
    });
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
