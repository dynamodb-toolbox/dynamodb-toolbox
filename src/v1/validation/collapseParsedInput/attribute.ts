import type { AttributeValue, Extension } from 'v1/schema'

import type { If } from 'v1/types'
import { $type } from 'v1/schema/attributes/constants/attributeOptions'

import type { HasExtension, AttributeParsedValue, AttributeParsedBasicValue } from '../types'
import { collapseSetAttributeParsedInput } from './set'
import { collapseListAttributeParsedInput } from './list'
import { collapseMapAttributeParsedInput } from './map'
import { collapseRecordAttributeParsedInput } from './record'
import { defaultCollapseExtension } from './utils'

import type { ExtensionCollapser, CollapsingOptions } from './types'

const isExplicitelyTyped = <EXTENSION extends Extension = never>(
  parsedInput: AttributeParsedBasicValue<EXTENSION>
): parsedInput is Extract<AttributeParsedBasicValue<EXTENSION>, { [$type]?: unknown }> =>
  (parsedInput as { [$type]?: unknown })[$type] !== undefined

export const collapseAttributeParsedInput = <EXTENSION extends Extension = never>(
  parsedInput: AttributeParsedValue<EXTENSION>,
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
    parsedInput,
    collapsingOptions
  )

  if (isExtension) {
    return collapsedExtension
  }

  if (basicInput === undefined) {
    return undefined
  }

  if (isExplicitelyTyped(basicInput)) {
    if (basicInput[$type] === 'set') {
      return collapseSetAttributeParsedInput(basicInput)
    }

    if (basicInput[$type] === 'list') {
      return collapseListAttributeParsedInput(basicInput, collapsingOptions)
    }

    if (basicInput[$type] === 'map') {
      return collapseMapAttributeParsedInput(basicInput, collapsingOptions)
    }

    if (basicInput[$type] === 'record') {
      return collapseRecordAttributeParsedInput(basicInput, collapsingOptions)
    }
  }

  return basicInput
}
