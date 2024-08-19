import type { RecordAttribute } from '~/attributes/record/index.js'
import { RECORD_DEFAULT_OPTIONS } from '~/attributes/record/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { JSONizedAttr } from '../schema/index.js'
import { jsonizeAttribute } from './attribute.js'
import { jsonizeDefaults } from './utils.js'

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const jsonizeRecordAttribute = (attr: RecordAttribute): JSONizedAttr => {
  const jsonizedDefaults = jsonizeDefaults(attr)

  return {
    type: 'record',
    keys: jsonizeAttribute(attr.keys),
    elements: jsonizeAttribute(attr.elements),
    ...(attr.required !== RECORD_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== RECORD_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== RECORD_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(jsonizedDefaults) ? { defaults: jsonizedDefaults } : {})
    // We need to cast as `JSONizedAttr` is not assignable to record keys
  } as Extract<JSONizedAttr, { type: 'record' }>
}
