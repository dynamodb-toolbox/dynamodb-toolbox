import type {
  Attribute,
  AttributeValue,
  Extension,
  ListAttributeBasicValue,
  MapAttributeBasicValue,
  PrimitiveAttributeBasicValue,
  RecordAttributeBasicValue,
  SetAttributeBasicValue
} from 'v1/schema'

import type { If } from 'v1/types'

import type { HasExtension } from '../types'
import { collapsePrimitiveAttributeParsedInput } from './primitive'
import { collapseSetAttributeParsedInput } from './set'
import { collapseListAttributeParsedInput } from './list'
import { collapseMapAttributeParsedInput } from './map'
import { collapseRecordAttributeParsedInput } from './record'
import { defaultCollapseExtension } from './utils'

import type { ExtensionCollapser, CollapsingOptions } from './types'

export const collapseAttributeParsedInput = <EXTENSION extends Extension = never>(
  attribute: Attribute,
  parsedInput: AttributeValue<EXTENSION>,
  ...[collapsingOptions = {} as CollapsingOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: CollapsingOptions<EXTENSION>],
    [options?: CollapsingOptions<EXTENSION>]
  >
): AttributeValue<EXTENSION> => {
  const {
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    collapseExtension = (defaultCollapseExtension as unknown) as ExtensionCollapser<EXTENSION>
  } = collapsingOptions

  const { isExtension, collapsedExtension, basicInput } = collapseExtension(
    attribute,
    parsedInput,
    collapsingOptions
  )

  if (isExtension) {
    return collapsedExtension
  }

  if (basicInput === undefined) {
    return undefined
  }

  switch (attribute.type) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return collapsePrimitiveAttributeParsedInput(
        attribute,
        basicInput as PrimitiveAttributeBasicValue
      )
    case 'set':
      return collapseSetAttributeParsedInput(
        attribute,
        basicInput as SetAttributeBasicValue<EXTENSION>,
        collapsingOptions
      )
    case 'list':
      return collapseListAttributeParsedInput(
        attribute,
        basicInput as ListAttributeBasicValue<EXTENSION>,
        collapsingOptions
      )
    case 'map':
      return collapseMapAttributeParsedInput(
        attribute,
        basicInput as MapAttributeBasicValue<EXTENSION>,
        collapsingOptions
      )
    case 'record':
      return collapseRecordAttributeParsedInput(
        attribute,
        basicInput as RecordAttributeBasicValue<EXTENSION>,
        collapsingOptions
      )
    // TODO: anyOf
    default:
      return basicInput
  }
}
