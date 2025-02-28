import type { AtLeastOnce, Schema, SchemaProps } from '../types/index.js'

interface ListElementProps extends SchemaProps {
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

// TODO: Re-introduce constraint in interface (not only in typer)
export type ListElementSchema = Schema & { props: ListElementProps }
