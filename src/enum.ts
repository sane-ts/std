export function Enum<Key extends string>(...keys: Key[]) {
  return keys.reduce(
    (acc, key) => ({ ...acc, [key]: key }),
    {} as { [K in Key]: K },
  );
}
