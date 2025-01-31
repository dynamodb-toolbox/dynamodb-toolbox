import type { Strings } from 'hotscript'

import type { SerializableTransformer } from './transformer.js'

interface PrefixerOptions<DELIMITER extends string> {
  delimiter?: DELIMITER
}

export class Prefixer<PREFIX extends string, DELIMITER extends string = '#'>
  implements
    SerializableTransformer<
      string,
      string,
      string,
      Strings.Prepend<`${PREFIX}${DELIMITER}`>,
      { transformerId: 'prefix'; prefix: PREFIX; delimiter: DELIMITER }
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

  parse(formatted: string): string {
    return [this.prefix, formatted].join(this.delimiter)
  }

  format(transformed: string): string {
    return transformed.startsWith([this.prefix, ''].join(this.delimiter))
      ? transformed.slice(this.prefix.length + this.delimiter.length)
      : transformed
  }

  toJSON() {
    return {
      transformerId: this.transformerId,
      prefix: this.prefix,
      delimiter: this.delimiter
    }
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
