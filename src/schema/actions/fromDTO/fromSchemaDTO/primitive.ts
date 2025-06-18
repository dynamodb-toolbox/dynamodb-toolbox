import type { ISchemaDTO, StringSchemaTransformerDTO } from '~/schema/actions/dto/index.js'
import { binary } from '~/schema/binary/index.js'
import { boolean } from '~/schema/boolean/index.js'
import type { PrimitiveSchema } from '~/schema/index.js'
import { nul } from '~/schema/null/index.js'
import { number } from '~/schema/number/index.js'
import { string } from '~/schema/string/index.js'
import { pipe } from '~/transformers/pipe.js'
import { prefix } from '~/transformers/prefix.js'
import { suffix } from '~/transformers/suffix.js'
import type { Transformer } from '~/transformers/transformer.js'
import { isString } from '~/utils/validation/isString.js'

import { fromTransformerDTO } from './transformer.js'

type PrimitiveSchemaDTO = Extract<
  ISchemaDTO,
  { type: 'null' | 'boolean' | 'number' | 'string' | 'binary' }
>

const charCodeAt0 = (str: string): number => str.charCodeAt(0)

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromPrimitiveSchemaDTO = (dto: PrimitiveSchemaDTO): PrimitiveSchema => {
  const { keyDefault, putDefault, updateDefault, keyLink, putLink, updateLink, ...props } = dto
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
      const schema = number(rest)

      return _enum
        ? schema.enum(..._enum.map(value => (isString(value) ? BigInt(value) : value)))
        : schema
    }
    case 'string': {
      const { enum: _enum, transform, ...rest } = props
      let schema = string(rest)

      if (transform !== undefined) {
        const transformer = fromStringSchemaTransformerDTO(transform)

        if (transformer !== null) {
          schema = schema.transform(transformer)
        }
      }

      return _enum ? schema.enum(..._enum) : schema
    }
    case 'binary': {
      const { enum: _enum, ...rest } = props
      const schema = binary(rest)

      if (!_enum) {
        return schema
      }

      return schema.enum(
        ..._enum.map(value => new Uint8Array(atob(value).split('').map(charCodeAt0)))
      )
    }
  }
}

const fromStringSchemaTransformerDTO = (
  transformerDTO: StringSchemaTransformerDTO
): Transformer<string> | null => {
  try {
    switch (transformerDTO.transformerId) {
      case 'custom':
        return null
      case 'prefix': {
        const { prefix: _prefix, delimiter } = transformerDTO
        return prefix(_prefix, { delimiter })
      }
      case 'suffix': {
        const { suffix: _suffix, delimiter } = transformerDTO
        return suffix(_suffix, { delimiter })
      }
      case 'pipe': {
        const { transformers: transformerDTOs } = transformerDTO
        const transformers: Transformer<string>[] = []

        for (const transformerDTO of transformerDTOs) {
          const transformer = fromTransformerDTO(transformerDTO)

          if (transformer === null) {
            return null
          }

          transformers.push(transformer)
        }

        return pipe(...transformers)
      }
    }
  } catch {
    return null
  }
}
