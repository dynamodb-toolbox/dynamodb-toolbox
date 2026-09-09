/** Free-form metadata attached to an `Entity` (`title`, `description` and custom fields). */
export interface EntityMetadata {
  title?: string
  description?: string
  [x: string]: unknown
}
