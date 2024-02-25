export type FormatOptions<PATHS extends string = string> = {
  attributes?: PATHS[]
  partial?: boolean
}

export type FormattedValueOptions<PATHS extends string = string> = {
  attributes?: PATHS
  partial?: boolean
}

export type UnpackFormatOptions<
  OPTIONS extends FormatOptions
> = (OPTIONS['attributes'] extends string[] ? { attributes: OPTIONS['attributes'][number] } : {}) &
  (OPTIONS['partial'] extends boolean ? { partial: OPTIONS['partial'] } : {})

export type MatchKeys<
  KEYS extends string,
  KEY_PREFIX extends string,
  FILTERED_ATTRIBUTES extends string | undefined
> = FILTERED_ATTRIBUTES extends string
  ? KEYS extends infer KEY
    ? KEY extends string
      ? FILTERED_ATTRIBUTES extends `${KEY_PREFIX}${KEY}${string}`
        ? KEY
        : never
      : never
    : never
  : KEYS
