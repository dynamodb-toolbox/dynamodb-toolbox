/**
 * Optional metadata attached to a `Database`, such as a title and description.
 */
export interface DatabaseMetadata {
  title?: string
  description?: string
  [x: string]: unknown
}
