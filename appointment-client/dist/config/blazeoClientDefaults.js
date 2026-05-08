/**
 * Optional file-based defaults for local development or publishing a fork.
 * Host apps should prefer {@link initializeAppointmentClient} with env-driven `baseUrl` / `consumer`.
 * To apply these values, call {@link applyBlazeoClientConfig} during bootstrap (not automatic on import).
 *
 * @example baseUrl: "https://apptscheduling.azurewebsites.net"
 */
export const blazeoClientConfig = {
    baseUrl: "https://apptscheduling.azurewebsites.net",
    consumer: "smarthub",
};
