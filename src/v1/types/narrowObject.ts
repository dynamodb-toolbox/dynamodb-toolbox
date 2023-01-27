export type NarrowObject<OPTIONS extends Record<string | number | symbol, unknown>> = {
  [KEY in keyof OPTIONS]: OPTIONS[KEY]
}
