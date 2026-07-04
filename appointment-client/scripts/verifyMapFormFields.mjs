/**
 * Unit-style check for frontend → API form field mapping (no network).
 * Run: node scripts/verifyMapFormFields.mjs
 */
import {
  CalendarModel,
  collectAppointmentFormFields,
  mapCalendarFormFieldsToApi,
  mapFrontendFormFieldsToApi,
  mapApiFormFieldToFrontend,
  calendarPayloadHasFormFields,
  resolveCalendarIdForForm,
  isApiFormFieldRow,
  mapFieldRequirementsToFrontend,
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

const withDescription = mapFrontendFormFieldsToApi([
  {
    fieldName: "lead custom date",
    fieldLabel: "lead custom date",
    fieldKey: "leadcustomdate",
    fieldType: "Date",
    fieldId: "cdb068c5-e711-4bda-abb2-e824991bf959",
    fieldSubType: 0,
    description: "Pick a date for your visit",
    isRequired: false,
    isMandatory: false,
  },
]);
if (withDescription[0].helpText !== "Pick a date for your visit" || withDescription[0].HelpText !== "Pick a date for your visit") {
  console.error("description → helpText mapping failed:", withDescription[0]);
  process.exit(1);
}
if (withDescription[0].description != null) {
  console.error("description should not be on API payload:", withDescription[0]);
  process.exit(1);
}

const dateFromApi = mapApiFormFieldToFrontend({
  Value: null,
  Label: "lead custom date",
  Type: "Date",
  DataId: "cdb068c5-e711-4bda-abb2-e824991bf959",
  CustomFieldId: "cdb068c5-e711-4bda-abb2-e824991bf959",
  IsRequired: false,
  HelpText: "Pick a date for your visit",
});
if (
  !dateFromApi ||
  dateFromApi.fieldType !== "Date" ||
  dateFromApi.fieldSubType !== 307 ||
  dateFromApi.fieldKey !== "leadcustomdate" ||
  dateFromApi.description !== "Pick a date for your visit"
) {
  console.error("API → frontend Date field type mapping failed:", dateFromApi);
  process.exit(1);
}

const dropdownFromApi = mapApiFormFieldToFrontend({
  Label: "Test",
  Type: "Dropdown",
  CustomFieldId: "abc",
  DataId: "abc",
  IsRequired: false,
  DropdownOptions: [{ Key: "a", Value: "A" }],
});
if (!dropdownFromApi || dropdownFromApi.fieldType !== "Dropdown" || dropdownFromApi.fieldSubType !== 303) {
  console.error("API → frontend Dropdown field type mapping failed:", dropdownFromApi);
  process.exit(1);
}

const firstNameFromApi = mapApiFormFieldToFrontend({
  Label: "First Name",
  Type: "Text",
  CustomFieldId: "0702d225-45b1-4381-b24b-e788b17c2915",
  DataId: "0702d225-45b1-4381-b24b-e788b17c2915",
  IsRequired: true,
});
if (!firstNameFromApi || firstNameFromApi.fieldKey !== "FirstName" || firstNameFromApi.fieldType != null) {
  console.error("Standard booking field should stay calendar-style:", firstNameFromApi);
  process.exit(1);
}

const withKind = mapFrontendFormFieldsToApi([
  {
    fieldName: "DOB",
    fieldLabel: "DOB",
    fieldKey: "DOB",
    fieldType: "Date",
    fieldId: "014ffabd-3c63-421c-b482-9ce6a65aee53",
    fieldSubType: 0,
    kind: 1,
    isRequired: false,
    isMandatory: false,
  },
  {
    fieldLabel: "First Name",
    fieldKey: "FirstName",
    kind: 2,
    isRequired: true,
    isMandatory: true,
  },
]);
if (withKind[0].kind !== 1 || withKind[0].Type !== "Date") {
  console.error("kind on custom field save mapping failed:", withKind[0]);
  process.exit(1);
}
if (withKind[1].kind !== 2 || withKind[1].Kind !== 2) {
  console.error("kind on lead field save mapping failed:", withKind[1]);
  process.exit(1);
}

const createPayload = [
  { fieldLabel: "First Name", fieldKey: "FirstName", isRequired: true, isMandatory: true, sortOrder: 1, calendarId: "cal-1", kind: 2 },
  { fieldLabel: "Last Name", fieldKey: "LastName", isRequired: true, isMandatory: true, sortOrder: 2, calendarId: "cal-1", kind: 2 },
  { fieldLabel: "Email", fieldKey: "Email", isRequired: true, isMandatory: true, sortOrder: 3, calendarId: "cal-1", kind: 2 },
  { fieldLabel: "Address Details", fieldKey: "CText2", isRequired: false, sortOrder: 0, calendarId: 0, id: 0, kind: 2, fieldType: "Address" },
];
const createApi = mapFrontendFormFieldsToApi(createPayload);
if (createApi.length !== 4) {
  console.error("create payload mapping count failed:", createApi.length);
  process.exit(1);
}
if (!createApi.every((row) => row.kind === 2 && row.Kind === 2)) {
  console.error("create payload kind/Kind on every Form/Save row failed:", createApi);
  process.exit(1);
}

const leadFromApi = mapApiFormFieldToFrontend({
  Label: "First Name",
  Type: "Text",
  CustomFieldId: "0702d225-45b1-4381-b24b-e788b17c2915",
  DataId: "0702d225-45b1-4381-b24b-e788b17c2915",
  IsRequired: true,
  kind: 2,
});
if (!leadFromApi || leadFromApi.kind !== 2) {
  console.error("lead field fetch should include API kind:", leadFromApi);
  process.exit(1);
}

const customKindFromApi = mapApiFormFieldToFrontend({
  Label: "DOB",
  Type: "Date",
  CustomFieldId: "014ffabd-3c63-421c-b482-9ce6a65aee53",
  DataId: "014ffabd-3c63-421c-b482-9ce6a65aee53",
  IsRequired: false,
  Kind: 1,
});
if (!customKindFromApi || customKindFromApi.kind !== 1) {
  console.error("custom field fetch should include API Kind:", customKindFromApi);
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

const leadRequirements = mapFieldRequirementsToFrontend(
  [
    { column: "first_name", enabled: true, required: true },
    { column: "email", enabled: true, required: false },
  ],
  "cal-1"
);
if (
  leadRequirements.length !== 2 ||
  leadRequirements[0].kind !== 2 ||
  leadRequirements[1].kind !== 2
) {
  console.error("lead field requirements should include kind: 2:", leadRequirements);
  process.exit(1);
}

console.log("mapFrontendFormFieldsToApi OK:\n", JSON.stringify(api, null, 2));
