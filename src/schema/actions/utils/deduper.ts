const JSONSerializer = (value: unknown) =>
  JSON.stringify(value, (_, val) => (typeof val === 'bigint' ? val.toString() : val))

/**
 * Collect values while dropping duplicates, using a serializer for equality.
 */
export class Deduper<VALUE = unknown> {
  values: VALUE[]
  serializedValues: Set<string>
  serializer: (value: VALUE) => string

  /**
   * Instantiate the deduper, optionally with a custom serializer.
   */
  constructor({ serializer = JSONSerializer }: { serializer?: (val: VALUE) => string } = {}) {
    this.values = []
    this.serializedValues = new Set()
    this.serializer = serializer
  }

  /**
   * Add a value, ignoring it if an equal one is already present.
   */
  push(value: VALUE): boolean {
    const serializedValue = this.serializer(value)

    const hit = this.serializedValues.has(serializedValue)

    if (!hit) {
      this.values.push(value)
      this.serializedValues.add(serializedValue)
    }

    return hit
  }
}
