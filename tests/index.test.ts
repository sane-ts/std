import { expect, test } from 'vitest'
import { lib } from '../src'

test('JSON', () => {
  const jsonString = '{"key":"value"}'
  const parsed = lib.JSON.parse(jsonString)
  expect(parsed.isOk).toBe(true)
  if (parsed.isOk) {
    expect(parsed.value).toEqual({ key: 'value' })
  }

  const stringified = lib.JSON.stringify({ key: 'value' })
  expect(stringified.isOk).toBe(true)
  if (stringified.isOk) {
    expect(stringified.value).toBe(jsonString)
  }
})
