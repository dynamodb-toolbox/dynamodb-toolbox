/**
 * Given a union of possible attribute keys & filtered attribute paths, returns the possible attribute keys.
 *
 * @example MatchKey<"foo" | "bar" | "baz", ".foo.prop" | `['bar']`> => "foo" | "bar"
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

/**
 * Given a tuple of elements & filtered attribute paths, returns the possible element indexes.
 *
 * @example MatchIndexes<[unknown, unknown], "[0].foo.prop" | `[1]['bar']`> => 0 | 1
 */
export type MatchIndexes<
  ELEMENTS extends unknown[],
  PATHS extends string,
  MATCHING_INDEXES extends number = never
> = ELEMENTS extends [...infer ELEMENTS_INIT, unknown]
  ? MatchIndexes<
      ELEMENTS_INIT,
      PATHS,
      | MATCHING_INDEXES
      | (PATHS extends `[${ELEMENTS_INIT['length']}]${string}` ? ELEMENTS_INIT['length'] : never)
    >
  : MATCHING_INDEXES

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

export type ElementPaths<
  PATHS extends string,
  INDEX extends number = number
> = PATHS extends `[${INDEX}]`
  ? undefined
  : PATHS extends `[${INDEX}]${infer ELEMENT_PATHS}`
    ? ELEMENT_PATHS
    : never
