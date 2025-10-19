import type { StandardSchemaV1 } from "@standard-schema/spec";
import * as m from "true-myth";
import type { JsonValue } from "type-fest";

import { JSON } from "#json.ts";
import type * as t from "#types.ts";

export interface HttpResponse {
  headers: Record<string, string | string[]>;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
}

export interface FetchTextErr {
  name: "FetchTextErr";
  cause: t.FetchTextError;
  httpResponse: HttpResponse;
}

export interface ParseJSONErr {
  name: "ParseJSONErr";
  cause: t.SyntaxError;
  httpResponse: HttpResponse & { bodyText: string };
}

export interface ValidationErr {
  name: "ValidationErr";
  cause: readonly StandardSchemaV1.Issue[];
  httpResponse: HttpResponse & { bodyJSON: JsonValue };
}

export interface FetchErr {
  name: "FetchErr";
  cause: t.FetchError;
}

export interface FetchNotOkErr {
  name: "FetchNotOkErr";
  httpResponse: FetchResponse;
}

export type FetchResponse = HttpResponse & {
  text: () => m.Task<string, FetchTextErr>;
  json: () => m.Task<JsonValue, FetchTextErr | ParseJSONErr>;
};

function _fetch(
  ...args: Parameters<typeof globalThis.fetch>
): Promise<FetchResponse> {
  return globalThis.fetch(...args).then((resp) => {
    const { ok, redirected, status, statusText, type, url } = resp;
    const baseCtx = { ok, redirected, status, statusText, type, url };

    const headers: Record<string, string | string[]> = {};
    resp.headers.forEach((value, key) => {
      const existing = headers[key];
      if (existing === undefined) {
        headers[key] = value;
      } else if (typeof existing === "string") {
        headers[key] = [existing, value];
      } else existing.push(value);
    });

    const httpResponse: HttpResponse = {
      ...baseCtx,
      headers,
    };

    const text = m.task.safe(
      resp.text.bind(resp),
      (e): FetchTextErr => ({
        name: "FetchTextErr",
        cause: e as t.FetchTextError,
        httpResponse,
      }),
    );
    function json() {
      return text().andThen((str) =>
        m.task.fromResult(
          JSON.parse(str)
            .mapErr(
              (e): ParseJSONErr => ({
                name: "ParseJSONErr",
                cause: e,
                httpResponse: { ...httpResponse, bodyText: str },
              }),
            )
            .map((j) => j as JsonValue),
        ),
      );
    }

    return { ...httpResponse, text, json };
  });
}
export const fetch = m.task.safe(
  _fetch,
  (e): FetchErr => ({ name: "FetchErr", cause: e as t.FetchError }),
);

export function fetchJSON<O, I>(
  input: string | URL | globalThis.Request,
  { schema, ...init }: RequestInit & { schema: StandardSchemaV1<O, I> },
) {
  return fetch(input, init)
    .andThen((resp) => {
      if (resp.ok) {
        return m.task.resolve(resp);
      }
      const error: FetchNotOkErr = {
        name: "FetchNotOkErr",
        httpResponse: resp,
      };
      return m.task.reject(error);
    })
    .andThen(({ text: _, json, ...resp }) =>
      json().andThen((j) =>
        m.task
          .tryOrElse(
            (e) => e as never,
            async () => schema["~standard"].validate(j),
          )
          .andThen((result) => {
            if ("value" in result) {
              return m.task.resolve(result.value);
            }
            const error: ValidationErr = {
              name: "ValidationErr",
              cause: result.issues,
              httpResponse: { ...resp, bodyJSON: j },
            };
            return m.task.reject(error);
          }),
      ),
    );
}
