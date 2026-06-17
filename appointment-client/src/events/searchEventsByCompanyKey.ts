import { EventModel } from "@blazeo.com/calendar-client";
import { eventSearchResultToClientRow } from "./backfillEventLocationIds.js";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";

export type SearchEventsByCompanyKeyOptions = BlazeoPreferenceConnection & Record<string, unknown>;

/**
 * Company-scoped event search (`GET /event/search/daterange/get`).
 * Single search request — no per-event `GET /event/get` or location detail calls.
 */
export async function searchEventsByCompanyKey(
  companyKey: string,
  startDateFrom: string,
  startDateTo: string,
  opts: SearchEventsByCompanyKeyOptions = {}
) {
  const response: any = await (EventModel as any).getByDateRangeWithFilters(
    companyKey,
    startDateFrom,
    startDateTo,
    opts
  );

  const events = response?.events || [];
  const totalCount = response?.totalCount || 0;

  if (events.length === 0) {
    return { totalCount: 0, events: [] };
  }

  const rows = events.map((event: unknown) => eventSearchResultToClientRow(event));

  return { totalCount, events: rows };
}
