import type { AnySchemaTransformerDTO, ISchemaDTO } from '~/schema/actions/dto/index.js'
import type { AnySchema } from '~/schema/any/index.js'
import { any } from '~/schema/any/index.js'
import { jsonStringify } from '~/transformers/jsonStringify.js'
import { pipe } from '~/transformers/pipe.js'
import type { Transformer } from '~/transformers/transformer.js'

type AnySchemaDTO = Extract<ISchemaDTO, { type: 'any' }>

/**
 * @debt feature "handle transforms, defaults, links & validators"
 */
export const fromAnySchemaDTO = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  transform,
  ...dto
}: AnySchemaDTO): AnySchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink
  transform

  let schema = any(dto)

  if (transform !== undefined) {
    const transformer = fromAnySchemaTransformerDTO(transform)

    if (transformer !== undefined) {
      schema = schema.transform(transformer)
    }
  }

  return schema
}

const fromAnySchemaTransformerDTO = (
  transformerDTO: AnySchemaTransformerDTO
): Transformer<unknown> | undefined => {
  try {
    switch (transformerDTO.transformerId) {
      case 'jsonStringify': {
        const { space } = transformerDTO

        return jsonStringify({ space })
      }
      case 'pipe': {
        const { transformers: _transformers } = transformerDTO

        const transformers = _transformers
          .map(transformer => fromAnySchemaTransformerDTO(transformer))
          .filter(transformer => transformer !== undefined)

        if (transformers.length === 0) {
          return undefined
        }

        return pipe(...transformers)
      }
      default:
        return undefined
    }
  } catch {
    return undefined
  }
}
