import type { Constant } from 'hotscript'

import type { Piped } from './pipe.js'
import { pipe } from './pipe.js'
import type { SerializableTransformer, Transformer } from './transformer.js'

interface JSONStringifierOptions {
  space?: string | number
  replacer?: (this: any, key: string, value: any) => any
  reviver?: (this: any, key: string, value: any) => any
}

/**
 * DTO describing a `JSONStringifier` transformer.
 */
export interface JSONStringifierDTO {
  transformerId: 'jsonStringify'
  space?: string | number
}

/**
 * Transformer that encodes values to JSON strings and decodes them back.
 */
export class JSONStringifier
  implements
    SerializableTransformer<unknown, unknown, string, Constant<string>, JSONStringifierDTO>
{
  // @ts-expect-error
  _typeModifier: Constant<string>
  transformerId: 'jsonStringify'
  space?: string | number
  replacer?: (this: any, key: string, value: any) => any
  reviver?: (this: any, key: string, value: any) => any

  /**
   * Create a `JSONStringifier` with optional `space`, `replacer` and `reviver`.
   */
  constructor({ space, replacer, reviver }: JSONStringifierOptions = {}) {
    this.transformerId = 'jsonStringify'
    this.space = space
    this.replacer = replacer
    this.reviver = reviver
  }

  /**
   * Encode the decoded value to a JSON string.
   */
  encode(decoded: unknown): string {
    return JSON.stringify(decoded, this.replacer, this.space)
  }

  /**
   * Parse the encoded JSON string back to a value.
   */
  decode(encoded: string): unknown {
    return JSON.parse(encoded, this.reviver)
  }

  /**
   * Serialize this transformer to its DTO.
   */
  toJSON() {
    if (this.replacer !== undefined || this.reviver !== undefined) {
      console.warn(
        'Schema DTO is probably incomplete when using `replacer` or `reviver` options in JSON Stringifier.'
      )
    }

    return {
      transformerId: this.transformerId,
      ...(this.space !== undefined ? { space: this.space } : {})
    }
  }

  /**
   * Chain this transformer with another, applied after it.
   */
  pipe<TRANSFORMER extends Transformer<string>>(
    transformer: TRANSFORMER
  ): Piped<[this, TRANSFORMER]> {
    return pipe(this, transformer)
  }
}

type JSONStringify = (options?: JSONStringifierOptions) => JSONStringifier

/**
 * Create a `JSONStringifier` transformer that serializes values as JSON.
 */
export const jsonStringify: JSONStringify = (options: JSONStringifierOptions = {}) =>
  new JSONStringifier(options)
