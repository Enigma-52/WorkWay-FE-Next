import { headers } from "next/headers";
import { env } from "@/lib/config/env";

type Query = Record<string, string | number | boolean | undefined | null>;

export class BackendApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public url: string,
    public payload: unknown,
  ) {
    super(`Backend request failed: ${status} ${statusText} (${url})`);
  }
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(path, env.BACKEND_API_URL);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

export async function backendGet<T>(
  path: string,
  options?: {
    query?: Query;
    revalidate?: number | false;
    tags?: string[];
  },
): Promise<T> {
  const url = buildUrl(path, options?.query);
  const h = await headers();
  const cookie = h.get("cookie") || "";
  const auth = h.get("authorization") || "";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      cookie,
      authorization: auth,
      "x-workway-next-ssr": "1",
    },
    cache: "no-store",
    next:
      options?.revalidate === false
        ? undefined
        : { revalidate: options?.revalidate, tags: options?.tags },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new BackendApiError(response.status, response.statusText, url, payload);
  }
  return payload as T;
}

