import type { AtLeastOnce, Schema, SchemaProps } from '../types/index.js'

/**
 * @debt question "Why not have defaults & links?"
 */
interface TupleElementProps extends SchemaProps {
  required?: AtLeastOnce
  hidden?: false
  savedAs?: undefined
  keyDefault?: undefined
  putDefault?: undefined
  updateDefault?: undefined
  keyLink?: undefined
  putLink?: undefined
  updateLink?: undefined
}

export type TupleElementSchema = Schema & { props: TupleElementProps }
