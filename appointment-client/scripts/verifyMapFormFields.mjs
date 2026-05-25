/**
 * Unit-style check for frontend → API form field mapping (no network).
 * Run: node scripts/verifyMapFormFields.mjs
 */
import {
  CalendarModel,
  collectAppointmentFormFields,
  mapCalendarFormFieldsToApi,
  mapFrontendFormFieldsToApi,
  calendarPayloadHasFormFields,
  resolveCalendarIdForForm,
  isApiFormFieldRow,
} from "../dist/index.js";

const frontend = [
  {
    fieldLabel: "First Name",
    fieldKey: "FirstName",
    fieldId: "0702d225-45b1-4381-b24b-e788b17c2915",
    isRequired: true,
    isMandatory: true,
  },
  {
    fieldLabel: "Email",
    fieldKey: "Email",
    fieldId: "c2c08947-4050-41ba-8d59-3ccff8bbbd79",
    isRequired: true,
  },
  {
    fieldName: "Test",
    fieldType: 3,
    fieldSubType: 303,
    leadCustomOptions: [{ value: "A" }, { value: "B" }],
  },
];

const api = mapFrontendFormFieldsToApi(frontend);
if (api.length !== 3) {
  console.error("Expected 3 mapped rows, got", api.length);
  process.exit(1);
}

if (api[0].Label !== "First Name" || api[0].Type !== "Text") {
  console.error("First name mapping failed:", api[0]);
  process.exit(1);
}
if (api[0].DataId !== "0702d225-45b1-4381-b24b-e788b17c2915") {
  console.error("fieldId → DataId failed:", api[0]);
  process.exit(1);
}
if (api[1].Type !== "Email") {
  console.error("Email fieldKey mapping failed:", api[1]);
  process.exit(1);
}
if (api[2].Type !== "Dropdown" || !Array.isArray(api[2].DropdownOptions) || api[2].DropdownOptions.length !== 2) {
  console.error("Dropdown mapping failed:", api[2]);
  process.exit(1);
}

const alreadyApi = [
  {
    Type: "Text",
    Label: "Legacy",
    DataId: "x",
    CustomFieldId: "x",
    IsRequired: false,
    Value: null,
  },
];
const passthrough = mapFrontendFormFieldsToApi(alreadyApi);
if (!isApiFormFieldRow(alreadyApi[0]) || passthrough[0].Type !== "Text" || passthrough[0].Label !== "Legacy") {
  console.error("API-shaped passthrough failed:", passthrough);
  process.exit(1);
}

const skip = mapFrontendFormFieldsToApi(alreadyApi, { skipTransform: true });
if (skip[0].Type !== "Text") {
  console.error("skipTransform failed");
  process.exit(1);
}

const calendarPayload = { calendarId: "test-cal", appointmentUserDefinedFields: frontend };
if (!calendarPayloadHasFormFields(calendarPayload)) {
  console.error("calendarPayloadHasFormFields failed");
  process.exit(1);
}
const viaCalendar = mapCalendarFormFieldsToApi(calendarPayload);
if (viaCalendar.length !== api.length) {
  console.error("mapCalendarFormFieldsToApi mismatch");
  process.exit(1);
}
const viaModel = CalendarModel.mapFormFieldsToApi(calendarPayload);
if (viaModel.length !== api.length) {
  console.error("CalendarModel.mapFormFieldsToApi mismatch");
  process.exit(1);
}
if (collectAppointmentFormFields(calendarPayload).length !== 3) {
  console.error("collectAppointmentFormFields failed");
  process.exit(1);
}
if (resolveCalendarIdForForm({ calendarId: "abc" }) !== "abc") {
  console.error("resolveCalendarIdForForm failed");
  process.exit(1);
}

console.log("mapFrontendFormFieldsToApi OK:\n", JSON.stringify(api, null, 2));
