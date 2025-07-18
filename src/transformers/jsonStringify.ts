import type { Constant } from 'hotscript'

import type { Piped } from './pipe.js'
import { pipe } from './pipe.js'
import type { SerializableTransformer, Transformer } from './transformer.js'

interface JSONStringifierOptions {
  space?: string | number
  replacer?: (this: any, key: string, value: any) => any
  reviver?: (this: any, key: string, value: any) => any
}

export interface JSONStringifierDTO {
  transformerId: 'jsonStringify'
  space?: string | number
}

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

  constructor({ space, replacer, reviver }: JSONStringifierOptions = {}) {
    this.transformerId = 'jsonStringify'
    this.space = space
    this.replacer = replacer
    this.reviver = reviver
  }

  encode(formatted: unknown): string {
    return JSON.stringify(formatted, this.replacer, this.space)
  }

  decode(transformed: string): unknown {
    return JSON.parse(transformed, this.reviver)
  }

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

  pipe<TRANSFORMER extends Transformer<string>>(
    transformer: TRANSFORMER
  ): Piped<[this, TRANSFORMER]> {
    return pipe(this, transformer)
  }
}

type JSONStringify = (options?: JSONStringifierOptions) => JSONStringifier

export const jsonStringify: JSONStringify = (options: JSONStringifierOptions = {}) =>
  new JSONStringifier(options)
