import type { Fn } from 'hotscript'

export interface Transformer<
  DECODED_CONSTRAINT = any,
  DECODED extends DECODED_CONSTRAINT = DECODED_CONSTRAINT,
  ENCODED = any
> {
  encode: (decoded: DECODED) => ENCODED
  decode: (encoded: ENCODED) => DECODED_CONSTRAINT
}

export interface TypedTransformer<
  DECODED_CONSTRAINT = any,
  DECODED extends DECODED_CONSTRAINT = DECODED_CONSTRAINT,
  ENCODED = any,
  TYPE_MODIFIER extends Fn = Fn
> extends Transformer<DECODED_CONSTRAINT, DECODED, ENCODED> {
  _typeModifier: TYPE_MODIFIER
}

export type ITransformerDTO = { transformerId: string } & object

export interface SerializableTransformer<
  DECODED_CONSTRAINT = any,
  DECODED extends DECODED_CONSTRAINT = DECODED_CONSTRAINT,
  ENCODED = any,
  TYPE_MODIFIER extends Fn = Fn,
  DTO extends ITransformerDTO = ITransformerDTO
> extends TypedTransformer<DECODED_CONSTRAINT, DECODED, ENCODED, TYPE_MODIFIER> {
  transformerId: DTO['transformerId']
  toJSON: () => DTO
}
