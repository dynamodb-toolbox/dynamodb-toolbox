import type { AtLeastOnce, Schema, SchemaProps } from '../types/index.js'

/**
 * Props accepted by a tuple schema.
 */
export interface TupleSchemaProps extends SchemaProps {
  strict?: boolean
}

interface TupleElementProps extends SchemaProps {
  required?: AtLeastOnce
  hidden?: false
  savedAs?: undefined
}

/**
 * Schema allowed as a tuple element.
 */
export type TupleElementSchema = Schema & { props: TupleElementProps }
