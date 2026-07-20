import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

let cachedLocalEnv: Record<string, string> | null = null;

function readLocalEnv() {
  if (cachedLocalEnv) {
    return cachedLocalEnv;
  }

  const envPath = join(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    cachedLocalEnv = {};
    return cachedLocalEnv;
  }

  cachedLocalEnv = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .reduce<Record<string, string>>((values, line) => {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);

      if (match) {
        values[match[1]] = match[2];
      }

      return values;
    }, {});

  return cachedLocalEnv;
}

export function getServerEnv(name: string) {
  return process.env[name] ?? readLocalEnv()[name];
}
