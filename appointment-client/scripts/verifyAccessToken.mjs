/**
 * Verifies access token flows into HTTP headers and calendar-client config.
 * Run: npm run build && node scripts/verifyAccessToken.mjs
 */
import {
  buildAuthHeaders,
  configure as configureAppointmentClient,
  ensureBlazeoHttpReady,
  getAuth,
} from "../dist/index.js";
import { getConfig } from "@blazeo.com/calendar-client";

configureAppointmentClient({
  baseUrl: "https://api.example.test",
  consumer: "test-consumer",
  accessToken: "jwt-from-configure",
});

let headers = buildAuthHeaders();
if (headers.Authorization !== "Bearer jwt-from-configure") {
  console.error("buildAuthHeaders after configure failed:", headers);
  process.exit(1);
}

const ready = ensureBlazeoHttpReady({
  accessToken: "jwt-per-call",
  expiresAtUtc: "2099-01-01T00:00:00.000Z",
});
if (!ready.ok) {
  console.error("ensureBlazeoHttpReady failed:", ready);
  process.exit(1);
}

headers = buildAuthHeaders();
if (headers.Authorization !== "Bearer jwt-per-call") {
  console.error("buildAuthHeaders after per-call token failed:", headers);
  process.exit(1);
}

if (getAuth().accessToken !== "jwt-per-call") {
  console.error("local getAuth failed:", getAuth());
  process.exit(1);
}

if (getConfig()?.accessToken !== "jwt-per-call") {
  console.error("calendar-client getConfig().accessToken failed:", getConfig());
  process.exit(1);
}

console.log("access token sync OK");
