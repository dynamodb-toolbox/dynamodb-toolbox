import type { Constant } from 'hotscript'

import type { SerializableTransformer } from './transformer.js'

interface JSONStringifierOptions {
  space?: string | number
  replacer?: (this: any, key: string, value: any) => any
  reviver?: (this: any, key: string, value: any) => any
}

export class JSONStringifier
  implements
    SerializableTransformer<
      unknown,
      unknown,
      string,
      Constant<string>,
      { transformerId: 'jsonStringify'; space?: string | number }
    >
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

  parse(formatted: unknown): string {
    return JSON.stringify(formatted, this.replacer, this.space)
  }

  format(transformed: string): unknown {
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
}

type JSONStringify = (options?: JSONStringifierOptions) => JSONStringifier

export const jsonStringify: JSONStringify = (options: JSONStringifierOptions = {}) =>
  new JSONStringifier(options)
