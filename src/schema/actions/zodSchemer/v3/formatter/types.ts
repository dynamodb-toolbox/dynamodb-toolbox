/**
 * Options driving how a Zod formatter is built.
 */
export interface ZodFormatterOptions {
  transform?: boolean
  format?: boolean
  partial?: boolean
  defined?: boolean
}
