import { isNumber } from '~/utils/validation/isNumber.js'

import { Path } from '../utils/path.js'
import type { ProjectionExpression } from './types.js'

export const expressPaths = (paths: string[]): ProjectionExpression => {
  let ProjectionExpression = ''
  const ExpressionAttributeNames: Record<string, string> = {}

  const tokens: Record<string, string> = {}
  let cursor = 1

  paths.forEach((path, index) => {
    if (index > 0) {
      ProjectionExpression += ', '
    }

    Path.fromStr(path).arrayPath.forEach((pathPart, index) => {
      if (isNumber(pathPart)) {
        ProjectionExpression += `[${pathPart}]`
        return
      }

      let token = tokens[pathPart]

      if (token === undefined) {
        token = `#p_${cursor}`
        tokens[pathPart] = token
        ExpressionAttributeNames[token] = pathPart
        cursor++
      }

      if (index > 0) {
        ProjectionExpression += '.'
      }

      ProjectionExpression += token
    })
  })

  return { ProjectionExpression, ExpressionAttributeNames }
}
