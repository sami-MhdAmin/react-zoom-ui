/**
 * Very small HTTP helper for beginners.
 *
 * Why this exists:
 * - To keep fetch() details in one place
 * - To consistently handle JSON + errors
 *
 * Important:
 * - We call relative URLs like "/health" and "/meetings".
 * - In development, Vite proxy forwards these to your Express server (localhost:3000).
 */

export class HttpError extends Error {
  status: number;
  bodyText?: string;

  constructor(message: string, status: number, bodyText?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  // 1) Make the HTTP request
  const res = await fetch(path, {
    // default headers (merged with any custom headers passed in init)
    headers: {
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  // 2) If the server returned an error status, throw a helpful error
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new HttpError(`Request failed: ${res.status} ${res.statusText}`, res.status, text);
  }

  // 3) Parse JSON response
  return (await res.json()) as T;
}

export const http = {
  get<T>(path: string) {
    return requestJson<T>(path, { method: "GET" });
  },
  post<T>(path: string, body: unknown) {
    return requestJson<T>(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  },
  del(path: string) {
    return fetch(path, { method: "DELETE" }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new HttpError(`Request failed: ${res.status} ${res.statusText}`, res.status, text);
      }
    });
  },
};

