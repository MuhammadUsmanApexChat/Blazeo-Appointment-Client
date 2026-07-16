/**
 * Verifies CRM calendar lead-fields save.
 * Run: npm run verify:crm-lead-fields
 */
import {
  initializeAppointmentClient,
  mapCrmLeadCustomFieldsToApi,
  resolveCompanyKeyFromCalendar,
  saveCalendarAppointmentForm,
  saveCrmCalendarLeadFields,
} from "../dist/index.js";

const CRM_BASE = "https://crm.example.test";
const BLAZEO_BASE = "https://blazeo.example.test";

initializeAppointmentClient({ baseUrl: BLAZEO_BASE, crmApiUrl: CRM_BASE });

const requests = [];
globalThis.fetch = async (url, init) => {
  requests.push({
    url: String(url),
    method: init?.method ?? "GET",
    headers: init?.headers,
    body: init?.body,
  });
  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const customFields = [
  {
    fieldName: "lead custom date",
    fieldLabel: "lead custom date",
    fieldKey: "leadcustomdate",
    fieldType: "Date",
    fieldSubType: 0,
    isRequired: false,
  },
];

const crmLeadFields = [
  {
    fieldLabel: "First Name",
    fieldKey: "FirstName",
    fieldToolTipText: "",
    isRequired: true,
    sortOrder: 0,
    calendarId: 0,
  },
  {
    fieldLabel: "Email",
    fieldKey: "Email",
    fieldToolTipText: "",
    isRequired: true,
    sortOrder: 0,
    calendarId: 0,
  },
];

const fields = [...crmLeadFields, customFields[0]];

const calendar = {
  isCrm: true,
  companyKey: "company_key_123",
  appointmentUserDefinedFields: customFields,
  crmLeadCustomFields: crmLeadFields,
};

if (resolveCompanyKeyFromCalendar(calendar) !== "company_key_123") {
  console.error("resolveCompanyKeyFromCalendar failed");
  process.exit(1);
}

requests.length = 0;
const direct = await saveCrmCalendarLeadFields(
  "cal-guid-1",
  mapCrmLeadCustomFieldsToApi(crmLeadFields),
  "company_key_123"
);
if (!direct.ok) {
  console.error("saveCrmCalendarLeadFields failed:", direct);
  process.exit(1);
}
if (requests.length !== 1) {
  console.error("Expected 1 CRM request, got", requests.length);
  process.exit(1);
}
const crmReq = requests[0];
if (crmReq.url !== `${CRM_BASE}/crm/calendar/lead-fields`) {
  console.error("Unexpected CRM URL:", crmReq.url);
  process.exit(1);
}
if (crmReq.method !== "POST") {
  console.error("Expected POST, got", crmReq.method);
  process.exit(1);
}
const headers = crmReq.headers ?? {};
const companyHeader = headers.companyKey ?? headers["companyKey"];
if (companyHeader !== "company_key_123") {
  console.error("Missing companyKey header:", headers);
  process.exit(1);
}
const body = JSON.parse(crmReq.body);
if (body.calendarId !== "cal-guid-1" || body.userDefinedFields.length !== 2) {
  console.error("Unexpected CRM body:", body);
  process.exit(1);
}
if (body.userDefinedFields[0].fieldKey !== "FirstName" || body.userDefinedFields[0].subType !== "Text") {
  console.error("userDefinedFields should be mapped from crmLeadCustomFields:", body.userDefinedFields[0]);
  process.exit(1);
}

requests.length = 0;
const viaAppointmentForm = await saveCalendarAppointmentForm("cal-guid-2", calendar);
if (!viaAppointmentForm.ok || viaAppointmentForm.skipped) {
  console.error("saveCalendarAppointmentForm with crmLeadCustomFields failed:", viaAppointmentForm);
  process.exit(1);
}
if (!viaAppointmentForm.crmLeadCustomFieldsSaved || !viaAppointmentForm.appointmentFormSaved) {
  console.error("Should save CRM lead fields and Blazeo custom fields:", viaAppointmentForm);
  process.exit(1);
}
const crmCalls = requests.filter((r) => String(r.url).includes("/crm/calendar/lead-fields"));
const leadCalls = requests.filter((r) => String(r.url).includes("/lead/fields/save"));
const customFieldCalls = requests.filter((r) => String(r.url).includes("/CustomField/Form/Save"));
if (crmCalls.length !== 1 || customFieldCalls.length !== 1) {
  console.error("Should call CRM API + CustomField/Form/Save:", requests);
  process.exit(1);
}
if (leadCalls.length !== 0) {
  console.error("appointmentUserDefinedFields has no basic lead rows — lead save should be skipped:", requests);
  process.exit(1);
}

requests.length = 0;
const crmNoLeadFields = await saveCalendarAppointmentForm("cal-guid-2b", {
  isCrm: true,
  companyKey: "company_key_123",
  appointmentUserDefinedFields: customFields,
  crmLeadCustomFields: [],
});
if (!crmNoLeadFields.ok || crmNoLeadFields.skipped) {
  console.error("Empty crmLeadCustomFields should still save appointmentUserDefinedFields:", crmNoLeadFields);
  process.exit(1);
}
if (!crmNoLeadFields.appointmentFormSaved || crmNoLeadFields.crmLeadCustomFieldsSaved) {
  console.error("Empty crmLeadCustomFields should only save Blazeo custom fields:", crmNoLeadFields);
  process.exit(1);
}
const crmCallsWhenEmpty = requests.filter((r) => String(r.url).includes("/crm/calendar/lead-fields"));
const customFieldCallsWhenEmpty = requests.filter((r) => String(r.url).includes("/CustomField/Form/Save"));
if (crmCallsWhenEmpty.length > 0 || customFieldCallsWhenEmpty.length !== 1) {
  console.error("Empty crmLeadCustomFields should call CustomField/Form/Save only:", requests);
  process.exit(1);
}

requests.length = 0;
const nonCrm = await saveCalendarAppointmentForm(
  "cal-guid-3",
  { companyKey: "company_key_123", appointmentUserDefinedFields: fields },
  { baseUrl: BLAZEO_BASE }
);
if (!nonCrm.ok || nonCrm.skipped) {
  console.error("Non-CRM save should succeed with appointmentUserDefinedFields:", nonCrm);
  process.exit(1);
}
if (!nonCrm.fieldRequirementsSaved || !nonCrm.appointmentFormSaved) {
  console.error("Non-CRM should save both lead fields and custom fields:", nonCrm);
  process.exit(1);
}
const leadCallsNonCrm = requests.filter((r) => String(r.url).includes("/lead/fields/save"));
const customFieldCallsNonCrm = requests.filter((r) => String(r.url).includes("/CustomField/Form/Save"));
const crmCallsNonCrm = requests.filter((r) => String(r.url).includes("/crm/calendar/lead-fields"));
if (leadCallsNonCrm.length !== 1 || customFieldCallsNonCrm.length !== 1) {
  console.error("Non-CRM path should call lead + custom field APIs once each:", requests);
  process.exit(1);
}
if (crmCallsNonCrm.length > 0) {
  console.error("Non-CRM path should not call CRM lead-fields API:", crmCallsNonCrm);
  process.exit(1);
}

requests.length = 0;
const crmWithBasicInUdf = await saveCalendarAppointmentForm("cal-guid-4", {
  isCrm: true,
  companyKey: "company_key_123",
  appointmentUserDefinedFields: fields,
  crmLeadCustomFields: crmLeadFields,
});
if (!crmWithBasicInUdf.ok || crmWithBasicInUdf.skipped) {
  console.error("CRM with basic rows in appointmentUserDefinedFields failed:", crmWithBasicInUdf);
  process.exit(1);
}
if (
  !crmWithBasicInUdf.crmLeadCustomFieldsSaved ||
  !crmWithBasicInUdf.fieldRequirementsSaved ||
  !crmWithBasicInUdf.appointmentFormSaved
) {
  console.error(
    "CRM should save CRM lead fields, Blazeo lead requirements, and custom form:",
    crmWithBasicInUdf
  );
  process.exit(1);
}
const crmCallsWithBasic = requests.filter((r) => String(r.url).includes("/crm/calendar/lead-fields"));
const leadCallsWithBasic = requests.filter((r) => String(r.url).includes("/lead/fields/save"));
const customFieldCallsWithBasic = requests.filter((r) => String(r.url).includes("/CustomField/Form/Save"));
if (crmCallsWithBasic.length !== 1 || leadCallsWithBasic.length !== 1 || customFieldCallsWithBasic.length !== 1) {
  console.error(
    "CRM + appointmentUserDefinedFields with basic rows should call CRM, lead save, and custom form:",
    requests
  );
  process.exit(1);
}

requests.length = 0;
const crmFieldsWithoutFlag = await saveCalendarAppointmentForm("cal-guid-5", {
  companyKey: "company_key_123",
  appointmentUserDefinedFields: customFields,
  crmLeadCustomFields: crmLeadFields,
});
if (!crmFieldsWithoutFlag.ok || crmFieldsWithoutFlag.skipped) {
  console.error("crmLeadCustomFields without isCrm should still save appointmentUserDefinedFields:", crmFieldsWithoutFlag);
  process.exit(1);
}
if (crmFieldsWithoutFlag.crmLeadCustomFieldsSaved) {
  console.error("crmLeadCustomFields without isCrm should not call CRM API:", crmFieldsWithoutFlag);
  process.exit(1);
}
const crmCallsWithoutFlag = requests.filter((r) => String(r.url).includes("/crm/calendar/lead-fields"));
if (crmCallsWithoutFlag.length > 0) {
  console.error("crmLeadCustomFields without isCrm should not call CRM lead-fields API:", crmCallsWithoutFlag);
  process.exit(1);
}

console.log("verifyCrmCalendarLeadFields: ok");
