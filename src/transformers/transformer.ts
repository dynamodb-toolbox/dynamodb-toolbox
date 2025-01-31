import type { Constant, Fn, Identity } from 'hotscript'

export interface Transformer<
  FORMATTED_CONSTRAINT = any,
  FORMATTED extends FORMATTED_CONSTRAINT = FORMATTED_CONSTRAINT,
  TRANSFORMED = any
> {
  parse: (formatted: FORMATTED) => TRANSFORMED
  format: (transformed: TRANSFORMED) => FORMATTED_CONSTRAINT
}

export interface TypedTransformer<
  FORMATTED_CONSTRAINT = any,
  FORMATTED extends FORMATTED_CONSTRAINT = FORMATTED_CONSTRAINT,
  TRANSFORMED = any,
  TYPE_MODIFIER extends Fn = Identity
> extends Transformer<FORMATTED_CONSTRAINT, FORMATTED, TRANSFORMED> {
  _typeModifier: TYPE_MODIFIER
}

export type TypeModifier<TRANSFORMER extends Transformer> = TRANSFORMER extends TypedTransformer
  ? TRANSFORMER['_typeModifier']
  : Constant<ReturnType<TRANSFORMER['parse']>>

export interface SerializableTransformer<
  FORMATTED_CONSTRAINT = any,
  FORMATTED extends FORMATTED_CONSTRAINT = FORMATTED_CONSTRAINT,
  TRANSFORMED = any,
  TYPE_MODIFIER extends Fn = Fn,
  DTO extends { transformerId: string } & object = { transformerId: string } & object
> extends TypedTransformer<FORMATTED_CONSTRAINT, FORMATTED, TRANSFORMED, TYPE_MODIFIER> {
  transformerId: DTO['transformerId']
  toJSON: () => DTO
}
