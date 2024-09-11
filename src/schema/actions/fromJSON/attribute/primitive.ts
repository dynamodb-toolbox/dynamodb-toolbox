import { binary } from '~/attributes/binary/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { nul } from '~/attributes/nul/index.js'
import { number } from '~/attributes/number/index.js'
import type { $PrimitiveAttributeNestedState } from '~/attributes/primitive/index.js'
import { string } from '~/attributes/string/index.js'
import type { JSONizedAttr } from '~/schema/actions/jsonize/index.js'

type JSONizedPrimitiveAttr = Extract<
  JSONizedAttr,
  { type: 'null' | 'boolean' | 'number' | 'string' | 'binary' }
>

const charCodeAt0 = (str: string): number => str.charCodeAt(0)

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONPrimitiveAttr = (
  attr: JSONizedPrimitiveAttr
): $PrimitiveAttributeNestedState => {
  switch (attr.type) {
    case 'null': {
      const { links, defaults, enum: _enum, ...props } = attr
      links
      defaults
      const $attr = nul(props)

      return _enum ? $attr.enum(..._enum) : $attr
    }
    case 'boolean': {
      const { links, defaults, enum: _enum, ...props } = attr
      links
      defaults
      const $attr = boolean(props)

      return _enum ? $attr.enum(..._enum) : $attr
    }
    case 'number': {
      const { links, defaults, enum: _enum, ...props } = attr
      links
      defaults
      const $attr = number(props)

      return _enum ? $attr.enum(..._enum) : $attr
    }
    case 'string': {
      const { links, defaults, enum: _enum, ...props } = attr
      links
      defaults
      const $attr = string(props)

      return _enum ? $attr.enum(..._enum) : $attr
    }
    case 'binary': {
      const { links, defaults, enum: _enum, ...props } = attr
      links
      defaults
      const $attr = binary(props)

      if (!_enum) {
        return $attr
      }

      return $attr.enum(
        ..._enum.map(value => new Uint8Array(atob(value).split('').map(charCodeAt0)))
      )
    }
  }
}
