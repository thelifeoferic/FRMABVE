const SESSION_COOKIE = "frmabve_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function getSecret() {
  return process.env.LOCK_SESSION_SECRET ?? process.env.LOCK_PASSWORD ?? "frmabve-local-lock";
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));

  return toHex(signature);
}

export function getLockCredentials() {
  return {
    username: process.env.LOCK_USERNAME ?? "Asheville",
    password: process.env.LOCK_PASSWORD ?? ""
  };
}

export async function createSessionToken() {
  const expires = Date.now() + SESSION_TTL_MS;
  const signature = await sign(String(expires));

  return `v1.${expires}.${signature}`;
}

export async function isValidSessionToken(token?: string) {
  if (!token) return false;

  const [version, expires, signature] = token.split(".");

  if (version !== "v1" || !expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;

  return signature === (await sign(expires));
}

export { SESSION_COOKIE, SESSION_TTL_MS };
