export type MatchKeys<
  KEYS extends string,
  KEY_PREFIX extends string,
  FILTERED_ATTRIBUTES extends string
> = string extends FILTERED_ATTRIBUTES
  ? KEYS
  : KEYS extends infer KEY
  ? KEY extends string
    ? FILTERED_ATTRIBUTES extends `${KEY_PREFIX}${KEY}${string}`
      ? KEY
      : never
    : never
  : never

export type FormattedItemOptions = { attributes: string; partial: boolean }
