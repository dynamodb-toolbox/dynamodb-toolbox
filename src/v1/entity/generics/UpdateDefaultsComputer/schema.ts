import type { Schema } from 'v1/schema'
import type { OmitUndefinedProperties } from 'v1/types'
import type { UpdateItemInput } from 'v1/commands/updateItem/types'
import type { SchemaAttributePath } from 'v1/commands/types/paths'

import type { AttributeUpdateDefaultsComputer } from './attribute'

export type SchemaUpdateDefaultsComputer<
  SCHEMA extends Schema,
  ATTRIBUTES_UPDATE_DEFAULT_COMPUTERS = OmitUndefinedProperties<
    {
      [KEY in keyof SCHEMA['attributes']]: AttributeUpdateDefaultsComputer<
        SCHEMA['attributes'][KEY],
        [UpdateItemInput<SCHEMA>],
        SchemaAttributePath<SCHEMA>
      >
    }
  >
> = keyof ATTRIBUTES_UPDATE_DEFAULT_COMPUTERS extends never
  ? undefined
  : { [KEY in keyof ATTRIBUTES_UPDATE_DEFAULT_COMPUTERS]: ATTRIBUTES_UPDATE_DEFAULT_COMPUTERS[KEY] }
