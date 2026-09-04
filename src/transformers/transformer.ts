import type { Fn } from 'hotscript'

/**
 * Reversible codec that encodes a decoded value toward DynamoDB and decodes it back.
 */
export interface Transformer<
  DECODED_CONSTRAINT = any,
  DECODED extends DECODED_CONSTRAINT = DECODED_CONSTRAINT,
  ENCODED = any
> {
  encode: (decoded: DECODED) => ENCODED
  decode: (encoded: ENCODED) => DECODED_CONSTRAINT
}

/**
 * `Transformer` that also carries a type-level modifier describing its encoding.
 */
export interface TypedTransformer<
  DECODED_CONSTRAINT = any,
  DECODED extends DECODED_CONSTRAINT = DECODED_CONSTRAINT,
  ENCODED = any,
  TYPE_MODIFIER extends Fn = Fn
> extends Transformer<DECODED_CONSTRAINT, DECODED, ENCODED> {
  _typeModifier: TYPE_MODIFIER
}

/**
 * Base shape of a transformer DTO, identified by its `transformerId`.
 */
export type ITransformerDTO = { transformerId: string } & object

/**
 * `TypedTransformer` that can be serialized to and from a DTO.
 */
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
