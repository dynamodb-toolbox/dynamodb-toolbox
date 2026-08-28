import type { Validator } from './validator.js'

/**
 * Tag for optional values
 */
export type Never = 'never'

/**
 * Tag for required at least once values
 */
export type AtLeastOnce = 'atLeastOnce'

/**
 * Tag for always required values
 */
export type Always = 'always'

/**
 * Available values for schema `required` properties
 */
export type SchemaRequiredProp = Never | AtLeastOnce | Always

/**
 * Optional documentation attached to a schema (title, description, examples etc.).
 */
export interface SchemaMeta {
  title?: string
  description?: string
  examples?: unknown[]
  [key: string]: unknown
}

/**
 * Common props shared by every schema.
 */
export interface SchemaProps {
  required?: SchemaRequiredProp
  hidden?: boolean
  key?: boolean
  savedAs?: string
  meta?: SchemaMeta
  keyDefault?: unknown
  putDefault?: unknown
  updateDefault?: unknown
  keyLink?: unknown
  putLink?: unknown
  updateLink?: unknown
  keyValidator?: Validator
  putValidator?: Validator
  updateValidator?: Validator
}
