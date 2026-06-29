/**
 * Verifies lead field requirements HTTP fallback when LeadModel lacks static methods.
 * Run: npm run build && node scripts/verifyLeadFieldRequirementsHttp.mjs
 */
import { LeadModel, configure } from "@blazeo.com/calendar-client";

configure({ baseUrl: "https://lead-fields.test" });

// Simulate older calendar-client (e.g. 1.0.18 in sample/node_modules).
delete LeadModel.getFieldRequirements;
delete LeadModel.saveFieldRequirements;

const requests = [];
globalThis.fetch = async (url, init) => {
  requests.push({ url: String(url), method: init?.method ?? "GET", body: init?.body });
  if (String(url).includes("/lead/fields/get")) {
    return new Response(
      JSON.stringify({
        status: "success",
        data: {
          fields: [
            { column: "first_name", enabled: true, required: true },
            { column: "email", enabled: true, required: true },
          ],
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  if (String(url).includes("/lead/fields/save")) {
    return new Response(JSON.stringify({ status: "success", data: {} }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ status: "failure" }), { status: 404 });
};

const { getLeadFieldRequirementsApi, saveLeadFieldRequirementsApi } = await import(
  "../dist/lead/leadFieldRequirementsHttp.js"
);

const getRes = await getLeadFieldRequirementsApi("cal-1", { baseUrl: "https://lead-fields.test" });
if (getRes.status !== "success") {
  console.error("GET failed:", getRes);
  process.exit(1);
}
if (!requests.some((r) => r.url.includes("/lead/fields/get?calendar_id=cal-1"))) {
  console.error("Expected direct GET /lead/fields/get, got:", requests);
  process.exit(1);
}

const saveRes = await saveLeadFieldRequirementsApi(
  "cal-1",
  [{ column: "phone", enabled: true, required: false }],
  { baseUrl: "https://lead-fields.test" }
);
if (saveRes.status !== "success") {
  console.error("POST failed:", saveRes);
  process.exit(1);
}
const post = requests.find((r) => r.method === "POST");
if (!post?.url.includes("/lead/fields/save")) {
  console.error("Expected POST /lead/fields/save, got:", requests);
  process.exit(1);
}

console.log("leadFieldRequirementsHttp fallback OK");
