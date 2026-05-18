/** Blazeo / ApexFlows `ChannelType.SMS` */
export const SMS_CHANNEL_TYPE = 1;

export const SMS_EVENT_REMINDER_OPTION = "SMSEventReminder";

export type AppointmentReminderInput = {
  channelType?: number;
  channelId?: number;
  recipientType?: number;
  beforeEventTime?: number;
  unit?: number;
};

export type SmsEventReminderPreferenceRow = {
  Recipient: number[];
  Before: number;
  Unit: number;
  Name: typeof SMS_EVENT_REMINDER_OPTION;
  Enabled: boolean;
};

function pick<T>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k] as T;
  }
  return undefined;
}

/** ApexFlows `RecipientType` → preference `Recipient` array (same ints as server `MapRecipients`). */
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
    const list =
      status?.appointmentReminders ?? status?.AppointmentReminders ?? [];
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

/** Keep SMS (`channelType` / `channelId` === 1) rows and map to `SMSEventReminder` preference JSON. */
export function mapSmsRemindersToPreferencePayload(
  reminders: AppointmentReminderInput[]
): SmsEventReminderPreferenceRow[] {
  return reminders
    .filter((r) => reminderChannelType(r) === SMS_CHANNEL_TYPE)
    .map((r) => {
      const recipientType = Number(r.recipientType ?? 0);
      const before = Number(r.beforeEventTime ?? 0);
      const unit = Number(r.unit ?? 1);
      return {
        Recipient: mapReminderRecipients(recipientType),
        Before: before,
        Unit: unit,
        Name: SMS_EVENT_REMINDER_OPTION as SmsEventReminderPreferenceRow["Name"],
        Enabled: true,
      };
    })
    .filter((row) => row.Recipient.length > 0 && row.Before > 0);
}
