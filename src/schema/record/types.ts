import type { StringSchema, StringSchemaProps } from '../string/index.js'
import type { AtLeastOnce, Schema, SchemaProps } from '../types/index.js'

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
export type RecordElementSchema = Schema & { props: RecordKeyAndElementProps }

// TODO: Re-introduce constraint in interface (not only in typer)
export type RecordKeySchema = StringSchema<StringSchemaProps & RecordKeyAndElementProps>
