/**
 * Verifies custom field form save uses calendar-client CustomFieldModel.saveForm when available
 * and forwards `kind` / `Kind` on custom fields.
 * Run: npm run build && node scripts/verifyCustomFieldFormHttp.mjs
 */
import * as CalendarClient from "@blazeo.com/calendar-client";
import { configure } from "../dist/index.js";
import { mapFrontendFormFieldsToApi, saveCustomFieldForm } from "../dist/index.js";

configure({ baseUrl: "https://example.test", consumer: "test" });

const apiFields = mapFrontendFormFieldsToApi([
  {
    fieldName: "DOB",
    fieldLabel: "DOB",
    fieldKey: "DOB",
    fieldType: "Date",
    fieldId: "014ffabd-3c63-421c-b482-9ce6a65aee53",
    kind: 1,
    isRequired: false,
  },
]);

if (apiFields[0]?.kind !== 1 || apiFields[0]?.Kind !== 1) {
  console.error("mapper should set kind and Kind on custom field:", apiFields[0]);
  process.exit(1);
}

const CustomFieldModel = CalendarClient.CustomFieldModel;
if (!CustomFieldModel || typeof CustomFieldModel.saveForm !== "function") {
  console.log("CustomFieldModel.saveForm not in calendar-client — HTTP fallback only (OK)");
  process.exit(0);
}

let capturedFields = null;
const originalSaveForm = CustomFieldModel.saveForm;
CustomFieldModel.saveForm = async (_calendarId, fields) => {
  capturedFields = fields;
  return { status: "success", data: [] };
};

try {
  const res = await saveCustomFieldForm("cal-1", [
    {
      fieldName: "DOB",
      fieldType: "Date",
      fieldId: "014ffabd-3c63-421c-b482-9ce6a65aee53",
      kind: 1,
    },
  ]);

  if (!res.ok) {
    console.error("saveCustomFieldForm failed:", res);
    process.exit(1);
  }

  if (!Array.isArray(capturedFields) || capturedFields.length !== 1) {
    console.error("CustomFieldModel.saveForm was not called with fields:", capturedFields);
    process.exit(1);
  }

  if (capturedFields[0].kind !== 1 || capturedFields[0].Kind !== 1) {
    console.error("kind not forwarded to calendar-client saveForm:", capturedFields[0]);
    process.exit(1);
  }

  console.log("custom field kind → CustomFieldModel.saveForm OK");
} finally {
  CustomFieldModel.saveForm = originalSaveForm;
}
