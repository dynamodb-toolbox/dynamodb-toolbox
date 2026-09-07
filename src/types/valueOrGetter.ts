/** A `VALUE`, or a getter function returning it. */
export type ValueOrGetter<VALUE> = VALUE | (() => VALUE)
