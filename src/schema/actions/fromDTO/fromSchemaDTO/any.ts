import type { AnySchemaTransformerDTO, ISchemaDTO } from '~/schema/actions/dto/index.js'
import type { AnySchema } from '~/schema/any/index.js'
import { any } from '~/schema/any/index.js'
import { jsonStringify } from '~/transformers/jsonStringify.js'
import { pipe } from '~/transformers/pipe.js'
import type { Transformer } from '~/transformers/transformer.js'

import { fromTransformerDTO } from './transformer.js'

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

    if (transformer !== null) {
      schema = schema.transform(transformer)
    }
  }

  return schema
}

const fromAnySchemaTransformerDTO = (
  transformerDTO: AnySchemaTransformerDTO
): Transformer<unknown> | null => {
  try {
    switch (transformerDTO.transformerId) {
      case 'custom':
        return null
      case 'jsonStringify': {
        const { space } = transformerDTO

        return jsonStringify({ space })
      }
      case 'pipe': {
        const { transformers: transformerDTOs } = transformerDTO
        const transformers: Transformer[] = []

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
