/**
 * Options driving how a Zod parser is built.
 */
export interface ZodParserOptions {
  transform?: boolean
  defined?: boolean
  fill?: boolean
  mode?: 'put' | 'key'
}
