import { configure } from "@blazeo.com/calendar-client";
import { blazeoClientConfig } from "./blazeo.config.js";
/** Push {@link blazeoClientConfig} into `@blazeo.com/calendar-client` (global store). */
export function applyBlazeoClientConfig() {
    const baseUrl = blazeoClientConfig.baseUrl?.trim().replace(/\/+$/, "");
    if (!baseUrl)
        return;
    const consumer = blazeoClientConfig.consumer?.trim();
    configure({
        baseUrl,
        ...(consumer ? { consumer } : {}),
    });
}
//# sourceMappingURL=applyBlazeoClientConfig.js.map