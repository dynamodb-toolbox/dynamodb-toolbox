/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import { error } from './utils'

// Check attribute against attribute set
export default (attr: string, attrs: any): string => {
  // Split paths with dot notation and list brackets
  const path = attr.split('.')
  const list = path[0].split('[')

  // Check that the base path exists as an attribute or alias
  if (list[0] in attrs) {
    // Replace base alias with table attribute
    path[0] =
      (attrs[list[0]].map ? attrs[list[0]].map : list[0]) +
      (list.length > 1 ? `[${list.slice(1).join('[')}` : '')
    // Return joined path
    return path.join('.')
    // Throw an error if not a valid attribute or alias
  } else {
    return error(`'${attr}' is not a valid attribute within the given entity/table.`)
  }
}
