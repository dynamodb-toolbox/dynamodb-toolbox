import { $transformerId } from '~/attributes/primitive/constants.js'
import type { JSONizableTransformer } from '~/attributes/primitive/types.js'

class Prefixer
  implements
    JSONizableTransformer<
      { transformerId: 'prefix'; prefix: string; delimiter: string },
      string,
      string
    >
{
  [$transformerId]: 'prefix'
  prefix: string
  delimiter: string

  constructor(prefix: string, { delimiter = '#' }: { delimiter?: string } = {}) {
    this[$transformerId] = 'prefix'
    this.prefix = prefix
    this.delimiter = delimiter
  }

  parse(inputValue: string): string {
    return [this.prefix, inputValue].join(this.delimiter)
  }

  format(savedValue: string): string {
    return savedValue.startsWith([this.prefix, ''].join(this.delimiter))
      ? savedValue.slice(this.prefix.length + this.delimiter.length)
      : savedValue
  }

  jsonize() {
    return {
      transformerId: this[$transformerId],
      prefix: this.prefix,
      delimiter: this.delimiter
    }
  }
}

export const prefix = (...args: ConstructorParameters<typeof Prefixer>) => new Prefixer(...args)
