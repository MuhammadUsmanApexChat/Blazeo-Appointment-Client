import { blazeoCustomFieldGet } from "../customField/customFieldHttp.js";
import type { BlazeoCustomFieldConnection } from "../customField/customFieldHttp.js";
import {
  mapApiFormFieldsToFrontend,
  unwrapFormGetData,
} from "./mapCalendarForm.js";
import type { FrontendCalendarFormField } from "../customField/mapFormFieldsToApi.js";

export type FetchCalendarFormOptions = BlazeoCustomFieldConnection & {
  /** Optional `data_id` for `GET /CustomField/Form/Get`. */
  dataId?: string;
};

/**
 * `GET /CustomField/Form/Get?calendar_id=…` — same as `CustomFieldModel.getForm`.
 * Returns portal-shaped rows for `appointmentUserDefinedFields`.
 */
export async function fetchCalendarAppointmentForm(
  calendarId: string,
  options: FetchCalendarFormOptions = {}
): Promise<FrontendCalendarFormField[] | null> {
  const id = String(calendarId ?? "").trim();
  if (!id) return null;

  const { dataId, ...connection } = options;
  const query: Record<string, unknown> = { calendar_id: id };
  if (dataId != null && String(dataId).trim() !== "") {
    query.data_id = String(dataId).trim();
  }

  const res = await blazeoCustomFieldGet("/CustomField/Form/Get", query, connection);
  if (res.status !== "success") return null;

  const rows = unwrapFormGetData(res.data);
  return mapApiFormFieldsToFrontend(rows);
}

/** Alias aligned with calendar-client `CustomFieldModel.getForm`. */
export const getForm = fetchCalendarAppointmentForm;
