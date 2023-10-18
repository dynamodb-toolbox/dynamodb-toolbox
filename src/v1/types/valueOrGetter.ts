export type ValueOrGetter<VALUE, ARGS extends unknown[] = []> = VALUE | ((...ags: ARGS) => VALUE)
