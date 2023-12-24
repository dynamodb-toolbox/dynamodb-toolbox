import type { AttributeValue, Extension } from 'v1/schema'

import type { If } from 'v1/types'
import { $type } from 'v1/schema/attributes/constants/attributeOptions'

import type { HasExtension, AttributeParsedValue, AttributeParsedBasicValue } from '../types'
import { collapseRecordAttributeParsedInput } from './record'
import { collapseMapAttributeParsedInput } from './map'
import { defaultCollapseExtension } from './utils'

import type { ExtensionCollapser, CollapsingOptions } from './types'

const isExplicitelyTyped = <EXTENSION extends Extension = never>(
  parsedInput: AttributeParsedBasicValue<EXTENSION>
): parsedInput is Extract<AttributeParsedBasicValue<EXTENSION>, { [$type]?: unknown }> =>
  (parsedInput as { [$type]?: unknown })[$type] !== undefined

export const collapseAttributeParsedInput = <EXTENSION extends Extension = never>(
  parsedInput: AttributeParsedValue<EXTENSION>,
  ...[renamingOptions = {} as CollapsingOptions<EXTENSION>]: If<
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
  } = renamingOptions

  const { isExtension, collapsedExtension, basicInput } = collapseExtension(
    parsedInput,
    renamingOptions
  )

  if (isExtension) {
    return collapsedExtension
  }

  if (basicInput === undefined) {
    return undefined
  }

  if (isExplicitelyTyped(basicInput)) {
    if (basicInput[$type] === 'set') {
      return new Set(basicInput)
    }

    if (basicInput[$type] === 'list') {
      return basicInput.map(elementInput =>
        collapseAttributeParsedInput(elementInput, renamingOptions)
      )
    }

    if (basicInput[$type] === 'map') {
      return collapseMapAttributeParsedInput(basicInput, renamingOptions)
    }

    if (basicInput[$type] === 'record') {
      return collapseRecordAttributeParsedInput(basicInput, renamingOptions)
    }
  }

  return basicInput
}
