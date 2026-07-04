import {

  blazeoHttpGet,

  blazeoHttpPost,

  blazeoHttpRequest,

  type BlazeoHttpEnvelope,

} from "../http/blazeoHttpRequest.js";

import type { BlazeoConnectionOptions } from "../config/blazeoConnection.js";

import type { CalendarLocationSavePayload } from "./mapCalendarLocation.js";



export type BlazeoPreferenceConnection = BlazeoConnectionOptions;



type ApiEnvelope<T = unknown> = BlazeoHttpEnvelope<T>;



/** `GET /Calendar/Location/Get?calendar_id=…` — plain API rows (no MST). */

export async function getCalendarLocationsByCalendar(

  calendarId: string,

  connection: BlazeoPreferenceConnection = {}

): Promise<Record<string, unknown>[] | null> {

  const res = await blazeoHttpGet(

    "/Calendar/Location/Get",

    { calendar_id: calendarId },

    connection

  );

  if (res.status === "success" && Array.isArray(res.data)) {

    return res.data as Record<string, unknown>[];

  }

  return null;

}



/** `POST /Calendar/Location/Save` — plain saved row (no MST). */

export async function saveCalendarLocationApi(

  payload: CalendarLocationSavePayload,

  connection: BlazeoPreferenceConnection = {}

): Promise<Record<string, unknown> | null> {

  const res = await blazeoHttpPost("/Calendar/Location/Save", payload, undefined, connection);

  if (res.status === "success" && res.data && typeof res.data === "object") {

    return res.data as Record<string, unknown>;

  }

  return null;

}



/**

 * `GET /Calendar/Location/GetById?calendar_location_id=…`

 * Same endpoint as `CalendarLocationModel.getById` in `@blazeo.com/calendar-client`.

 */

export async function getCalendarLocationById(

  calendarLocationId: string,

  connection: BlazeoPreferenceConnection = {}

): Promise<Record<string, unknown> | null> {

  const id = String(calendarLocationId ?? "").trim();

  if (!id) return null;



  const res = await blazeoHttpGet(

    "/Calendar/Location/GetById",

    { calendar_location_id: id },

    connection

  );

  if (res.status === "success" && res.data && typeof res.data === "object") {

    return res.data as Record<string, unknown>;

  }

  return null;

}



/** `GET /Calendar/Location/Remove?calendar_location_id=…`. */

export async function removeCalendarLocationApi(

  calendarLocationId: string,

  connection: BlazeoPreferenceConnection = {}

): Promise<ApiEnvelope> {

  return blazeoHttpRequest("/Calendar/Location/Remove", {

    query: { calendar_location_id: calendarLocationId },

    connection,

  });

}


