import { EventModel, configure } from "@blazeo.com/calendar-client";
import { buildModelEnv, resolveBlazeoConnection } from "../calendar/createCalendar.js";
import { mapAppointmentEventToPlain, mapAppointmentToEventSnapshot, } from "./mapAppointmentToEventSnapshot.js";
function isFailureStatus(res) {
    return res.status !== "success" && res.status !== "Success";
}
function ensureConfigure(resolvedBase, resolvedConsumer) {
    if (resolvedBase) {
        configure({
            baseUrl: resolvedBase,
            ...(resolvedConsumer ? { consumer: resolvedConsumer } : {}),
        });
    }
}
async function runEventMutation(input, mode, options) {
    const { baseUrl: resolvedBase, consumer: resolvedConsumer } = resolveBlazeoConnection(options);
    ensureConfigure(resolvedBase, resolvedConsumer);
    const baseUrl = resolvedBase;
    const consumer = resolvedConsumer;
    if (!options.localOnly && !baseUrl) {
        return {
            ok: false,
            error: "baseUrl is missing. Set `blazeoClientConfig.baseUrl` in `appointment-client/src/config/blazeoClientDefaults.ts` or call `configure({ baseUrl })`.",
        };
    }
    const snapshot = mapAppointmentToEventSnapshot(input, mode);
    const offset = options.offsetMinutes;
    if (mode === "create") {
        if (options.localOnly) {
            const env = buildModelEnv(baseUrl, consumer, true);
            const eventNode = EventModel.create({ ...snapshot, eventId: "new" }, env);
            return { ok: true, event: eventNode };
        }
        const apiRes = await EventModel.createEvent(snapshot, offset);
        if (apiRes?.eventId) {
            const apiResponse = mapAppointmentEventToPlain(apiRes);
            return {
                ok: true,
                event: apiRes,
                apiResponse,
            };
        }
        if (isFailureStatus(apiRes)) {
            const msg = apiRes.message ??
                (typeof apiRes.data === "string" ? apiRes.data : undefined) ??
                JSON.stringify(apiRes);
            return { ok: false, error: msg || "Event create failed", apiResponse: apiRes };
        }
        const apiResponse = mapAppointmentEventToPlain(apiRes) ?? apiRes;
        return {
            ok: true,
            event: apiRes,
            apiResponse,
        };
    }
    const eventIdForApi = snapshot.eventId;
    if (!eventIdForApi || eventIdForApi === "new") {
        return {
            ok: false,
            error: "eventId is required for reschedule (existing Blazeo event id).",
        };
    }
    const env = buildModelEnv(baseUrl, consumer, Boolean(options.localOnly));
    if (!options.localOnly && env.baseUrl == null) {
        return {
            ok: false,
            error: "Model env requires baseUrl. Set `blazeoClientConfig` or pass `baseUrl` in options.",
        };
    }
    const eventNode = EventModel.create(snapshot, env);
    if (options.localOnly) {
        return { ok: true, event: eventNode };
    }
    const apiRes = await eventNode.reschedule(offset);
    if (isFailureStatus(apiRes)) {
        const msg = apiRes.message ??
            (typeof apiRes.data === "string" ? apiRes.data : undefined) ??
            JSON.stringify(apiRes);
        return { ok: false, error: msg || "Event reschedule failed", apiResponse: apiRes };
    }
    const apiResponse = mapAppointmentEventToPlain(eventNode);
    return {
        ok: true,
        event: eventNode,
        apiResponse,
    };
}
/**
 * Creates an appointment event — `Event.create()` → `POST /event/create`
 * (aligned with `AppointmentAPIAdapter.Create`).
 */
export async function createAppointmentEventAsync(input, options = {}) {
    try {
        return await runEventMutation(input, "create", options);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
    }
}
/**
 * Reschedules an appointment — `Event.reschedule()` → `POST /event/reschedule`
 * (aligned with `AppointmentAPIAdapter.Reschedule`).
 */
export async function rescheduleAppointmentEventAsync(input, options = {}) {
    try {
        return await runEventMutation(input, "reschedule", options);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
    }
}
/**
 * Cancels an appointment — `EventModel.cancel` → `GET /event/cancel`
 * (aligned with `AppointmentAPIAdapter.Cancel`).
 */
export async function cancelAppointmentEventAsync(appointmentEventId, options = {}) {
    try {
        const id = appointmentEventId.trim();
        if (!id) {
            return { ok: false, error: "appointmentEventId is required for cancel." };
        }
        const { baseUrl: resolvedBase, consumer: resolvedConsumer } = resolveBlazeoConnection(options);
        ensureConfigure(resolvedBase, resolvedConsumer);
        const baseUrl = resolvedBase;
        if (!options.localOnly && !baseUrl) {
            return {
                ok: false,
                error: "baseUrl is missing. Set `blazeoClientConfig.baseUrl` in `appointment-client/src/config/blazeoClientDefaults.ts` or call `configure({ baseUrl })`.",
            };
        }
        if (options.localOnly) {
            return { ok: true, apiResponse: undefined };
        }
        const apiRes = await EventModel.cancel(id);
        if (isFailureStatus(apiRes)) {
            const msg = apiRes.message ??
                (typeof apiRes.data === "string" ? apiRes.data : undefined) ??
                JSON.stringify(apiRes);
            return {
                ok: false,
                error: msg || "Event cancel failed",
                apiResponse: apiRes,
            };
        }
        return { ok: true, apiResponse: apiRes };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
    }
}
