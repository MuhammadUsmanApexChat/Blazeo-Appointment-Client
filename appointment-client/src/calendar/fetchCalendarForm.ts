import { blazeoCustomFieldGet } from "../customField/customFieldHttp.js";
import type { BlazeoCustomFieldConnection } from "../customField/customFieldHttp.js";
import {
  mapApiFormFieldsToClient,
  mapApiFormFieldsToFrontend,
  unwrapFormGetData,
} from "./mapCalendarForm.js";
import type { FrontendCalendarFormField } from "../customField/mapFormFieldsToApi.js";

export type FetchCalendarFormOptions = BlazeoCustomFieldConnection & {
  /** Optional `data_id` for `GET /CustomField/Form/Get`. */
  dataId?: string;
  /**
   * `api` (default) — Blazeo GET shape: `Type`, `Label`, `CustomFieldId`, `checkBoxOptions`, …
   * `frontend` — portal rows: `fieldLabel`, `fieldKey`, `leadCustomOptions`, …
   */
  format?: "api" | "frontend";
};

/**
 * `GET /CustomField/Form/Get?calendar_id=…` — same as `CustomFieldModel.getForm`.
 */
export async function fetchCalendarAppointmentForm(
  calendarId: string,
  options: FetchCalendarFormOptions = {}
): Promise<Record<string, unknown>[] | FrontendCalendarFormField[] | null> {
  const id = String(calendarId ?? "").trim();
  if (!id) return null;

  const { dataId, format = "api", ...connection } = options;
  const query: Record<string, unknown> = { calendar_id: id };
  if (dataId != null && String(dataId).trim() !== "") {
    query.data_id = String(dataId).trim();
  }

  const res = await blazeoCustomFieldGet("/CustomField/Form/Get", query, connection);
  if (res.status !== "success") return null;

  const rows = unwrapFormGetData(res.data);
  return format === "frontend"
    ? mapApiFormFieldsToFrontend(rows)
    : mapApiFormFieldsToClient(rows);
}

/** Alias aligned with calendar-client `CustomFieldModel.getForm`. */
export const getForm = fetchCalendarAppointmentForm;
