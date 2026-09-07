/** Force TypeScript to eagerly resolve an object type into a flat, readable shape. */
export type ComputeObject<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY]
} & unknown
