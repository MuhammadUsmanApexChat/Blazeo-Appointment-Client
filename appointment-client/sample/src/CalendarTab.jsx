import { CalendarClient, getExampleSlots, packageName } from "appointment-client";

const client = new CalendarClient();

export function CalendarTab() {
  const slots = getExampleSlots();
  const fromClient = client.getExampleSlots();

  return (
    <>
      <div className="card">
        <h2>Package</h2>
        <p>
          <code>packageName</code> → <strong>{packageName}</strong>
        </p>
        <p>
          <code>CalendarClient#name</code> → <strong>{client.name}</strong>
        </p>
      </div>

      <div className="card">
        <h2>
          <code>getExampleSlots()</code>
        </h2>
        <pre className="pre-block">{JSON.stringify(slots, null, 2)}</pre>
      </div>

      <div className="card">
        <h2>
          <code>CalendarClient</code> instance
        </h2>
        <pre className="pre-block">{JSON.stringify(fromClient, null, 2)}</pre>
      </div>
    </>
  );
}

