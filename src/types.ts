/** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError */
export interface TypeError extends Error {
  name: "TypeError";
}

export interface SyntaxError extends Error {
  name: "SyntaxError";
}

/** https://developer.mozilla.org/en-US/docs/Web/API/DOMException#aborterror */
export type AbortError = DOMException & {
  name: "AbortError";
};

/** https://developer.mozilla.org/en-US/docs/Web/API/DOMException#notallowederror */
export type NotAllowedError = DOMException & {
  name: "NotAllowedError";
};

/** https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#exceptions */
export type FetchError = TypeError | AbortError | NotAllowedError;

/** https://developer.mozilla.org/en-US/docs/Web/API/Response/text#exceptions */
export type FetchTextError = AbortError | TypeError;

/** https://developer.mozilla.org/en-US/docs/Web/API/Response/json#exceptions */
export type FetchJSONError = AbortError | TypeError | SyntaxError;
