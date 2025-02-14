import { binary } from '~/attributes/binary/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import type { $NumberAttribute, $PrimitiveAttributeNestedState } from '~/attributes/index.js'
import { nul } from '~/attributes/null/index.js'
import { number } from '~/attributes/number/index.js'
import type { NumberAttributeState } from '~/attributes/number/types.js'
import { string } from '~/attributes/string/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'
import { isString } from '~/utils/validation/isString.js'

type PrimitiveAttrDTO = Extract<
  AttributeDTO,
  { type: 'null' | 'boolean' | 'number' | 'string' | 'binary' }
>

const charCodeAt0 = (str: string): number => str.charCodeAt(0)

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONPrimitiveAttr = (attr: PrimitiveAttrDTO): $PrimitiveAttributeNestedState => {
  switch (attr.type) {
    case 'null': {
      const { links, defaults, ...props } = attr
      links
      defaults
      const $attr = nul(props)

      return $attr
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
      const $attr = number(props) as $NumberAttribute<NumberAttributeState>

      return _enum
        ? $attr.enum(..._enum.map(value => (isString(value) ? BigInt(value) : value)))
        : $attr
    }
    case 'string': {
      const { links, defaults, enum: _enum, transform, ...props } = attr
      links
      defaults
      transform
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
