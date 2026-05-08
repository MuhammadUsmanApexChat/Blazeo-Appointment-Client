import { useState } from "react";
import {
  BlazeoConnectionProvider,
  useBlazeoConnection,
} from "./BlazeoConnectionSettings.jsx";
import { ensureBlazeoHttpReady, getConfig } from "appointment-client";
import { CalendarTab } from "./CalendarTab.jsx";
import { EventTab } from "./EventTab.jsx";
import { ParticipantTab } from "./ParticipantTab.jsx";
import { ParticipantInfoTab } from "./ParticipantInfoTab.jsx";
import { ParticipantOpeningHoursTab } from "./ParticipantOpeningHoursTab.jsx";
import { AllParticipantOpeningHoursTab } from "./AllParticipantOpeningHoursTab.jsx";
import { AvailabilityTab } from "./AvailabilityTab.jsx";
import { CreateCalendarTab } from "./CreateCalendarTab.jsx";
import { FetchCalendarTab } from "./FetchCalendarTab.jsx";
import { OpeningHoursTab } from "./OpeningHoursTab.jsx";

const TABS = [
  { id: "calendar", label: "Calendar" },
  /** `FetchCalendarTab` → `fetchCalendarDetails` + `calendarView` (unified object). */
  { id: "fetch", label: "Fetch · calendarView" },
  { id: "create", label: "Create calendar" },
  { id: "event", label: "Event" },
  { id: "participant", label: "Participant" },
  { id: "participant-info", label: "Participant info" },
  { id: "opening-hours", label: "Opening Hours" },
  { id: "participant-opening-hours", label: "Participant opening hours" },
  { id: "all-participant-opening-hours", label: "All participant opening hours" },
  { id: "availability", label: "Availability / booking" },
];

function ConnectionSettingsCard() {
  const {
    baseUrlInput,
    consumerInput,
    setBaseUrlInput,
    setConsumerInput,
    effective,
    connectionOpts,
  } = useBlazeoConnection();

  const ready = ensureBlazeoHttpReady({
    baseUrl: effective.baseUrl,
    ...(effective.consumer ? { consumer: effective.consumer } : {}),
  });
  const cfg = getConfig?.() ?? null;

  return (
    <div className="card connection-card">
      <h2>Blazeo connection</h2>
      <p className="muted small">
        Values are saved in <code>localStorage</code>. Empty fields fall back to{" "}
        <code>appointment-client/src/config/blazeoClientDefaults.ts</code>. All tabs use the <strong>effective</strong> URL
        here and run <code>pushBlazeoConnection</code> + <code>ensureBlazeoHttpReady</code> so calendar APIs receive{" "}
        <code>baseUrl</code> from this card.
      </p>
      <p className="muted small">
        Effective:{" "}
        <code>{effective.baseUrl || "(set below or in blazeoClientDefaults.ts)"}</code>
        {effective.consumer ? (
          <>
            {" "}
            · Consumer: <code>{effective.consumer}</code>
          </>
        ) : null}
      </p>
      <p className="muted small">
        Debug: <code>connectionOpts</code> → <code>{JSON.stringify(connectionOpts)}</code> ·{" "}
        <code>ensureBlazeoHttpReady</code> →{" "}
        <code>{ready.ok ? "ok" : "missing_base_url"}</code> · <code>getConfig().baseUrl</code> →{" "}
        <code>{cfg?.baseUrl ?? "(null)"}</code>
      </p>
      <div className="connection-card__row">
        <label className="form__label">
          <span>Base URL</span>
          <input
            type="url"
            className="form__input"
            placeholder="https://api.example.com"
            value={baseUrlInput}
            onChange={(e) => setBaseUrlInput(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="form__label">
          <span>Consumer</span>
          <input
            type="text"
            className="form__input"
            placeholder="Optional — same as backend header"
            value={consumerInput}
            onChange={(e) => setConsumerInput(e.target.value)}
            autoComplete="off"
          />
        </label>
      </div>
    </div>
  );
}

function AppShell() {
  const [activeId, setActiveId] = useState("calendar");

  return (
    <main className="page">
      <header className="header">
        <h1>appointment-client</h1>
        <p className="muted">
          Browser sample — set <strong>Base URL</strong> in <strong>Blazeo connection</strong> below first; every tab uses
          those values for <code>configure</code> + API calls. Tab <strong>Fetch · calendarView</strong> shows the unified{" "}
          <code>calendarView</code> object.
        </p>
      </header>

      <ConnectionSettingsCard />

      <div className="tabs" role="tablist" aria-label="Sample areas">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeId === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`tabs__btn ${activeId === tab.id ? "tabs__btn--active" : ""}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-panel">
        {activeId === "calendar" && (
          <section role="tabpanel" id="panel-calendar" aria-labelledby="tab-calendar">
            <CalendarTab />
          </section>
        )}
        {activeId === "fetch" && (
          <section role="tabpanel" id="panel-fetch" aria-labelledby="tab-fetch">
            <FetchCalendarTab />
          </section>
        )}
        {activeId === "create" && (
          <section role="tabpanel" id="panel-create" aria-labelledby="tab-create">
            <CreateCalendarTab />
          </section>
        )}
        {activeId === "event" && (
          <section role="tabpanel" id="panel-event" aria-labelledby="tab-event">
            <EventTab />
          </section>
        )}
        {activeId === "participant" && (
          <section role="tabpanel" id="panel-participant" aria-labelledby="tab-participant">
            <ParticipantTab />
          </section>
        )}
        {activeId === "participant-info" && (
          <section role="tabpanel" id="panel-participant-info" aria-labelledby="tab-participant-info">
            <ParticipantInfoTab />
          </section>
        )}
        {activeId === "opening-hours" && (
          <section role="tabpanel" id="panel-opening-hours" aria-labelledby="tab-opening-hours">
            <OpeningHoursTab />
          </section>
        )}
        {activeId === "participant-opening-hours" && (
          <section
            role="tabpanel"
            id="panel-participant-opening-hours"
            aria-labelledby="tab-participant-opening-hours"
          >
            <ParticipantOpeningHoursTab />
          </section>
        )}
        {activeId === "all-participant-opening-hours" && (
          <section
            role="tabpanel"
            id="panel-all-participant-opening-hours"
            aria-labelledby="tab-all-participant-opening-hours"
          >
            <AllParticipantOpeningHoursTab />
          </section>
        )}
        {activeId === "availability" && (
          <section role="tabpanel" id="panel-availability" aria-labelledby="tab-availability">
            <AvailabilityTab />
          </section>
        )}
      </div>
    </main>
  );
}

export function App() {
  return (
    <BlazeoConnectionProvider>
      <AppShell />
    </BlazeoConnectionProvider>
  );
}

