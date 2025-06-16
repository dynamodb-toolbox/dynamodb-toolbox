import type { Constant, Fn } from 'hotscript'

import type {
  ITransformerDTO,
  SerializableTransformer,
  Transformer,
  TypedTransformer
} from './transformer.js'

export type TypeModifier<TRANSFORMER extends Transformer> = TRANSFORMER extends TypedTransformer
  ? TRANSFORMER['_typeModifier']
  : Constant<ReturnType<TRANSFORMER['encode']>>

export type TypeModifiers<
  TRANSFORMERS extends Transformer[],
  FNS extends Fn[] = []
> = TRANSFORMERS extends [infer TRANSFORMERS_HEAD, ...infer TRANSFORMERS_TAIL]
  ? TRANSFORMERS_HEAD extends Transformer
    ? TRANSFORMERS_TAIL extends Transformer[]
      ? TypeModifiers<TRANSFORMERS_TAIL, [...FNS, TypeModifier<TRANSFORMERS_HEAD>]>
      : never
    : never
  : FNS

export type TransformerDTO<TRANSFORMER extends SerializableTransformer> = ReturnType<
  TRANSFORMER['toJSON']
>

export type TransformerDTOs<
  TRANSFORMERS extends SerializableTransformer[],
  DTOS extends ITransformerDTO[] = []
> = TRANSFORMERS extends [infer TRANSFORMERS_HEAD, ...infer TRANSFORMERS_TAIL]
  ? TRANSFORMERS_HEAD extends SerializableTransformer
    ? TRANSFORMERS_TAIL extends SerializableTransformer[]
      ? TransformerDTOs<TRANSFORMERS_TAIL, [...DTOS, TransformerDTO<TRANSFORMERS_HEAD>]>
      : never
    : never
  : DTOS
