import type { TransformerDTO } from '~/schema/actions/dto/types.js'
import { jsonStringify } from '~/transformers/jsonStringify.js'
import { pipe } from '~/transformers/pipe.js'
import { prefix } from '~/transformers/prefix.js'
import { suffix } from '~/transformers/suffix.js'
import type { Transformer } from '~/transformers/transformer.js'

export const fromTransformerDTO = (transformerDTO: TransformerDTO): Transformer | null => {
  try {
    switch (transformerDTO.transformerId) {
      case 'custom':
        return null
      case 'jsonStringify': {
        const { space } = transformerDTO

        return jsonStringify({ space })
      }
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
