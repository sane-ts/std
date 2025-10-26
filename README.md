# TSL (TypeScript Standard Library)

Provides type safe error handling for common JavaScript utilities.

## Usage

```ts
const data = await lib.fetch("https://google.com").andThen((res) => res.json());
// data: Result<JsonValue, lib.FetchErr | lib.FetchTextErr | lib.ParseJSONErr>
if (data.isOk) {
  console.log("Fetch successful:", data.value);
} else {
  console.error("Fetch error:", data.error);
}
```

The code above never throws. The idea is that all errors should be handled explicitly instead of thrown.

Inspired by [neverthrow](https://github.com/supermacro/neverthrow) this project is basically wrapper around native JavaScript utilities wrapped with [true-myth](https://true-myth.js.org) Result and Task.

I highly recommend checking out those libraries to handle errors explicitly.

You can also check out [Effect](https://effect.website) which is a more functional way to achieve the same goal. But it has too steep of a buy-in, which is why this library exists.
