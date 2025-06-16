import type { Strings } from 'hotscript'

import type { Piped } from './pipe.js'
import { pipe } from './pipe.js'
import type { SerializableTransformer, Transformer } from './transformer.js'

interface PrefixerOptions<DELIMITER extends string> {
  delimiter?: DELIMITER
}

export interface PrefixerDTO {
  transformerId: 'prefix'
  prefix: string
  delimiter: string
}

export class Prefixer<PREFIX extends string, DELIMITER extends string = '#'>
  implements
    SerializableTransformer<
      string,
      string,
      string,
      Strings.Prepend<`${PREFIX}${DELIMITER}`>,
      PrefixerDTO
    >
{
  // @ts-expect-error
  _typeModifier: Strings.Prepend<`${PREFIX}${DELIMITER}`>
  transformerId: 'prefix'
  prefix: PREFIX
  delimiter: DELIMITER

  constructor(prefix: PREFIX, { delimiter = '#' as DELIMITER }: PrefixerOptions<DELIMITER> = {}) {
    this.transformerId = 'prefix'
    this.prefix = prefix
    this.delimiter = delimiter
  }

  encode(decoded: string): string {
    return [this.prefix, decoded].join(this.delimiter)
  }

  decode(encoded: string): string {
    return encoded.startsWith(`${this.prefix}${this.delimiter}`)
      ? encoded.slice(this.prefix.length + this.delimiter.length)
      : encoded
  }

  toJSON() {
    return {
      transformerId: this.transformerId,
      prefix: this.prefix,
      delimiter: this.delimiter
    }
  }

  pipe<TRANSFORMER extends Transformer<string>>(
    transformer: TRANSFORMER
  ): Piped<[this, TRANSFORMER]> {
    return pipe(this, transformer)
  }
}

type Prefix = <PREFIX extends string, DELIMITER extends string = '#'>(
  prefix: PREFIX,
  options?: PrefixerOptions<DELIMITER>
) => Prefixer<PREFIX, DELIMITER>

export const prefix: Prefix = <PREFIX extends string, DELIMITER extends string = '#'>(
  prefix: PREFIX,
  { delimiter = '#' as DELIMITER }: PrefixerOptions<DELIMITER> = {}
) => new Prefixer<PREFIX, DELIMITER>(prefix, { delimiter })
