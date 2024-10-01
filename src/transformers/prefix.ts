import type { Strings } from 'hotscript'

import { $transformerId, $typeModifier } from '~/attributes/primitive/constants.js'
import type { JSONizableTransformer } from '~/attributes/primitive/types.js'

interface PrefixerOptions<DELIMITER extends string> {
  delimiter?: DELIMITER
}

class Prefixer<PREFIX extends string, DELIMITER extends string = '#'>
  implements
    JSONizableTransformer<
      string,
      string,
      string,
      Strings.Prepend<`${PREFIX}${DELIMITER}`>,
      { transformerId: 'prefix'; prefix: PREFIX; delimiter: DELIMITER }
    >
{
  // @ts-expect-error
  [$typeModifier]: Strings.Prepend<`${PREFIX}${DELIMITER}`>;
  [$transformerId]: 'prefix'
  prefix: PREFIX
  delimiter: DELIMITER

  constructor(prefix: PREFIX, { delimiter = '#' as DELIMITER }: PrefixerOptions<DELIMITER> = {}) {
    this[$transformerId] = 'prefix'
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

  jsonize() {
    return {
      transformerId: this[$transformerId],
      prefix: this.prefix,
      delimiter: this.delimiter
    }
  }
}

export const prefix = <PREFIX extends string, DELIMITER extends string = '#'>(
  prefix: PREFIX,
  { delimiter = '#' as DELIMITER }: PrefixerOptions<DELIMITER> = {}
) => new Prefixer<PREFIX, DELIMITER>(prefix, { delimiter })
