import { DynamoDBToolboxError } from '~/errors/index.js'
import { combineRegExp } from '~/utils/combineRegExp.js'

import type { ArrayPath, StrPath } from './types.js'

const listIndexRegex = /\[(\d+)\]/g
const escapedStrRegex = /\['(.+?)'\]/g
const regularStrRegex = /[\w#@-]+(?=(\.|\[|$))/g
const pathRegex = combineRegExp(listIndexRegex, escapedStrRegex, regularStrRegex)

type MatchType = 'regularStr' | 'escapedStr' | 'listIndex'

export const parseStringPath = (strPath: StrPath): ArrayPath => {
  if (strPath === '') {
    return []
  }

  const arrayPath: ArrayPath = []
  let attrPathTail: string | undefined

  for (const attrMatch of strPath.matchAll(pathRegex)) {
    // NOTE: Order of those matches follows those of combined regExps above
    const [match, listIndexMatch, escapedStrMatch, tail] = attrMatch
    attrPathTail = tail

    const matchedKey: string = escapedStrMatch ?? listIndexMatch ?? match
    const matchType: MatchType =
      escapedStrMatch !== undefined
        ? 'escapedStr'
        : listIndexMatch !== undefined
          ? 'listIndex'
          : 'regularStr'

    switch (matchType) {
      case 'listIndex':
        arrayPath.push(parseInt(matchedKey))
        break
      default:
        arrayPath.push(matchedKey)
    }
  }

  if (arrayPath.length === 0 || (attrPathTail !== undefined && attrPathTail.length > 0)) {
    throw new DynamoDBToolboxError('actions.invalidExpressionAttributePath', {
      message: `Unable to match expression attribute path with schema: ${strPath}`,
      payload: { attributePath: strPath }
    })
  }

  return arrayPath
}
