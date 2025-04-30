import type { Entity, TransformedItem } from '~/entity/index.js'
import { Path } from '~/schema/actions/utils/path.js'
import type { Schema, ValidValue } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isObject } from '~/utils/validation/isObject.js'

import {
  isAddition,
  isAppending,
  isDeletion,
  isGetting,
  isPrepending,
  isRemoval,
  isSetting,
  isSubtraction,
  isSum
} from '../symbols/index.js'
import type { UpdateItemInputExtension } from '../types.js'
import type { ExpressionState, UpdateExpression } from './types.js'
import { expressAddUpdate } from './updates/add.js'
import { expressAppendUpdate } from './updates/append.js'
import { expressDeleteUpdate } from './updates/delete.js'
import { expressGetUpdate } from './updates/get.js'
import { expressPrependUpdate } from './updates/prepend.js'
import { expressRemoveUpdate } from './updates/remove.js'
import { expressSetUpdate } from './updates/set.js'
import { expressSubtractUpdate } from './updates/subtract.js'
import { expressSumUpdate } from './updates/sum.js'
import { pathTokens, refOrValueTokens } from './updates/utils.js'

export const expressUpdate = (
  entity: Entity,
  input: TransformedItem<Entity, { mode: 'update'; extension: UpdateItemInputExtension }>
): UpdateExpression => {
  const {
    setExpressions,
    removeExpressions,
    addExpressions,
    deleteExpressions,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  } = expressUpdateRec(input, new Path(), {
    rootSchema: entity.schema,
    setExpressions: [],
    removeExpressions: [],
    addExpressions: [],
    deleteExpressions: [],
    nameCursors: { s: 1, r: 1, a: 1, d: 1 },
    valueCursors: { s: 1, r: 1, a: 1, d: 1 },
    tokens: { s: {}, r: {}, a: {}, d: {} },
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {}
  })

  const updateExpressions: string[] = []
  if (setExpressions.length > 0) {
    updateExpressions.push(`SET ${setExpressions.join(', ')}`)
  }
  if (removeExpressions.length > 0) {
    updateExpressions.push(`REMOVE ${removeExpressions.join(', ')}`)
  }
  if (addExpressions.length > 0) {
    updateExpressions.push(`ADD ${addExpressions.join(', ')}`)
  }
  if (deleteExpressions.length > 0) {
    updateExpressions.push(`DELETE ${deleteExpressions.join(', ')}`)
  }

  return {
    UpdateExpression: updateExpressions.join(' '),
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}

const expressUpdateRec = (
  value: ValidValue<Schema, { mode: 'update'; extension: UpdateItemInputExtension }>,
  path: Path,
  state: ExpressionState
): ExpressionState => {
  if (value === undefined) {
    return state
  }

  if (isSetting(value)) {
    return expressSetUpdate(value, path, state)
  }

  if (isGetting(value)) {
    return expressGetUpdate(value, path, state)
  }

  if (isSum(value)) {
    return expressSumUpdate(value, path, state)
  }

  if (isSubtraction(value)) {
    return expressSubtractUpdate(value, path, state)
  }

  if (isAppending(value)) {
    return expressAppendUpdate(value, path, state)
  }

  if (isPrepending(value)) {
    return expressPrependUpdate(value, path, state)
  }

  if (isRemoval(value)) {
    return expressRemoveUpdate(value, path, state)
  }

  if (isAddition(value)) {
    return expressAddUpdate(value, path, state)
  }

  if (isDeletion(value)) {
    return expressDeleteUpdate(value, path, state)
  }

  if (isObject(value)) {
    for (const [attrName, attrValue] of Object.entries(value)) {
      expressUpdateRec(attrValue, path.append(attrName), state)
    }

    return state
  }

  if (isArray(value)) {
    value.forEach((element, index) => {
      if (element === undefined) {
        return
      }

      expressUpdateRec(element, path.append(index), state)
    })

    return state
  }

  let setExpression = pathTokens(path, 's', state)
  setExpression += ' = '
  setExpression += refOrValueTokens(value, 's', state)
  state.setExpressions.push(setExpression)

  return state
}
