import type { Strings } from 'hotscript'

import type { Piped } from './pipe.js'
import { pipe } from './pipe.js'
import type { SerializableTransformer, Transformer } from './transformer.js'

interface PrefixerOptions<DELIMITER extends string> {
  delimiter?: DELIMITER
}

/**
 * DTO describing a `Prefixer` transformer.
 */
export interface PrefixerDTO {
  transformerId: 'prefix'
  prefix: string
  delimiter: string
}

/**
 * Transformer that prepends a prefix (joined by a delimiter) to a string value.
 */
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

  /**
   * Create a `Prefixer` for the given prefix and optional delimiter (defaults to `#`).
   */
  constructor(prefix: PREFIX, { delimiter = '#' as DELIMITER }: PrefixerOptions<DELIMITER> = {}) {
    this.transformerId = 'prefix'
    this.prefix = prefix
    this.delimiter = delimiter
  }

  /**
   * Prepend the prefix and delimiter to the decoded string.
   */
  encode(decoded: string): string {
    return [this.prefix, decoded].join(this.delimiter)
  }

  /**
   * Strip the prefix and delimiter from an encoded string if present.
   */
  decode(encoded: string): string {
    return encoded.startsWith(`${this.prefix}${this.delimiter}`)
      ? encoded.slice(this.prefix.length + this.delimiter.length)
      : encoded
  }

  /**
   * Serialize this transformer to its DTO.
   */
  toJSON() {
    return {
      transformerId: this.transformerId,
      prefix: this.prefix,
      delimiter: this.delimiter
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

type Prefix = <PREFIX extends string, DELIMITER extends string = '#'>(
  prefix: PREFIX,
  options?: PrefixerOptions<DELIMITER>
) => Prefixer<PREFIX, DELIMITER>

/**
 * Create a `Prefixer` transformer that prepends a prefix to a string.
 */
export const prefix: Prefix = <PREFIX extends string, DELIMITER extends string = '#'>(
  prefix: PREFIX,
  { delimiter = '#' as DELIMITER }: PrefixerOptions<DELIMITER> = {}
) => new Prefixer<PREFIX, DELIMITER>(prefix, { delimiter })
