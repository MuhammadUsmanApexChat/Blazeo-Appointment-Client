/**
 * Verifies Email/SMS reminder recipient mapping (Lead = 0 must not be dropped).
 * Run: npm run build && node scripts/verifyReminderRecipients.mjs
 */
import {
  REMINDER_RECIPIENTS,
  mapEmailRemindersToPreferencePayload,
  mapPreferenceRecipientsToRecipientType,
  mapReminderRecipients,
  normalizeReminderRecipientType,
} from "../dist/index.js";

const leadEmail = mapEmailRemindersToPreferencePayload([
  { channelType: 2, recipientType: REMINDER_RECIPIENTS.Lead, beforeEventTime: 10, unit: 1 },
]);
if (leadEmail.length !== 1 || !Array.isArray(leadEmail[0].Recipient) || leadEmail[0].Recipient[0] !== 0) {
  console.error("Lead email reminder failed:", leadEmail);
  process.exit(1);
}

const agentEmail = mapEmailRemindersToPreferencePayload([
  { channelType: 2, recipientType: REMINDER_RECIPIENTS.Agent, beforeEventTime: 10, unit: 1 },
]);
if (agentEmail[0].Recipient[0] !== 1) {
  console.error("Agent email reminder failed:", agentEmail);
  process.exit(1);
}

const bothEmail = mapEmailRemindersToPreferencePayload([
  { channelType: 2, recipientType: REMINDER_RECIPIENTS.LeadAndAgent, beforeEventTime: 10, unit: 1 },
]);
if (JSON.stringify(bothEmail[0].Recipient) !== JSON.stringify([0, 1])) {
  console.error("LeadAndAgent email reminder failed:", bothEmail);
  process.exit(1);
}

if (mapPreferenceRecipientsToRecipientType([0]) !== REMINDER_RECIPIENTS.Lead) {
  console.error("Read [0] failed");
  process.exit(1);
}
if (mapPreferenceRecipientsToRecipientType([1, 2]) !== REMINDER_RECIPIENTS.LeadAndAgent) {
  console.error("Legacy read [1,2] failed");
  process.exit(1);
}

if (normalizeReminderRecipientType(3) !== REMINDER_RECIPIENTS.LeadAndAgent) {
  console.error("Legacy recipientType 3 normalize failed");
  process.exit(1);
}

console.log("verifyReminderRecipients OK");
console.log("Lead Email Recipient:", leadEmail[0].Recipient);
