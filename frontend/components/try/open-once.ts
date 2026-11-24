"use client";

export type OpenResponse =
  | { status: "opened"; body: string }
  | { status: "expired" }
  | { status: "gone" }
  | { status: "missing" }
  | { status: "error" };

const requests = new Map<string, Promise<OpenResponse>>();

export function openSignalOnce(id: string) {
  const existing = requests.get(id);
  if (existing) return existing;

  const request = fetch(`/api/signals/${id}/open`, { method: "POST", cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) return { status: "error" } as const;
      return (await response.json()) as OpenResponse;
    })
    .catch(() => ({ status: "error" }) as const)
    .then((result) => {
      if (result.status === "error") requests.delete(id);
      return result;
    });

  requests.set(id, request);
  return request;
}

export function releaseSignal(id: string) {
  requests.delete(id);
}
