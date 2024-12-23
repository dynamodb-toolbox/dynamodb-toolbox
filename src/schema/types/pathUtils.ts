/**
 * Given a list of possible attribute keys & filtered attribute paths, returns the possible attribute keys.
 *
 * @example MatchKey<"foo" | "bar" | "baz", "foo.prop" | `['bar']`> => "foo" | "bar"
 */
export type MatchKeys<
  KEYS extends string,
  PATHS extends string,
  KEY_PREFIX extends string = '.'
> = KEYS extends infer KEY
  ? KEY extends string
    ? PATHS extends `['${KEY}']${string}` | `${KEY_PREFIX}${KEY}${string}`
      ? KEY
      : never
    : never
  : never

export type ChildPaths<
  KEY extends string,
  PATHS extends string,
  KEY_PREFIX extends string = '.'
> = `${KEY_PREFIX}${KEY}` extends PATHS
  ? undefined
  : `['${KEY}']` extends PATHS
    ? undefined
    : PATHS extends `['${KEY}']${infer CHILD_PATHS}` | `${KEY_PREFIX}${KEY}${infer CHILD_PATHS}`
      ? CHILD_PATHS
      : never
