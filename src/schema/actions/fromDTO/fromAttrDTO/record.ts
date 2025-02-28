import type { RecordSchema } from '~/attributes/record/index.js'
import { record } from '~/attributes/record/index.js'
import type { RecordElementSchema, RecordKeySchema } from '~/attributes/record/types.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromSchemaDTO } from './attribute.js'

type RecordAttrDTO = Extract<AttributeDTO, { type: 'record' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromRecordSchemaDTO = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  keys,
  elements,
  ...props
}: RecordAttrDTO): RecordSchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return record(
    fromSchemaDTO(keys) as RecordKeySchema,
    fromSchemaDTO(elements) as RecordElementSchema,
    props
  )
}
