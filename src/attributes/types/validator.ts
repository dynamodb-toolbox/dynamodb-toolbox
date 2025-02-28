export type Validator<INPUT = unknown, SCHEMA = unknown> = (
  input: INPUT,
  schema: SCHEMA
) => boolean | string
