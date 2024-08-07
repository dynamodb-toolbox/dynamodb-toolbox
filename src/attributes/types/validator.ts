export type Validator<INPUT = unknown, ATTRIBUTE = unknown> = (
  input: INPUT,
  attribute: ATTRIBUTE
) => boolean | string
