export type ComputeObject<OBJECT extends object> = {
  [KEY in keyof OBJECT]: OBJECT[KEY]
} & unknown
