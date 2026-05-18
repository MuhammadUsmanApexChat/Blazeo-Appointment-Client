import { LeadModel } from "@blazeo.com/calendar-client";
import { getSnapshot, isStateTreeNode } from "mobx-state-tree";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";

export type BlazeoLeadConnection = {
  baseUrl?: string;
  consumer?: string;
};

/** Paging / sort options forwarded to `LeadModel.getByCompany` → `GET /lead/company/get`. */
export type LeadsByCompanyListOpts = {
  skip?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC" | "asc" | "desc" | string;
  sort?: string;
  sort_column?: string;
  sort_dir?: "asc" | "desc" | string;
  page?: number;
  page_size?: number;
  searchColumn?: string;
  search_column?: string;
  searchText?: string;
  search_text?: string;
  search?: string;
};

function leadToPlain(lead: unknown): Record<string, unknown> | null {
  if (lead == null) return null;
  if (isStateTreeNode(lead)) {
    return getSnapshot(lead) as Record<string, unknown>;
  }
  if (typeof lead === "object") return lead as Record<string, unknown>;
  return null;
}

function leadsToPlain(list: unknown[] | null): Record<string, unknown>[] {
  if (!Array.isArray(list)) return [];
  return list.map((x) => leadToPlain(x)).filter((x): x is Record<string, unknown> => x != null);
}

/**
 * Lead by id: `LeadModel.getRaw` / `get` → `GET /lead/get?lead_id=…`.
 * Returns the mapped MST snapshot when successful, plus the raw API envelope from `getRaw`.
 */
export async function fetchLeadDetails(
  leadId: string,
  connection: BlazeoLeadConnection = {}
): Promise<
  | { ok: true; lead: Record<string, unknown> | null; rawGet: unknown }
  | { ok: false; reason: "missing_base_url"; detail: string }
> {
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, reason: "missing_base_url", detail: ready.error };
  }
  const id = String(leadId ?? "").trim();
  if (!id) {
    return {
      ok: true,
      lead: null,
      rawGet: { status: "failure", message: "leadId is empty" },
    };
  }
  const rawGet = await LeadModel.getRaw(id);
  const model = await LeadModel.get(id);
  return { ok: true, lead: leadToPlain(model), rawGet };
}

/**
 * Single lead by email + company: `GET /lead/getbyemail`.
 */
export async function fetchLeadByEmail(
  email: string,
  companyKey: string,
  connection: BlazeoLeadConnection = {}
): Promise<
  | { ok: true; lead: Record<string, unknown> | null }
  | { ok: false; reason: "missing_base_url"; detail: string }
> {
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, reason: "missing_base_url", detail: ready.error };
  }
  const model = await LeadModel.getByEmail(String(email).trim(), String(companyKey).trim());
  return { ok: true, lead: leadToPlain(model) };
}

/**
 * Paged list: `LeadModel.getByCompany` → `GET /lead/company/get`.
 */
export async function fetchLeadsByCompany(
  companyKey: string,
  listOpts: LeadsByCompanyListOpts = {},
  connection: BlazeoLeadConnection = {}
): Promise<
  | { ok: true; leads: Record<string, unknown>[] }
  | { ok: false; reason: "missing_base_url"; detail: string }
> {
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, reason: "missing_base_url", detail: ready.error };
  }
  const models = await LeadModel.getByCompany(String(companyKey).trim(), listOpts);
  return { ok: true, leads: leadsToPlain(models ?? []) };
}
