import type { RecordAttribute } from '~/attributes/record/index.js'
import { RECORD_DEFAULT_OPTIONS } from '~/attributes/record/options.js'

import type { JSONizedAttr } from '../schemas/index.js'
import { jsonizeAttribute } from './attribute.js'

export const jsonizeRecordAttribute = (attr: RecordAttribute): JSONizedAttr =>
  ({
    type: 'record',
    ...(attr.required !== RECORD_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== RECORD_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== RECORD_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    keys: jsonizeAttribute(attr.keys),
    elements: jsonizeAttribute(attr.elements)
    // We need to cast as `JSONizedAttr` is not assignable to record keys
  }) as Extract<JSONizedAttr, { type: 'record' }>
