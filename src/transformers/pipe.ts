import type { ComposeLeft } from 'hotscript'

import type {
  ITransformerDTO,
  SerializableTransformer,
  Transformer,
  TypedTransformer
} from './transformer.js'
import type { TransformerDTOs, TypeModifiers } from './types.js'
import { isSerializableTransformer } from './utils.js'

type Fn = (arg: unknown) => unknown

const composeLeft =
  (left: Fn, right: Fn): Fn =>
  arg =>
    right(left(arg))

const composeRight =
  (left: Fn, right: Fn): Fn =>
  arg =>
    left(right(arg))

const identity: Fn = arg => arg

export class Pipe<TRANSFORMERS extends Transformer[] = Transformer[]>
  implements
    TypedTransformer<
      ReturnType<TRANSFORMERS[0]['decode']>,
      Parameters<TRANSFORMERS[0]['encode']>[0],
      ReturnType<LastTransformer<TRANSFORMERS>['encode']>,
      ComposeLeft<TypeModifiers<TRANSFORMERS>>
    >
{
  // @ts-expect-error
  _typeModifier: ComposeLeft<TypeModifiers<TRANSFORMERS>>

  transformerId: 'pipe'
  transformers: TRANSFORMERS

  encode: (
    decoded: Parameters<TRANSFORMERS[0]['encode']>[0]
  ) => ReturnType<LastTransformer<TRANSFORMERS>['encode']>

  decode: (
    encoded: ReturnType<LastTransformer<TRANSFORMERS>['encode']>
  ) => ReturnType<TRANSFORMERS[0]['decode']>

  constructor(transformers: TRANSFORMERS) {
    this.transformerId = 'pipe'
    this.transformers = transformers

    this.encode = this.transformers
      .map(transformer => (arg: unknown) => transformer.encode(arg))
      .reduce(composeLeft, identity)

    this.decode = this.transformers
      .map(transformer => (arg: unknown) => transformer.decode(arg))
      .reduce(composeRight, identity)
  }

  pipe<TRANSFORMER extends Transformer<ReturnType<LastTransformer<TRANSFORMERS>['encode']>>>(
    transformer: TRANSFORMER
  ): Piped<[...TRANSFORMERS, TRANSFORMER]> {
    return pipe(...this.transformers, transformer)
  }
}

export class SerializablePipe<
    TRANSFORMERS extends SerializableTransformer[] = SerializableTransformer[]
  >
  extends Pipe<TRANSFORMERS>
  implements
    SerializableTransformer<
      ReturnType<TRANSFORMERS[0]['decode']>,
      Parameters<TRANSFORMERS[0]['encode']>[0],
      ReturnType<LastTransformer<TRANSFORMERS>['encode']>,
      ComposeLeft<TypeModifiers<TRANSFORMERS>>,
      PipeDTO<TransformerDTOs<TRANSFORMERS>>
    >
{
  constructor(transformers: TRANSFORMERS) {
    super(transformers)
  }

  toJSON() {
    return {
      transformerId: this.transformerId,
      transformers: this.transformers.map(transformer => transformer.toJSON())
    } as PipeDTO<TransformerDTOs<TRANSFORMERS>>
  }
}

export interface PipeDTO<TRANSFORMER_DTOS extends ITransformerDTO[] = ITransformerDTO[]> {
  transformerId: 'pipe'
  transformers: TRANSFORMER_DTOS
}

type LastTransformer<TRANSFORMERS extends Transformer[]> = TRANSFORMERS extends [
  infer TRANSFORMERS_HEAD,
  ...infer TRANSFORMERS_TAIL
]
  ? TRANSFORMERS_HEAD extends Transformer
    ? TRANSFORMERS_TAIL extends [Transformer, ...Transformer[]]
      ? LastTransformer<TRANSFORMERS_TAIL>
      : TRANSFORMERS_HEAD
    : never
  : TRANSFORMERS[0]

export type Piped<TRANSFORMERS extends Transformer[]> =
  TRANSFORMERS extends SerializableTransformer[]
    ? SerializablePipe<TRANSFORMERS>
    : Pipe<TRANSFORMERS>

type Piper = <TRANSFORMERS extends Transformer[]>(
  ...transformers: TRANSFORMERS
) => Piped<TRANSFORMERS>

export const pipe: Piper = <TRANSFORMERS extends Transformer[]>(...transformers: TRANSFORMERS) =>
  (transformers.every(isSerializableTransformer)
    ? new SerializablePipe(transformers)
    : new Pipe(transformers)) as Piped<TRANSFORMERS>
