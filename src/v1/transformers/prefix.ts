import type { Transformer } from 'v1/schema/attributes/index.js'

type Prefixer = (prefix: string, options?: { delimiter?: string }) => Transformer<string, string>

export const prefix: Prefixer = (prefix, { delimiter = '#' } = {}) => ({
  parse: (inputValue: string) => [prefix, inputValue].join(delimiter),
  format: (savedValue: string) =>
    savedValue.startsWith([prefix, ''].join(delimiter))
      ? savedValue.slice(prefix.length + delimiter.length)
      : savedValue
})
