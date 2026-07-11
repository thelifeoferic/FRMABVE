export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="lock-screen">
      <section className="lock-card" aria-label="From Above login">
        <div className="lock-mark">FROM ABOVE</div>
        <p className="lock-eyebrow">Campaign Studio</p>
        <h1>Locked workspace</h1>
        <p className="lock-copy">Sign in to build draft campaigns for Asheville Dispensary and connected brands.</p>

        <form className="lock-form" method="post" action="/api/login">
          <label>
            Username
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {hasError ? <div className="lock-error">That login did not match. Please try again.</div> : null}
          <button type="submit">Unlock Studio</button>
        </form>
      </section>
    </main>
  );
}
