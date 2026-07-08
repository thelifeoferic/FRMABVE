import { getSupabaseConfigStatus } from "@/lib/supabase/client";

export default function SettingsPage() {
  const status = getSupabaseConfigStatus();

  return (
    <main className="settings-page">
      <section className="panel">
        <div className="section-heading">
          <p>Settings</p>
          <span>{status.connected ? "Connected" : "Setup needed"}</span>
        </div>
        <h1>Integrations</h1>
        <p>Supabase, OpenAI, and Klaviyo keys can be connected when the prototype moves from mock mode to live mode.</p>
      </section>
    </main>
  );
}
