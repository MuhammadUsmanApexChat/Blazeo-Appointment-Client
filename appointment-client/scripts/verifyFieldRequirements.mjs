/**
 * Unit-style check for basic vs custom field split and lead requirement mapping (no network).
 * Run: npm run build && node scripts/verifyFieldRequirements.mjs
 */
import {
  mapFrontendFieldsToRequirements,
  splitAppointmentFormFields,
  mapFrontendFormFieldsToApi,
  hasFormFieldId,
  isBookableLeadField,
  mapFieldRequirementsToFrontend,
  mergeAppointmentUserDefinedFields,
} from "../dist/index.js";

/** Frontend payload shape from the portal create-calendar form. */
const frontendFields = [
  {
    fieldLabel: "First Name",
    fieldKey: "FirstName",
    fieldToolTipText: "",
    isRequired: true,
    sortOrder: 0,
    calendarId: 0,
    isMandatory: true,
  },
  {
    fieldLabel: "Last Name",
    fieldKey: "LastName",
    fieldToolTipText: "",
    isRequired: true,
    sortOrder: 0,
    calendarId: 0,
    isMandatory: true,
  },
  {
    fieldLabel: "Email",
    fieldKey: "Email",
    fieldToolTipText: "",
    isRequired: true,
    sortOrder: 0,
    calendarId: 0,
    isMandatory: true,
  },
  {
    fieldLabel: "Lead Phone",
    fieldKey: "Phone",
    fieldToolTipText: "",
    isRequired: false,
    sortOrder: 0,
    calendarId: 0,
    id: "1782303418584",
  },
  {
    fieldName: "lead custom date",
    fieldLabel: "lead custom date",
    fieldKey: "leadcustomdate",
    fieldType: "Date",
    fieldId: "cdb068c5-e711-4bda-abb2-e824991bf959",
    fieldSubType: 0,
    description: "",
    isRequired: false,
    isMandatory: false,
  },
];

const { basicFields, customFields } = splitAppointmentFormFields(frontendFields);
if (basicFields.length !== 4) {
  console.error("Expected 4 basic fields, got", basicFields.length, basicFields);
  process.exit(1);
}
if (customFields.length !== 1) {
  console.error("Expected 1 custom field, got", customFields.length, customFields);
  process.exit(1);
}
if (!hasFormFieldId(customFields[0])) {
  console.error("Custom field should have fieldId");
  process.exit(1);
}
if (!isBookableLeadField(basicFields[0])) {
  console.error("First Name should be bookable");
  process.exit(1);
}

const requirements = mapFrontendFieldsToRequirements(basicFields);
if (requirements.length !== 4) {
  console.error("Expected 4 requirements, got", requirements);
  process.exit(1);
}

const byColumn = Object.fromEntries(requirements.map((r) => [r.column, r]));
if (
  byColumn.first_name?.required !== true ||
  byColumn.last_name?.required !== true ||
  byColumn.email?.required !== true ||
  byColumn.phone?.required !== false
) {
  console.error("Requirement flags mismatch:", byColumn);
  process.exit(1);
}

const apiCustom = mapFrontendFormFieldsToApi(customFields);
if (apiCustom.length !== 1 || apiCustom[0].Type !== "Date") {
  console.error("Custom field API mapping failed:", apiCustom);
  process.exit(1);
}
if (apiCustom[0].CustomFieldId !== "cdb068c5-e711-4bda-abb2-e824991bf959") {
  console.error("fieldId → CustomFieldId failed:", apiCustom[0]);
  process.exit(1);
}

const apiRequirements = [
  { column: "first_name", enabled: true, required: true },
  { column: "email", enabled: true, required: true },
  { column: "phone", enabled: true, required: false },
];
const fetchedBasic = mapFieldRequirementsToFrontend(apiRequirements);
if (fetchedBasic.length !== 3 || fetchedBasic[0].fieldKey !== "FirstName") {
  console.error("mapFieldRequirementsToFrontend failed:", fetchedBasic);
  process.exit(1);
}
const merged = mergeAppointmentUserDefinedFields(fetchedBasic, customFields);
if (merged.length !== 4) {
  console.error("mergeAppointmentUserDefinedFields failed:", merged.length, merged);
  process.exit(1);
}

console.log("split + requirements OK");
console.log("POST /lead/fields/save payload:\n", JSON.stringify(requirements, null, 2));
console.log("POST /CustomField/Form/Save payload:\n", JSON.stringify(apiCustom, null, 2));
