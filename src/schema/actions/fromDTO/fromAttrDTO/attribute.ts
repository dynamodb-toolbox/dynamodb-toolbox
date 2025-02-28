import type { AttrSchema } from '~/attributes/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromAnySchemaDTO } from './any.js'
import { fromAnyOfSchemaDTO } from './anyOf.js'
import { fromItemSchemaDTO } from './item.js'
import { fromListSchemaDTO } from './list.js'
import { fromMapSchemaDTO } from './map.js'
import { fromPrimitiveSchemaDTO } from './primitive.js'
import { fromRecordSchemaDTO } from './record.js'
import { fromSetSchemaDTO } from './set.js'

export const fromSchemaDTO = (schemaDTO: AttributeDTO): AttrSchema => {
  switch (schemaDTO.type) {
    case 'any':
      return fromAnySchemaDTO(schemaDTO)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return fromPrimitiveSchemaDTO(schemaDTO)
    case 'set':
      return fromSetSchemaDTO(schemaDTO)
    case 'list':
      return fromListSchemaDTO(schemaDTO)
    case 'map':
      return fromMapSchemaDTO(schemaDTO)
    case 'record':
      return fromRecordSchemaDTO(schemaDTO)
    case 'anyOf':
      return fromAnyOfSchemaDTO(schemaDTO)
    case 'item':
      return fromItemSchemaDTO(schemaDTO)
  }
}
