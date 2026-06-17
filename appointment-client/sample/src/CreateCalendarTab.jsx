import { useMemo, useState } from "react";
import {
  calendarPayloadHasEventReminders,
  calendarPayloadHasFormFields,
  calendarPayloadHasLocations,
  calendarPayloadHasTheme,
  collectAppointmentReminders,
  createCalendarAsync,
  createCalendarWithRelationsAsync,
  ensureBlazeoHttpReady,
  mapCalendarFormFieldsToApi,
  mapCalendarThemeToPreferencePayload,
  mapEmailRemindersToPreferencePayload,
  mapInAppRemindersToPreferencePayload,
  mapSmsRemindersToPreferencePayload,
} from "appointment-client";
import { getSnapshot } from "mobx-state-tree";
import { configureBlazeoFromEffective, useBlazeoConnection } from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

/** LocationType: Physical=0, Video=1, Phone=2, Custom=3 */
export function getExampleAppointmentLocations() {
  return [
    { type: 2, value: "+112345678901" },
    { type: 0, value: "Test street" },
    { type: 1, value: "https://meet.google.com/xyx" },
    { type: 3, value: "" },
  ];
}

/** channelType 1 = SMS, 2 = Email, 3 = Notification/InApp */
export function getExampleAppointmentReminders() {
  return [
    { channelType: 3, recipientType: 2, beforeEventTime: 45, unit: 1 },
    { channelType: 1, recipientType: 1, beforeEventTime: 15, unit: 1 },
    { channelType: 2, recipientType: 1, beforeEventTime: 10, unit: 1 },
    { channelType: 2, recipientType: 2, beforeEventTime: 20, unit: 1 },
    { channelType: 2, recipientType: 3, beforeEventTime: 30, unit: 1 },
  ];
}

/** Demo payload aligned with `CalendarBOInput` / server `CalendarBO`. */
export function getExampleCalendarBOInput() {
  return {
    companyKey: "company_key",
    name: "Demo calendar",
    timeZoneId: "Pakistan Standard Time",
    assignmentMethod: 1,
    duration: 20,
    durationUnit: 1,
    minimumBookingNotice: 1,
    minimumBookingNoticeUnit: 2,
    minimumCancelationNotice: 1,
    minimumCancelationNoticeUnit: 2,
    futureLimit: 1,
    futureLimitUnit: 6,
    logoUrl:
      "https://apexchatcrmflows.blob.core.windows.net/theme/coverphoto_38793614-4b43-4422-b174-b0d9d8bbd3c2_v_1_1778869684.jpg",
    color: "#ff0000",
    bufferTime: 10,
    bufferTimeUnit: 1,
    bookingLimit: -1,
    appointmentReminders: getExampleAppointmentReminders(),
    appointmentLocations: getExampleAppointmentLocations(),
    members: [{ id: "00000000-0000-0000-0000-000000000000" }],
    openingHours: [
      {
        id: 1,
        days: [1, 2, 3, 4, 5],
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        off: false,
        participantId: "00000000-0000-0000-0000-000000000000",
      },
    ],
    appointmentUserDefinedFields: [
      {
        fieldLabel: "First Name",
        fieldKey: "FirstName",
        fieldId: "0702d225-45b1-4381-b24b-e788b17c2915",
        isRequired: true,
        isMandatory: true,
      },
      {
        fieldLabel: "Email",
        fieldKey: "Email",
        fieldId: "c2c08947-4050-41ba-8d59-3ccff8bbbd79",
        isRequired: true,
        isMandatory: true,
      },
      {
        fieldName: "Test dropdown",
        fieldType: 3,
        fieldSubType: 303,
        leadCustomOptions: [{ value: "A" }, { value: "B" }],
      },
    ],
  };
}

export function CreateCalendarTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [localOnly, setLocalOnly] = useState(false);
  const [saveRelations, setSaveRelations] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(getExampleCalendarBOInput(), null, 2)
  );

  const parsedPayload = useMemo(() => {
    try {
      return JSON.parse(jsonText);
    } catch {
      return null;
    }
  }, [jsonText]);

  const smsPreferencePreview = useMemo(() => {
    if (!parsedPayload) return null;
    try {
      return mapSmsRemindersToPreferencePayload(collectAppointmentReminders(parsedPayload));
    } catch {
      return null;
    }
  }, [parsedPayload]);

  const emailPreferencePreview = useMemo(() => {
    if (!parsedPayload) return null;
    try {
      return mapEmailRemindersToPreferencePayload(collectAppointmentReminders(parsedPayload));
    } catch {
      return null;
    }
  }, [parsedPayload]);

  const inAppPreferencePreview = useMemo(() => {
    if (!parsedPayload) return null;
    try {
      return mapInAppRemindersToPreferencePayload(collectAppointmentReminders(parsedPayload));
    } catch {
      return null;
    }
  }, [parsedPayload]);

  const themePreferencePreview = useMemo(() => {
    if (!parsedPayload) return null;
    try {
      return mapCalendarThemeToPreferencePayload(parsedPayload);
    } catch {
      return null;
    }
  }, [parsedPayload]);

  const formFieldsPreview = useMemo(() => {
    if (!parsedPayload || !calendarPayloadHasFormFields(parsedPayload)) return null;
    try {
      return mapCalendarFormFieldsToApi(parsedPayload);
    } catch {
      return null;
    }
  }, [parsedPayload]);

  const hint = useMemo(() => {
    if (localOnly) return "Local only: no HTTP.";
    if (!effective.baseUrl) return "Set Base URL above first.";
    const hasSms = (smsPreferencePreview?.length ?? 0) > 0;
    const hasEmail = (emailPreferencePreview?.length ?? 0) > 0;
    const hasInApp = (inAppPreferencePreview?.length ?? 0) > 0;
    const hasTheme = (themePreferencePreview?.length ?? 0) > 0;
    const hasForm = (formFieldsPreview?.length ?? 0) > 0;
    const hasLocations = parsedPayload != null && calendarPayloadHasLocations(parsedPayload);
    const relations = saveRelations
      ? "calendar + participants + opening hours"
      : "calendar body only";
    const prefs = [];
    if (hasSms) prefs.push("SMSEventReminder");
    if (hasEmail) prefs.push("EmailEventReminder");
    if (hasInApp) prefs.push("InAppEventReminder");
    if (hasTheme) prefs.push("CalendarTheme");
    const pref =
      prefs.length > 0
        ? ` · then POST /preference/Calendar/{calendarId}/(${prefs.join(", ")})`
        : "";
    const form = hasForm
      ? ` · then POST /CustomField/Form/Save from appointmentUserDefinedFields (${formFieldsPreview.length} field(s))`
      : "";
    const locations = hasLocations ? " · then save appointmentLocations" : "";
    return `Will save ${relations}${pref}${locations}${form}.`;
  }, [
    parsedPayload,
    localOnly,
    effective.baseUrl,
    saveRelations,
    smsPreferencePreview,
    emailPreferencePreview,
    inAppPreferencePreview,
    themePreferencePreview,
    formFieldsPreview,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    let payload;
    try {
      payload = JSON.parse(jsonText);
    } catch (err) {
      setError(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    if (!localOnly && !effective.baseUrl) {
      setError("Set Base URL in the connection card above.");
      return;
    }
    if (!localOnly) {
      configureBlazeoFromEffective(effective);
      ensureBlazeoHttpReady({
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
    }

    const hasRelations = (payload.members?.length ?? 0) > 0 || (payload.openingHours?.length ?? 0) > 0;
    const hasPrefs =
      calendarPayloadHasEventReminders(payload) || calendarPayloadHasTheme(payload);
    const hasForm = calendarPayloadHasFormFields(payload);
    const hasLocations = calendarPayloadHasLocations(payload);
    const useRelations =
      !localOnly && (saveRelations && hasRelations || hasPrefs || hasForm || hasLocations);

    setBusy(true);
    try {
      const opts = {
        localOnly,
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      };
      const result = useRelations
        ? await createCalendarWithRelationsAsync(payload, opts)
        : await createCalendarAsync(payload, opts);

      const display = result.ok
        ? {
            ok: true,
            smsRemindersPreferenceSaved: result.smsRemindersPreferenceSaved,
            smsRemindersPreference: result.smsRemindersPreference,
            emailRemindersPreferenceSaved: result.emailRemindersPreferenceSaved,
            emailRemindersPreference: result.emailRemindersPreference,
            inAppRemindersPreferenceSaved: result.inAppRemindersPreferenceSaved,
            inAppRemindersPreference: result.inAppRemindersPreference,
            calendarThemePreferenceSaved: result.calendarThemePreferenceSaved,
            calendarThemePreference: result.calendarThemePreference,
            membersAdded: result.membersAdded,
            openingHoursSaved: result.openingHoursSaved,
            appointmentFormSaved: result.appointmentFormSaved,
            appointmentFormFields: result.appointmentFormFields,
            calendar: getSnapshot(result.calendar),
            apiResponse: result.apiResponse,
          }
        : result;
      setOutput(JSON.stringify(display, null, 2));
      if (!result.ok) setError(mapBlazeoDemoError(result.error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Create calendar</h2>
        <p className="muted small">{hint}</p>
        <label className="form__label">
          <span>
            <input type="checkbox" checked={localOnly} onChange={(e) => setLocalOnly(e.target.checked)} /> Local only
          </span>
        </label>
        <label className="form__label">
          <span>
            <input
              type="checkbox"
              checked={saveRelations}
              disabled={localOnly}
              onChange={(e) => setSaveRelations(e.target.checked)}
            />{" "}
            Save members &amp; opening hours
          </span>
        </label>
      </div>

      {smsPreferencePreview?.length ? (
        <div className="card">
          <h2>SMS preference preview</h2>
          <p className="muted small">
            Only <code>channelType: 1</code> rows →{" "}
            <code>POST /preference/Calendar/&#123;calendarId&#125;/SMSEventReminder</code>
          </p>
          <pre className="pre-block">{JSON.stringify(smsPreferencePreview, null, 2)}</pre>
        </div>
      ) : null}

      {emailPreferencePreview?.length ? (
        <div className="card">
          <h2>Email preference preview</h2>
          <p className="muted small">
            <code>channelType: 2</code> →{" "}
            <code>POST /preference/Calendar/&#123;calendarId&#125;/EmailEventReminder</code>
          </p>
          <pre className="pre-block">{JSON.stringify(emailPreferencePreview, null, 2)}</pre>
        </div>
      ) : null}

      {inAppPreferencePreview?.length ? (
        <div className="card">
          <h2>In-app preference preview</h2>
          <p className="muted small">
            <code>channelType: 3</code> →{" "}
            <code>POST /preference/Calendar/&#123;calendarId&#125;/InAppEventReminder</code> (
            <code>Recipient</code> scalar)
          </p>
          <pre className="pre-block">{JSON.stringify(inAppPreferencePreview, null, 2)}</pre>
        </div>
      ) : null}

      {formFieldsPreview?.length ? (
        <div className="card">
          <h2>Form fields preview</h2>
          <p className="muted small">
            <code>appointmentUserDefinedFields</code> on the calendar → transformed for{" "}
            <code>POST /CustomField/Form/Save</code> after create (uses new <code>calendarId</code>).
          </p>
          <pre className="pre-block">{JSON.stringify(formFieldsPreview, null, 2)}</pre>
        </div>
      ) : null}

      {themePreferencePreview?.length ? (
        <div className="card">
          <h2>Theme preference preview</h2>
          <p className="muted small">
            <code>logoUrl</code> / <code>color</code> on calendar →{" "}
            <code>POST /preference/Calendar/&#123;calendarId&#125;/CalendarTheme</code>
          </p>
          <pre className="pre-block">{JSON.stringify(themePreferencePreview, null, 2)}</pre>
        </div>
      ) : null}

      <div className="card">
        <h2>Payload</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label">
            <span>JSON</span>
            <textarea
              className="form__textarea"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              rows={16}
            />
          </label>
          <button className="btn btn--primary" disabled={busy}>
            {busy ? "Working…" : "Create"}
          </button>
        </form>
      </div>

      {error ? (
        <div className="card card--error" role="alert">
          <h2>Error</h2>
          <pre className="pre-block">{error}</pre>
        </div>
      ) : null}

      {output ? (
        <div className="card card--success">
          <h2>Result</h2>
          <pre className="pre-block">{output}</pre>
        </div>
      ) : null}
    </>
  );
}
