import type { AtLeastOnce, Schema, SchemaProps } from '../types/index.js'

interface TupleElementProps extends SchemaProps {
  required?: AtLeastOnce
  hidden?: false
  savedAs?: undefined
}

/**
 * Schema allowed as a tuple element.
 */
export type TupleElementSchema = Schema & { props: TupleElementProps }
