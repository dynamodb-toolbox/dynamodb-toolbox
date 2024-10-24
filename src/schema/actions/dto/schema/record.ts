import { any } from '~/attributes/any/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'

import { attributeDTOParser } from './attribute.js'
import { attrStateDTOAttributes } from './state.js'

export const recordAttrDTOSchema = map({
  type: string().const('record'),
  ...attrStateDTOAttributes,
  keys: map({
    type: string().const('string'),
    required: string().optional().const('atLeastOnce'),
    hidden: boolean().optional().const(false),
    key: boolean().optional().const(false),
    enum: list(string()).optional()
  }),
  elements: any()
}).validate(input => {
  const { elements } = input

  // Elements should be valid attributes
  if (!attributeDTOParser.validate(elements)) {
    return false
  }

  // Elements should follow `record` constraints
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
