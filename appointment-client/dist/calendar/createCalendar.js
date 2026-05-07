import { CalendarModel, configure, getConfig } from "@blazeo.com/calendar-client";
import { blazeoClientConfig } from "../config/blazeoClientDefaults.js";
import { mapCalendarBOToSnapshot } from "./mapCalendarToBlazeoSnapshot.js";
function isFailureStatus(res) {
    return res.status !== "success" && res.status !== "Success";
}
/** Merge per-call options with global Blazeo config (defaults file + `configure`). */
export function resolveBlazeoConnection(options = {}) {
    const cfg = getConfig();
    const fromFileBase = blazeoClientConfig.baseUrl?.trim().replace(/\/+$/, "");
    const fromFileConsumer = blazeoClientConfig.consumer?.trim();
    const baseUrl = options.baseUrl?.trim().replace(/\/+$/, "") ||
        cfg?.baseUrl?.replace(/\/+$/, "") ||
        (fromFileBase || undefined);
    const consumer = options.consumer?.trim() ||
        cfg?.consumer ||
        (fromFileConsumer || undefined);
    return { baseUrl, consumer };
}
/** Shared MST `env` for Blazeo models (`Calendar`, `Event`, …). */
export function buildModelEnv(baseUrl, consumer, forLocalOnly) {
    if (forLocalOnly && !baseUrl) {
        return {};
    }
    const cfg = getConfig();
    const env = {};
    if (baseUrl) {
        env.baseUrl = baseUrl;
    }
    else if (cfg?.baseUrl) {
        env.baseUrl = cfg.baseUrl;
    }
    if (consumer) {
        env.consumer = consumer;
    }
    else if (cfg?.consumer) {
        env.consumer = cfg.consumer;
    }
    if (cfg?.fetch != null)
        env.fetch = cfg.fetch;
    if (cfg?.getDefaultOffset != null) {
        env.getDefaultOffset = cfg.getDefaultOffset;
    }
    return env;
}
/**
 * Uses {@link resolveBlazeoConnection} (defaults + `configure` + optional overrides),
 * then `CalendarModel.create` and `calendar.create()` unless `localOnly`.
 */
export async function createCalendarAsync(calendar, options = {}) {
    try {
        const { baseUrl: resolvedBase, consumer: resolvedConsumer } = resolveBlazeoConnection(options);
        if (resolvedBase) {
            configure({
                baseUrl: resolvedBase,
                ...(resolvedConsumer ? { consumer: resolvedConsumer } : {}),
            });
        }
        const baseUrl = resolvedBase;
        const consumer = resolvedConsumer;
        if (!options.localOnly && !baseUrl) {
            return {
                ok: false,
                error: "baseUrl is missing. Set `blazeoClientConfig.baseUrl` in `appointment-client/src/config/blazeoClientDefaults.ts` or call `configure({ baseUrl })`.",
            };
        }
        const snapshot = mapCalendarBOToSnapshot(calendar);
        const env = buildModelEnv(baseUrl, consumer, Boolean(options.localOnly));
        if (!options.localOnly && env.baseUrl == null) {
            return {
                ok: false,
                error: "Model env requires baseUrl. Set `blazeoClientConfig` or pass `baseUrl` in options.",
            };
        }
        const calendarNode = CalendarModel.create(snapshot, env);
        if (options.localOnly) {
            return { ok: true, calendar: calendarNode };
        }
        const apiRes = await calendarNode.create();
        if (isFailureStatus(apiRes)) {
            const msg = apiRes.message ??
                (typeof apiRes.data === "string" ? apiRes.data : undefined) ??
                JSON.stringify(apiRes);
            return {
                ok: false,
                error: msg || "Calendar create failed",
                apiResponse: apiRes,
            };
        }
        return { ok: true, calendar: calendarNode, apiResponse: apiRes };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
    }
}
/**
 * Uses {@link resolveBlazeoConnection}, builds a `Calendar` node from {@link mapCalendarBOToSnapshot},
 * then `calendar.update()` → POST `/Calendar/Event/Update` unless `localOnly`.
 */
export async function updateCalendarAsync(calendar, options = {}) {
    try {
        const { baseUrl: resolvedBase, consumer: resolvedConsumer } = resolveBlazeoConnection(options);
        if (resolvedBase) {
            configure({
                baseUrl: resolvedBase,
                ...(resolvedConsumer ? { consumer: resolvedConsumer } : {}),
            });
        }
        const baseUrl = resolvedBase;
        const consumer = resolvedConsumer;
        const snapshot = mapCalendarBOToSnapshot(calendar);
        if (!options.localOnly && !(calendar.calendarId?.trim())) {
            return {
                ok: false,
                error: "calendarId is required for update. Pass an existing id.",
            };
        }
        if (!options.localOnly && !baseUrl) {
            return {
                ok: false,
                error: "baseUrl is missing. Set `blazeoClientConfig.baseUrl` in `appointment-client/src/config/blazeoClientDefaults.ts` or call `configure({ baseUrl })`.",
            };
        }
        const env = buildModelEnv(baseUrl, consumer, Boolean(options.localOnly));
        if (!options.localOnly && env.baseUrl == null) {
            return {
                ok: false,
                error: "Model env requires baseUrl. Set `blazeoClientConfig` or pass `baseUrl` in options.",
            };
        }
        const calendarNode = CalendarModel.create(snapshot, env);
        if (options.localOnly) {
            return { ok: true, calendar: calendarNode };
        }
        const apiRes = await calendarNode.update();
        if (isFailureStatus(apiRes)) {
            const msg = apiRes.message ??
                (typeof apiRes.data === "string" ? apiRes.data : undefined) ??
                JSON.stringify(apiRes);
            return {
                ok: false,
                error: msg || "Calendar update failed",
                apiResponse: apiRes,
            };
        }
        return { ok: true, calendar: calendarNode, apiResponse: apiRes };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
    }
}
/**
 * Removes a calendar via `calendar.remove()` → GET `/Calendar/Remove?calendar_id=…`.
 */
export async function deleteCalendarAsync(calendarId, options = {}) {
    try {
        const id = calendarId.trim();
        if (!id) {
            return { ok: false, error: "calendarId is required for delete." };
        }
        const { baseUrl: resolvedBase, consumer: resolvedConsumer } = resolveBlazeoConnection(options);
        if (resolvedBase) {
            configure({
                baseUrl: resolvedBase,
                ...(resolvedConsumer ? { consumer: resolvedConsumer } : {}),
            });
        }
        const baseUrl = resolvedBase;
        const consumer = resolvedConsumer;
        if (!options.localOnly && !baseUrl) {
            return {
                ok: false,
                error: "baseUrl is missing. Set `blazeoClientConfig.baseUrl` in `appointment-client/src/config/blazeoClientDefaults.ts` or call `configure({ baseUrl })`.",
            };
        }
        const env = buildModelEnv(baseUrl, consumer, Boolean(options.localOnly));
        if (!options.localOnly && env.baseUrl == null) {
            return {
                ok: false,
                error: "Model env requires baseUrl. Set `blazeoClientConfig` or pass `baseUrl` in options.",
            };
        }
        const calendarNode = CalendarModel.create({ calendarId: id }, env);
        if (options.localOnly) {
            return { ok: true, calendar: calendarNode };
        }
        const apiRes = await calendarNode.remove();
        if (isFailureStatus(apiRes)) {
            const msg = apiRes.message ??
                (typeof apiRes.data === "string" ? apiRes.data : undefined) ??
                JSON.stringify(apiRes);
            return {
                ok: false,
                error: msg || "Calendar delete failed",
                apiResponse: apiRes,
            };
        }
        return { ok: true, calendar: calendarNode, apiResponse: apiRes };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
    }
}
