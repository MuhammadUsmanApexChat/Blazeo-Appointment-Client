/**
 * Verifies JWT auth is wired for direct HTTP helpers (custom fields, locations, events).
 * Run: node scripts/verifyAccessToken.mjs
 */
import {
  configure,
  clearAuth,
  buildAuthHeaders,
  setAccessToken,
} from "../dist/index.js";
import { blazeoCustomFieldGet } from "../dist/customField/customFieldHttp.js";

clearAuth();
configure({
  baseUrl: "https://example.test",
  consumer: "test-consumer",
});
setAccessToken("test-jwt-token");

const headers = buildAuthHeaders({ "Content-Type": "application/json" });
if (headers.Authorization !== "Bearer test-jwt-token") {
  console.error("buildAuthHeaders missing Bearer token:", headers);
  process.exit(1);
}
if (headers.Consumer !== "test-consumer") {
  console.error("buildAuthHeaders missing Consumer:", headers);
  process.exit(1);
}

let capturedHeaders = null;
configure({
  baseUrl: "https://example.test",
  fetch: async (_url, init) => {
    capturedHeaders = init?.headers ?? null;
    return new Response(JSON.stringify({ status: "success", data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});

await blazeoCustomFieldGet("/CustomField/Form/Get", { calendar_id: "cal-1" }, {});

if (!capturedHeaders?.Authorization?.startsWith("Bearer ")) {
  console.error("blazeoCustomFieldGet did not send Authorization:", capturedHeaders);
  process.exit(1);
}

console.log("access token wiring OK");
