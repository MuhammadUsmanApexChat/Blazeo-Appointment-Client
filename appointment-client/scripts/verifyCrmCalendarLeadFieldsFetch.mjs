/**
 * Verifies CRM calendar lead-fields fetch alongside unchanged Blazeo field APIs.
 * Run: npm run verify:crm-lead-fields-fetch
 */
import {
  fetchCalendarDetails,
  fetchCrmCalendarLeadFields,
  initializeAppointmentClient,
  mapCrmUserDefinedFieldsToFrontend,
  unwrapCrmUserDefinedFields,
} from "../dist/index.js";

const CRM_BASE = "https://crm.example.test";
const BLAZEO_BASE = "https://blazeo.example.test";
const CALENDAR_ID = "cal-guid-fetch-1";
const COMPANY_KEY = "company_key_123";

const crmFields = [
  {
    fieldLabel: "First Name",
    fieldKey: "FirstName",
    fieldToolTipText: "",
    isRequired: true,
    sortOrder: 0,
    fieldTypeId: 3,
    fieldSubTypeId: 301,
    subType: "Text",
  },
  {
    fieldLabel: "lead custom date",
    fieldKey: "leadcustomdate",
    fieldTypeId: 3,
    fieldSubTypeId: 307,
    subType: "Date",
    isRequired: false,
    sortOrder: 1,
  },
];

const requests = [];
globalThis.fetch = async (url, init) => {
  requests.push({
    url: String(url),
    method: init?.method ?? "GET",
    headers: init?.headers,
  });

  if (String(url).includes("/crm/calendar/lead-fields/")) {
    return new Response(
      JSON.stringify({ status: "success", data: { userDefinedFields: crmFields } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  if (String(url).includes("/CustomField/Form/Get")) {
    return new Response(JSON.stringify({ status: "success", data: [{ Label: "Blazeo Custom", Type: "Text" }] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (String(url).includes("/lead/fields/get")) {
    return new Response(
      JSON.stringify({
        status: "success",
        data: { fields: [{ column: "email", enabled: true, required: true }] },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  if (String(url).includes("/Calendar/Get")) {
    return new Response(
      JSON.stringify({
        status: "success",
        data: {
          calendarId: CALENDAR_ID,
          companyKey: COMPANY_KEY,
          isCrm: true,
          name: "CRM calendar",
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ status: "success", data: [] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

initializeAppointmentClient({ baseUrl: BLAZEO_BASE, crmApiUrl: CRM_BASE });

const unwrapped = unwrapCrmUserDefinedFields({ userDefinedFields: crmFields });
if (unwrapped.length !== 2) {
  console.error("unwrapCrmUserDefinedFields failed");
  process.exit(1);
}

const mapped = mapCrmUserDefinedFieldsToFrontend(crmFields);
if (mapped[0].fieldKey !== "FirstName" || mapped[0].fieldTypeId !== 3) {
  console.error("mapCrmUserDefinedFieldsToFrontend failed:", mapped[0]);
  process.exit(1);
}

requests.length = 0;
const details = await fetchCalendarDetails(CALENDAR_ID, {
  isCrm: true,
  companyKey: COMPANY_KEY,
  includePreferences: false,
  includeLocations: false,
});

const udf = details?.appointmentUserDefinedFields ?? [];
const crmLead = details?.crmLeadCustomFields ?? [];

if (!udf.some((f) => f.fieldKey === "Email")) {
  console.error("appointmentUserDefinedFields should include Blazeo lead field:", udf);
  process.exit(1);
}
if (!udf.some((f) => f.fieldLabel === "Blazeo Custom" || f.Label === "Blazeo Custom")) {
  console.error("appointmentUserDefinedFields should include Blazeo custom field:", udf);
  process.exit(1);
}
if (crmLead.length !== 2 || crmLead[0].fieldKey !== "FirstName") {
  console.error("crmLeadCustomFields should come from CRM API when data exists:", crmLead);
  process.exit(1);
}
if (crmLead[0].fieldTypeId !== 3) {
  console.error("crmLeadCustomFields should include fieldTypeId:", crmLead[0]);
  process.exit(1);
}

const crmCalls = requests.filter((r) => String(r.url).includes("/crm/calendar/lead-fields/"));
const blazeoFieldCalls = requests.filter(
  (r) => String(r.url).includes("/CustomField/Form/Get") || String(r.url).includes("/lead/fields/get")
);
if (crmCalls.length !== 1 || blazeoFieldCalls.length < 2) {
  console.error("Fetch should call CRM + Blazeo field APIs:", requests);
  process.exit(1);
}

requests.length = 0;
globalThis.fetch = async (url) => {
  requests.push({ url: String(url) });
  if (String(url).includes("/crm/calendar/lead-fields/")) {
    return new Response(JSON.stringify({ status: "success", data: { userDefinedFields: [] } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (String(url).includes("/CustomField/Form/Get")) {
    return new Response(JSON.stringify({ status: "success", data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (String(url).includes("/lead/fields/get")) {
    return new Response(JSON.stringify({ status: "success", data: { fields: [] } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (String(url).includes("/Calendar/Get")) {
    return new Response(
      JSON.stringify({ status: "success", data: { calendarId: CALENDAR_ID, isCrm: true, companyKey: COMPANY_KEY } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(JSON.stringify({ status: "success", data: [] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const emptyCrm = await fetchCalendarDetails(CALENDAR_ID, {
  isCrm: true,
  companyKey: COMPANY_KEY,
  includePreferences: false,
  includeLocations: false,
});
if (emptyCrm?.crmLeadCustomFields != null) {
  console.error("Empty CRM response should not set crmLeadCustomFields:", emptyCrm?.crmLeadCustomFields);
  process.exit(1);
}

requests.length = 0;
globalThis.fetch = async (url) => {
  requests.push({ url: String(url) });
  if (String(url).includes("/crm/calendar/lead-fields/")) {
    return new Response(JSON.stringify({ status: "success", data: { userDefinedFields: [] } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (String(url).includes("/CustomField/Form/Get")) {
    return new Response(JSON.stringify({ status: "success", data: [{ Label: "Blazeo Custom", Type: "Text" }] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (String(url).includes("/lead/fields/get")) {
    return new Response(
      JSON.stringify({
        status: "success",
        data: { fields: [{ column: "email", enabled: true, required: true }] },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  if (String(url).includes("/Calendar/Get")) {
    return new Response(
      JSON.stringify({ status: "success", data: { calendarId: CALENDAR_ID, companyKey: COMPANY_KEY } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(JSON.stringify({ status: "success", data: [] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const nonCrm = await fetchCalendarDetails(CALENDAR_ID, {
  isCrm: false,
  includePreferences: false,
  includeLocations: false,
});
if (!nonCrm?.appointmentUserDefinedFields?.some((f) => f.fieldKey === "Email")) {
  console.error("Non-CRM appointmentUserDefinedFields unchanged:", nonCrm?.appointmentUserDefinedFields);
  process.exit(1);
}
if (!nonCrm?.appointmentUserDefinedFields?.some((f) => f.fieldLabel === "Blazeo Custom" || f.Label === "Blazeo Custom")) {
  console.error("Non-CRM appointmentUserDefinedFields should include Blazeo custom field:", nonCrm?.appointmentUserDefinedFields);
  process.exit(1);
}
const blazeoFieldCallsNonCrm = requests.filter(
  (r) => String(r.url).includes("/CustomField/Form/Get") || String(r.url).includes("/lead/fields/get")
);
if (blazeoFieldCallsNonCrm.length < 2) {
  console.error("Non-CRM fetch should call Blazeo field APIs:", requests);
  process.exit(1);
}
const crmCallsNonCrm = requests.filter((r) => String(r.url).includes("/crm/calendar/lead-fields/"));
if (crmCallsNonCrm.length !== 1) {
  console.error("Fetch should still try CRM API when companyKey is available:", requests);
  process.exit(1);
}
if (nonCrm?.crmLeadCustomFields != null) {
  console.error("Non-CRM should not set crmLeadCustomFields when CRM returns no data:", nonCrm?.crmLeadCustomFields);
  process.exit(1);
}

console.log("verifyCrmCalendarLeadFieldsFetch: ok");
