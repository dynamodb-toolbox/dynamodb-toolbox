import { any } from '~/attributes/any/index.js'
import { map } from '~/attributes/map/index.js'
import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'

import { jsonAttrParser } from './attribute.js'
import { jsonAttrOptionSchemas } from './common.js'

export const jsonMapAttrSchema = map({
  type: string().const('map'),
  ...jsonAttrOptionSchemas,
  attributes: record(string(), any())
}).validate(input => {
  const { attributes } = input

  const allSavedAs = new Set<string>()

  for (const [attributeName, attribute] of Object.entries(attributes)) {
    // Child attribute should be valid attribute
    if (!jsonAttrParser.validate(attribute)) {
      return false
    }

    const savedAs = attribute.savedAs ?? attributeName
    if (allSavedAs.has(savedAs)) {
      return false
    } else {
      allSavedAs.add(savedAs)
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

  //     if (modeDefault === undefined || modeDefault.defaulterType !== 'value') {
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
