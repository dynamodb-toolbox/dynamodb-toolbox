export class ExpressionId {
  i = 1

  ids: Record<string, string> = {}

  constructor(private prefix = 'attr') {}

  get(key: string) {
    const isValueOrName = key[0] === ':' || key[0] === '#'
    const id = isValueOrName ? key.substring(1) : key
    const prefix = isValueOrName ? key[0] : ''

    if (!this.ids[id]) {
      this.ids[id] = (this.i++).toString()
    }

    return `${prefix}${this.prefix}${this.ids[id]}`
  }
}
