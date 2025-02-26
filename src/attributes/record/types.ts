import type { AtLeastOnce } from '../constants/index.js'
import type { SchemaProps } from '../shared/props.js'
import type { StringSchema, StringSchemaProps } from '../string/index.js'
import type { AttrSchema } from '../types/index.js'

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
export type RecordElementSchema = AttrSchema & { props: RecordKeyAndElementProps }

// TODO: Re-introduce constraint in interface (not only in typer)
export type RecordKeySchema = StringSchema<StringSchemaProps & RecordKeyAndElementProps>
