import type { Strings } from 'hotscript'

import type { Piped } from './pipe.js'
import { pipe } from './pipe.js'
import type { SerializableTransformer, Transformer } from './transformer.js'

/**
 * DTO describing a `Trimmer` transformer.
 */
export interface TrimmerDTO {
  transformerId: 'trim'
}

/**
 * Transformer that trims leading and trailing whitespace when encoding a string.
 */
export class Trimmer
  implements SerializableTransformer<string, string, string, Strings.Trim, TrimmerDTO>
{
  // @ts-expect-error
  _typeModifier: Strings.Trim
  transformerId: 'trim'

  constructor() {
    this.transformerId = 'trim'
  }

  /**
   * Trim whitespace from both ends of the decoded string.
   */
  encode(decoded: string): string {
    return decoded.trim()
  }

  /**
   * Return the encoded string unchanged (trimming is not reversible).
   */
  decode(encoded: string): string {
    return encoded
  }

  /**
   * Serialize this transformer to its DTO.
   */
  toJSON() {
    return {
      transformerId: this.transformerId
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

type Trim = () => Trimmer

/**
 * Create a `Trimmer` transformer that trims whitespace from strings.
 */
export const trim: Trim = () => new Trimmer()
