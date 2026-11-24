import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const TTL_OPTIONS = {
  "15s": 15_000,
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  open: null,
} as const;

export type TtlChoice = keyof typeof TTL_OPTIONS;

const MAX_LENGTH = 2000;
const ID_PATTERN = /^[A-Za-z0-9_-]{12}$/;
const filePath = path.join(process.cwd(), "data", "signals.json");

type ActiveSignal = {
  body: string;
  createdAt: number;
  expiresAt: number | null;
};

type ClosedSignal = {
  reason: "opened" | "expired";
  at: number;
};

type Database = {
  active: Record<string, ActiveSignal>;
  closed: Record<string, ClosedSignal>;
};

export class SignalError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let chain: Promise<unknown> = Promise.resolve();

function exclusive<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task, task);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function isNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

async function readDatabase(): Promise<Database> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<Database>;
    return {
      active: parsed.active ?? {},
      closed: parsed.closed ?? {},
    };
  } catch (error) {
    if (isNotFound(error)) return { active: {}, closed: {} };
    throw error;
  }
}

async function writeDatabase(database: Database) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(database), { mode: 0o600 });
}

function sweep(database: Database, now: number) {
  for (const [id, signal] of Object.entries(database.active)) {
    if (signal.expiresAt !== null && now >= signal.expiresAt) {
      delete database.active[id];
      database.closed[id] = { reason: "expired", at: now };
    }
  }
}

export function isTtlChoice(value: unknown): value is TtlChoice {
  return value === "15s" || value === "1h" || value === "24h" || value === "open";
}

export async function createSignal(body: string, ttl: TtlChoice) {
  const message = body.trim();
  if (!message) {
    throw new SignalError("Write a message before creating a link.", 400);
  }
  if (message.length > MAX_LENGTH) {
    throw new SignalError("Messages can be up to 2000 characters.", 400);
  }

  const id = randomBytes(9).toString("base64url");
  const createdAt = Date.now();
  const duration = TTL_OPTIONS[ttl];
  const expiresAt = duration === null ? null : createdAt + duration;

  await exclusive(async () => {
    const database = await readDatabase();
    sweep(database, createdAt);
    database.active[id] = { body: message, createdAt, expiresAt };
    await writeDatabase(database);
  });

  return { id, expiresAt };
}

export type OpenResult =
  | { status: "opened"; body: string }
  | { status: "expired" }
  | { status: "gone" }
  | { status: "missing" };

export async function openSignal(id: string): Promise<OpenResult> {
  if (!ID_PATTERN.test(id)) return { status: "missing" };

  return exclusive(async () => {
    const database = await readDatabase();
    const now = Date.now();
    sweep(database, now);

    const closed = database.closed[id];
    if (closed) {
      await writeDatabase(database);
      return { status: closed.reason === "expired" ? "expired" : "gone" };
    }

    const active = database.active[id];
    if (!active) {
      await writeDatabase(database);
      return { status: "missing" };
    }

    const body = active.body;
    delete database.active[id];
    database.closed[id] = { reason: "opened", at: now };
    await writeDatabase(database);
    return { status: "opened", body };
  });
}

export async function expireSignal(id: string): Promise<OpenResult | { status: "pending" }> {
  if (!ID_PATTERN.test(id)) return { status: "missing" };

  return exclusive(async () => {
    const database = await readDatabase();
    const now = Date.now();
    sweep(database, now);

    const closed = database.closed[id];
    if (closed) {
      await writeDatabase(database);
      return { status: closed.reason === "expired" ? "expired" : "gone" };
    }

    const active = database.active[id];
    if (!active) {
      await writeDatabase(database);
      return { status: "missing" };
    }

    await writeDatabase(database);
    return { status: "pending" };
  });
}
