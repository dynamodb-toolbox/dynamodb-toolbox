import type { StringSchema, StringSchemaProps } from '../string/index.js'
import type { AtLeastOnce, Schema, SchemaProps } from '../types/index.js'

/**
 * Props accepted by a record schema.
 */
export interface RecordSchemaProps extends SchemaProps {
  partial?: boolean
}

interface RecordKeyAndElementProps extends SchemaProps {
  required?: AtLeastOnce
  hidden?: false
  key?: false
  savedAs?: undefined
  keyDefault?: undefined
  putDefault?: undefined
  updateDefault?: undefined
  keyLink?: undefined
  putLink?: undefined
  updateLink?: undefined
}

// TODO: Re-introduce constraint in interface (not only in typer)
/**
 * Schema allowed as a record element.
 */
export type RecordElementSchema = Schema & { props: RecordKeyAndElementProps }

// TODO: Re-introduce constraint in interface (not only in typer)
/**
 * Schema allowed as a record key.
 */
export type RecordKeySchema = StringSchema<StringSchemaProps & RecordKeyAndElementProps>
