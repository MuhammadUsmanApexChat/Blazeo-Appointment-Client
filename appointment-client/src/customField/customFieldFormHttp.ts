import * as CalendarClient from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import {
  blazeoCustomFieldGet,
  blazeoCustomFieldPost,
  type ApiEnvelope,
  type BlazeoCustomFieldConnection,
} from "./customFieldHttp.js";

type CustomFieldModelApi = {
  getForm?: (calendarId: string, dataId?: string) => Promise<ApiEnvelope>;
  saveForm?: (calendarId: string, fields: unknown[]) => Promise<ApiEnvelope>;
};

function getCustomFieldModel(): CustomFieldModelApi | undefined {
  return (CalendarClient as { CustomFieldModel?: CustomFieldModelApi }).CustomFieldModel;
}

/**
 * `GET /CustomField/Form/Get` — prefers `CustomFieldModel.getForm` when calendar-client exports it.
 */
export async function getCustomFieldFormApi(
  calendarId: string,
  query: Record<string, unknown> | undefined,
  connection: BlazeoCustomFieldConnection = {}
): Promise<ApiEnvelope> {
  const id = String(calendarId ?? "").trim();
  if (!id) return { status: "failure", message: "calendarId required" };

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) return { status: "failure", message: ready.error };

  const dataId = query?.data_id ?? query?.dataId;
  const dataIdStr =
    dataId != null && String(dataId).trim() !== "" ? String(dataId).trim() : undefined;

  const model = getCustomFieldModel();
  if (typeof model?.getForm === "function") {
    return model.getForm(id, dataIdStr);
  }

  return blazeoCustomFieldGet("/CustomField/Form/Get", query, connection);
}

/**
 * `POST /CustomField/Form/Save` — prefers `CustomFieldModel.saveForm` when available
 * so `kind` / `Kind` reach the same HTTP layer as `@blazeo.com/calendar-client`.
 */
export async function saveCustomFieldFormApi(
  calendarId: string,
  apiFields: unknown[],
  connection: BlazeoCustomFieldConnection = {}
): Promise<ApiEnvelope> {
  const id = String(calendarId ?? "").trim();
  if (!id) return { status: "failure", message: "calendarId required" };

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) return { status: "failure", message: ready.error };

  const model = getCustomFieldModel();
  if (typeof model?.saveForm === "function") {
    return model.saveForm(id, apiFields);
  }

  return blazeoCustomFieldPost(
    "/CustomField/Form/Save",
    apiFields,
    { calendar_id: id },
    connection
  );
}
