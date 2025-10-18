import * as m from "true-myth";

import type * as t from "./types.ts";

export const JSON = {
  parse: m.result.safe(globalThis.JSON.parse, (e) => e as t.SyntaxError),
  stringify: m.result.safe(globalThis.JSON.stringify, (e) => e as t.TypeError),
};
