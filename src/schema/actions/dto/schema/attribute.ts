import { anyOf } from '~/attributes/anyOf/index.js'
import type { AnyOfAttributeElementConstraints } from '~/attributes/anyOf/types.js'
import type { ListAttributeElementConstraints } from '~/attributes/list/types.js'
import type { RecordAttributeElementConstraints } from '~/attributes/record/types.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ValidValue } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { anyAttrDTOSchema } from './any.js'
import { anyOfAttrDTOSchema } from './anyOf.js'
import { listAttrDTOSchema } from './list.js'
import { mapAttrDTOSchema } from './map.js'
import {
  binaryAttrDTOSchema,
  booleanAttrDTOSchema,
  nullAttrDTOSchema,
  numberAttrDTOSchema,
  stringAttrDTOSchema
} from './primitive.js'
import { recordAttrDTOSchema } from './record.js'
import { setAttrDTOSchema } from './set.js'

export const $attributeDTOSchema = anyOf(
  anyAttrDTOSchema,
  nullAttrDTOSchema,
  booleanAttrDTOSchema,
  numberAttrDTOSchema,
  stringAttrDTOSchema,
  binaryAttrDTOSchema,
  setAttrDTOSchema,
  listAttrDTOSchema,
  mapAttrDTOSchema,
  recordAttrDTOSchema,
  anyOfAttrDTOSchema
)

export const attributeDTOSchema = $attributeDTOSchema.freeze()
export const attributeDTOParser = new Parser(attributeDTOSchema)

export type IAttributeDTO =
  ValidValue<typeof attributeDTOSchema> extends infer TYPE
    ? TYPE extends { type: 'list' }
      ? Overwrite<TYPE, { elements: IAttributeDTO & Partial<ListAttributeElementConstraints> }>
      : TYPE extends { type: 'map' }
        ? Overwrite<TYPE, { attributes: Record<string, IAttributeDTO> }>
        : TYPE extends { type: 'record' }
          ? Overwrite<
              TYPE,
              { elements: IAttributeDTO & Partial<RecordAttributeElementConstraints> }
            >
          : TYPE extends { type: 'anyOf' }
            ? Overwrite<
                TYPE,
                { elements: (IAttributeDTO & Partial<AnyOfAttributeElementConstraints>)[] }
              >
            : TYPE
    : never

export const parseAttributeDTO = (input: unknown): IAttributeDTO =>
  attributeDTOParser.parse(input) as IAttributeDTO
