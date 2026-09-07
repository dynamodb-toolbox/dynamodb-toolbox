/** Free-form metadata attached to a `Table` (title, description, plus arbitrary fields). */
export interface TableMetadata {
  title?: string
  description?: string
  [x: string]: unknown
}
