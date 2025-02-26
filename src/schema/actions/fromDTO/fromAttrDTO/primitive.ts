import { binary } from '~/attributes/binary/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import type { PrimitiveSchema } from '~/attributes/index.js'
import { nul } from '~/attributes/null/index.js'
import { number } from '~/attributes/number/index.js'
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
export const fromJSONPrimitiveAttr = (attr: PrimitiveAttrDTO): PrimitiveSchema => {
  const { keyDefault, putDefault, updateDefault, keyLink, putLink, updateLink, ...props } = attr
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  switch (props.type) {
    case 'null': {
      return nul(props)
    }
    case 'boolean': {
      return boolean(props)
    }
    case 'number': {
      const { enum: _enum, ...rest } = props
      const $attr = number(rest)

      return _enum
        ? $attr.enum(..._enum.map(value => (isString(value) ? BigInt(value) : value)))
        : $attr
    }
    case 'string': {
      const { enum: _enum, transform, ...rest } = props
      transform
      const $attr = string(rest)

      return _enum ? $attr.enum(..._enum) : $attr
    }
    case 'binary': {
      const { enum: _enum, ...rest } = props
      const $attr = binary(rest)

      if (!_enum) {
        return $attr
      }

      return $attr.enum(
        ..._enum.map(value => new Uint8Array(atob(value).split('').map(charCodeAt0)))
      )
    }
  }
}
