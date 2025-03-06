import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import { binary } from '~/schema/binary/index.js'
import { boolean } from '~/schema/boolean/index.js'
import type { PrimitiveSchema } from '~/schema/index.js'
import { nul } from '~/schema/null/index.js'
import { number } from '~/schema/number/index.js'
import { string } from '~/schema/string/index.js'
import { isString } from '~/utils/validation/isString.js'

type PrimitiveSchemaDTO = Extract<
  ISchemaDTO,
  { type: 'null' | 'boolean' | 'number' | 'string' | 'binary' }
>

const charCodeAt0 = (str: string): number => str.charCodeAt(0)

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromPrimitiveSchemaDTO = (schema: PrimitiveSchemaDTO): PrimitiveSchema => {
  const { keyDefault, putDefault, updateDefault, keyLink, putLink, updateLink, ...props } = schema
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
