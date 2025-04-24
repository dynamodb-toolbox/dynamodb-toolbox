import { combineRegExp } from '~/utils/combineRegExp.js'

import type { ArrayPath, StrPath } from './types.js'

const listIndexRegex = /\[(\d+)\]/g
const escapedStrRegex = /\['(.+?)'\]/g
const regularStrRegex = /[\w#@-]+(?=(\.|\[|$))/g
const pathRegex = combineRegExp(listIndexRegex, escapedStrRegex, regularStrRegex)

type MatchType = 'regularStr' | 'escapedStr' | 'listIndex'

export const parseStringPath = (strPath: StrPath): ArrayPath => {
  const arrayPath: ArrayPath = []

  for (const attrMatch of strPath.matchAll(pathRegex)) {
    // NOTE: Order of those matches follows those of combined regExps above
    const [match, listIndexMatch, escapedStrMatch] = attrMatch

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

  return arrayPath
}
