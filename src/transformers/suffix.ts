import type { Strings } from 'hotscript'

import type { Piped } from './pipe.js'
import { pipe } from './pipe.js'
import type { SerializableTransformer, Transformer } from './transformer.js'

interface SuffixerOptions<DELIMITER extends string> {
  delimiter?: DELIMITER
}

/**
 * DTO describing a `Suffixer` transformer.
 */
export interface SuffixerDTO {
  transformerId: 'suffix'
  suffix: string
  delimiter: string
}

/**
 * Transformer that appends a suffix (joined by a delimiter) to a string value.
 */
export class Suffixer<SUFFIX extends string, DELIMITER extends string = '#'>
  implements
    SerializableTransformer<
      string,
      string,
      string,
      Strings.Append<`${DELIMITER}${SUFFIX}`>,
      SuffixerDTO
    >
{
  // @ts-expect-error
  _typeModifier: Strings.Append<`${DELIMITER}${SUFFIX}`>
  transformerId: 'suffix'
  suffix: SUFFIX
  delimiter: DELIMITER

  /**
   * Create a `Suffixer` for the given suffix and optional delimiter (defaults to `#`).
   */
  constructor(suffix: SUFFIX, { delimiter = '#' as DELIMITER }: SuffixerOptions<DELIMITER> = {}) {
    this.transformerId = 'suffix'
    this.suffix = suffix
    this.delimiter = delimiter
  }

  /**
   * Append the delimiter and suffix to the decoded string.
   */
  encode(decoded: string): string {
    return [decoded, this.suffix].join(this.delimiter)
  }

  /**
   * Strip the delimiter and suffix from an encoded string if present.
   */
  decode(encoded: string): string {
    return encoded.endsWith(`${this.delimiter}${this.suffix}`)
      ? encoded.slice(0, encoded.length - this.delimiter.length - this.suffix.length)
      : encoded
  }

  /**
   * Serialize this transformer to its DTO.
   */
  toJSON() {
    return {
      transformerId: this.transformerId,
      suffix: this.suffix,
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

type Suffix = <SUFFIX extends string, DELIMITER extends string = '#'>(
  suffix: SUFFIX,
  options?: SuffixerOptions<DELIMITER>
) => Suffixer<SUFFIX, DELIMITER>

/**
 * Create a `Suffixer` transformer that appends a suffix to a string.
 */
export const suffix: Suffix = <SUFFIX extends string, DELIMITER extends string = '#'>(
  suffix: SUFFIX,
  { delimiter = '#' as DELIMITER }: SuffixerOptions<DELIMITER> = {}
) => new Suffixer<SUFFIX, DELIMITER>(suffix, { delimiter })
