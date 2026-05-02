import React, { useMemo, useState } from "react";
import { HttpError } from "./api/http";
import { raysanApi, type CreateMeetingInput, type HealthResponse, type ZoomMeeting } from "./api/raysanApi";

/**
 * App component (main page).
 *
 * React basics you will see in this file:
 * - useState: store values that can change (form inputs, loading state, results)
 * - event handlers: functions called when you click a button or submit a form
 * - conditional rendering: show different UI depending on state
 */
export default function App() {
  // ---------
  // 1) State
  // ---------
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [meetingsJson, setMeetingsJson] = useState<ZoomMeeting | null>(null);
  const [createdMeeting, setCreatedMeeting] = useState<ZoomMeeting | null>(null);
  const [deletedOk, setDeletedOk] = useState<boolean | null>(null);

  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state (meeting create)
  const [topic, setTopic] = useState("Demo meeting from React");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)); // "YYYY-MM-DD"
  const [time, setTime] = useState("12:00"); // "HH:mm"

  // Form state (delete meeting)
  const [meetingIdToDelete, setMeetingIdToDelete] = useState("");

  // Create the request payload from form state
  const createMeetingInput: CreateMeetingInput = useMemo(
    () => ({ topic, date, time }),
    [topic, date, time]
  );

  // -------------
  // 2) Helpers
  // -------------
  function clearOutputs() {
    setHealth(null);
    setMeetingsJson(null);
    setCreatedMeeting(null);
    setDeletedOk(null);
  }

  function formatError(e: unknown) {
    // This makes errors easier to read for beginners.
    if (e instanceof HttpError) return `${e.message}${e.bodyText ? `\n\n${e.bodyText}` : ""}`;
    if (e instanceof Error) return e.message;
    return String(e);
  }

  // -------------
  // 3) Handlers (call backend APIs)
  // -------------
  async function onHealthClick() {
    clearOutputs();
    setError(null);
    setLoading("Calling GET /health ...");

    try {
      const data = await raysanApi.health();
      setHealth(data);
    } catch (e) {
      setError(formatError(e));
    } finally {
      setLoading(null);
    }
  }

  async function onListMeetingsClick() {
    clearOutputs();
    setError(null);
    setLoading("Calling GET /meetings ...");

    try {
      const data = await raysanApi.listMeetings();
      setMeetingsJson(data);
    } catch (e) {
      setError(formatError(e));
    } finally {
      setLoading(null);
    }
  }

  async function onCreateMeetingSubmit(e: React.FormEvent) {
    // Prevent the browser from reloading the page (default form behavior).
    e.preventDefault();

    clearOutputs();
    setError(null);
    setLoading("Calling POST /meetings ...");

    try {
      const data = await raysanApi.createMeeting(createMeetingInput);
      setCreatedMeeting(data);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(null);
    }
  }

  async function onDeleteMeetingSubmit(e: React.FormEvent) {
    e.preventDefault();

    clearOutputs();
    setError(null);
    setLoading("Calling DELETE /meetings/:meetingId ...");

    try {
      await raysanApi.deleteMeeting(meetingIdToDelete.trim());
      setDeletedOk(true);
    } catch (err) {
      setDeletedOk(false);
      setError(formatError(err));
    } finally {
      setLoading(null);
    }
  }

  // -------------
  // 4) UI
  // -------------
  return (
    <div className="page">
      <header className="header">
        <h1>Raysan Web (very simple React)</h1>
        <p className="muted">
          This page calls your Express API at <code>http://localhost:3000</code> through a Vite proxy.
        </p>
      </header>

      <section className="card">
        <h2>Quick tests</h2>
        <div className="row">
          <button onClick={onHealthClick} disabled={!!loading}>
            Call GET /health
          </button>
          <button onClick={onListMeetingsClick} disabled={!!loading}>
            Call GET /meetings
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Create meeting (POST /meetings)</h2>
        <form onSubmit={onCreateMeetingSubmit} className="form">
          <label>
            Topic
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Meeting topic" />
          </label>

          <div className="row">
            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              Time
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          </div>

          <button type="submit" disabled={!!loading}>
            Create meeting
          </button>
        </form>
        <p className="muted">
          Your backend expects <code>{"{ topic, date, time }"}</code>.
        </p>
      </section>

      <section className="card">
        <h2>Delete meeting (DELETE /meetings/:meetingId)</h2>
        <form onSubmit={onDeleteMeetingSubmit} className="form">
          <label>
            Meeting ID
            <input
              value={meetingIdToDelete}
              onChange={(e) => setMeetingIdToDelete(e.target.value)}
              placeholder="123456789"
            />
          </label>
          <button type="submit" disabled={!!loading || !meetingIdToDelete.trim()}>
            Delete
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Result</h2>

        {/* Show loading state */}
        {loading && <p>Loading: {loading}</p>}

        {/* Show errors */}
        {error && (
          <pre className="error" aria-label="error">
            {error}
          </pre>
        )}

        {/* Show outputs (only one will be non-null because we clearOutputs() before each call) */}
        {health && <JsonBox title="GET /health response" value={health} />}
        {meetingsJson && <JsonBox title="GET /meetings response" value={meetingsJson} />}
        {createdMeeting && <JsonBox title="POST /meetings response" value={createdMeeting} />}
        {deletedOk === true && <p className="ok">Deleted (204 No Content)</p>}
      </section>

      <footer className="footer muted">
        Tips: open DevTools → Network tab to see the requests.
      </footer>
    </div>
  );
}

function JsonBox({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="jsonBox">
      <div className="jsonTitle">{title}</div>
      <pre className="json">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

