import type { ListAttribute } from '~/attributes/list/index.js'
import { LIST_DEFAULT_OPTIONS } from '~/attributes/list/options.js'
import type { ListAttributeElementConstraints } from '~/attributes/list/types.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { IAttributeDTO } from '../schema/index.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const getListAttrDTO = (attr: ListAttribute): IAttributeDTO => {
  const defaultsDTO = getDefaultsDTO(attr)

  return {
    type: 'list',
    elements: getAttrDTO(attr.elements) as IAttributeDTO & Partial<ListAttributeElementConstraints>,
    ...(attr.required !== LIST_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== LIST_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== LIST_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(defaultsDTO) ? { defaults: defaultsDTO } : {})
  }
}
