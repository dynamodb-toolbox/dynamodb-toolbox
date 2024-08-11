import { any } from '~/attributes/any/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'

import { jsonAttrParser } from './attribute.js'
import { jsonAttrOptionSchemas } from './common.js'

export const jsonAnyOfAttrSchema = map({
  type: string().const('anyOf'),
  ...jsonAttrOptionSchemas,
  elements: list(any())
}).validate(input => {
  for (const element of input.elements) {
    // Elements should be valid attributes
    if (!jsonAttrParser.validate(element)) {
      return false
    }

    // Elements should follow `anyOf` constraints
    const areConstraintsVerified = [
      element.required === undefined || element.required === 'atLeastOnce',
      element.hidden === undefined || element.hidden === false,
      element.savedAs === undefined,
      element.defaults?.key === undefined,
      element.defaults?.put === undefined,
      element.defaults?.update === undefined,
      element.links?.key === undefined,
      element.links?.put === undefined,
      element.links?.update === undefined
    ].every(Boolean)

    if (!areConstraintsVerified) {
      return false
    }
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
