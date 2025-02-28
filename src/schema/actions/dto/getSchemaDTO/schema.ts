import type { Schema } from '~/schema/index.js'

import type { ISchemaDTO } from '../types.js'
import { getAnySchemaDTO } from './any.js'
import { getAnyOfSchemaDTO } from './anyOf.js'
import { getItemSchemaDTO } from './item.js'
import { getListSchemaDTO } from './list.js'
import { getMapSchemaDTO } from './map.js'
import { getPrimitiveSchemaDTO } from './primitive.js'
import { getRecordSchemaDTO } from './record.js'
import { getSetSchemaDTO } from './set.js'

export const getSchemaDTO = (schema: Schema): ISchemaDTO => {
  /**
   * @debt feature "handle defaults, links & validators"
   */
  switch (schema.type) {
    case 'any':
      return getAnySchemaDTO(schema)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return getPrimitiveSchemaDTO(schema)
    case 'set':
      return getSetSchemaDTO(schema)
    case 'list':
      return getListSchemaDTO(schema)
    case 'map':
      return getMapSchemaDTO(schema)
    case 'record':
      return getRecordSchemaDTO(schema)
    case 'anyOf':
      return getAnyOfSchemaDTO(schema)
    case 'item':
      return getItemSchemaDTO(schema)
  }
}
