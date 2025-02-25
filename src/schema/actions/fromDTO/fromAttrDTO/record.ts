import type { $RecordAttributeNestedState } from '~/attributes/record/index.js'
import { record } from '~/attributes/record/index.js'
import type { $RecordAttributeElements, $RecordAttributeKeys } from '~/attributes/record/types.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromAttrDTO } from './attribute.js'

type RecordAttrDTO = Extract<AttributeDTO, { type: 'record' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONRecordAttr = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  keys,
  elements,
  ...props
}: RecordAttrDTO): $RecordAttributeNestedState => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return record(
    fromAttrDTO(keys) as $RecordAttributeKeys,
    fromAttrDTO(elements) as $RecordAttributeElements,
    props
  )
}
