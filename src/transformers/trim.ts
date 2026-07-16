import type { Strings } from 'hotscript'

import type { Piped } from './pipe.js'
import { pipe } from './pipe.js'
import type { SerializableTransformer, Transformer } from './transformer.js'

export interface TrimmerDTO {
  transformerId: 'trim'
}

export class Trimmer
  implements SerializableTransformer<string, string, string, Strings.Trim, TrimmerDTO>
{
  // @ts-expect-error
  _typeModifier: Strings.Trim
  transformerId: 'trim'

  constructor() {
    this.transformerId = 'trim'
  }

  encode(decoded: string): string {
    return decoded.trim()
  }

  decode(encoded: string): string {
    return encoded
  }

  toJSON() {
    return {
      transformerId: this.transformerId
    }
  }

  pipe<TRANSFORMER extends Transformer<string>>(
    transformer: TRANSFORMER
  ): Piped<[this, TRANSFORMER]> {
    return pipe(this, transformer)
  }
}

type Trim = () => Trimmer

export const trim: Trim = () => new Trimmer()
