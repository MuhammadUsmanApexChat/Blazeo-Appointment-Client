/**
 * Maps low-level Blazeo / calendar-client errors to actionable copy for this sample.
 */
export function mapBlazeoDemoError(message) {
  const m = String(message ?? "");
  if (
    /Model env requires baseUrl|requires baseUrl\. Call configure|baseUrl is missing|Blazeo base URL is not set/i.test(
      m
    )
  ) {
    return "Blazeo Base URL is not set for API calls. Enter **Base URL** (and optional Consumer) in the **Blazeo connection** card at the top of this page, or set `blazeoClientConfig` / `VITE_BLAZEO_BASE_URL`.";
  }
  return m;
}
