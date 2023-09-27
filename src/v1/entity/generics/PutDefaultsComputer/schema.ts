import type { Schema } from 'v1/schema'
import type { OmitUndefinedProperties } from 'v1/types'
import type { PutItemInput } from 'v1/commands/putItem/types'

import type { AttributePutDefaultsComputer } from './attribute'

export type SchemaPutDefaultsComputer<
  SCHEMA extends Schema,
  ATTRIBUTES_PUT_DEFAULT_COMPUTERS = OmitUndefinedProperties<
    {
      [KEY in keyof SCHEMA['attributes']]: AttributePutDefaultsComputer<
        SCHEMA['attributes'][KEY],
        [PutItemInput<SCHEMA, 'independent'>]
      >
    }
  >
> = keyof ATTRIBUTES_PUT_DEFAULT_COMPUTERS extends never
  ? undefined
  : { [KEY in keyof ATTRIBUTES_PUT_DEFAULT_COMPUTERS]: ATTRIBUTES_PUT_DEFAULT_COMPUTERS[KEY] }
