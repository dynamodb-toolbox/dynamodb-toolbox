import type { AtLeastOnce, Schema, SchemaProps } from '../types/index.js'

interface TupleElementProps extends SchemaProps {
  required?: AtLeastOnce
  hidden?: false
  savedAs?: undefined
}

export type TupleElementSchema = Schema & { props: TupleElementProps }
