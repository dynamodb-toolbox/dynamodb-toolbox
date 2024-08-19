import { any } from '~/attributes/any/index.js'
import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'

import { jsonizedAttrParser } from './attribute.js'
import { jsonizedAttrOptionSchemas } from './common.js'

export const jsonizedListAttrSchema = map({
  type: string().const('list'),
  ...jsonizedAttrOptionSchemas,
  elements: any()
}).validate(input => {
  const { elements } = input

  // Elements should be valid attribute
  if (!jsonizedAttrParser.validate(elements)) {
    return false
  }

  // Elements should follow `list` constraints
  const areConstraintsVerified = [
    elements.required === undefined || elements.required === 'atLeastOnce',
    elements.hidden === undefined || elements.hidden === false,
    elements.savedAs === undefined,
    elements.defaults?.key === undefined,
    elements.defaults?.put === undefined,
    elements.defaults?.update === undefined,
    elements.links?.key === undefined,
    elements.links?.put === undefined,
    elements.links?.update === undefined
  ].every(Boolean)

  if (!areConstraintsVerified) {
    return false
  }

  /**
   * @debt feature "Defaults of type 'value' should follow attribute definition: Implement once attributes fromJSON exists"
   */
  // if (input.defaults !== undefined) {
  //   const { defaults, ...restInput } = input

  //   let attrParser: Parser<Attribute> | undefined

  //   for (const mode of ['put', 'key', 'update'] as const) {
  //     const modeDefault = defaults[mode]

  //     if (modeDefault === undefined || modeDefault.defaulterId !== 'value') {
  //       continue
  //     }

  //     if (attrParser === undefined) {
  //       attrParser = new Parser(fromJSON(restInput))
  //     }

  //     if (
  //       !attrParser.validate(modeDefault.value, {
  //         mode,
  //         fill: false,
  //         transform: false,
  //         parseExtension: mode === 'update' ? parseUpdateExtension : undefined
  //       })
  //     ) {
  //       console.log('did not validate')
  //       return false
  //     }
  //   }
  // }

  return true
})
