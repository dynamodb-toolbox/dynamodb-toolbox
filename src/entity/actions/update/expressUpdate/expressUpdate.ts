import type { Entity, TransformedItem } from '~/entity/index.js'
import { Path } from '~/schema/actions/utils/path.js'
import type { Schema, SchemaExtendedValue, ValidValue } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isObject } from '~/utils/validation/isObject.js'

import {
  $ADD,
  $APPEND,
  $DELETE,
  $PREPEND,
  $SET,
  $SUBTRACT,
  $SUM,
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
import { pathTokens, refOrValueTokens } from './utils.js'

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
  } = expressUpdateRec(input, Path.fromArray([]), {
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

  switch (true) {
    case isSetting(value): {
      let setExpression = pathTokens(path, 's', state)
      setExpression += ' = '
      setExpression += refOrValueTokens(value[$SET], 's', state)
      state.setExpressions.push(setExpression)
      break
    }
    case isGetting(value): {
      let setExpression = pathTokens(path, 's', state)
      setExpression += ' = '
      setExpression += refOrValueTokens(value, 's', state)
      state.setExpressions.push(setExpression)
      break
    }
    case isSum(value): {
      /**
       * @debt type "Fix this cast"
       */
      const [left, right] = value[$SUM] as [
        SchemaExtendedValue<UpdateItemInputExtension>,
        SchemaExtendedValue<UpdateItemInputExtension>
      ]
      let setExpression = pathTokens(path, 's', state)
      setExpression += ' = '
      setExpression += refOrValueTokens(left, 's', state)
      setExpression += ' + '
      setExpression += refOrValueTokens(right, 's', state)
      state.setExpressions.push(setExpression)
      break
    }
    case isSubtraction(value): {
      /**
       * @debt type "Fix this cast"
       */
      const [left, right] = value[$SUBTRACT] as [
        SchemaExtendedValue<UpdateItemInputExtension>,
        SchemaExtendedValue<UpdateItemInputExtension>
      ]
      let setExpression = pathTokens(path, 's', state)
      setExpression += ' = '
      setExpression += refOrValueTokens(left, 's', state)
      setExpression += ' - '
      setExpression += refOrValueTokens(right, 's', state)
      state.setExpressions.push(setExpression)
      break
    }
    case isAppending(value): {
      let setExpression = pathTokens(path, 's', state)
      setExpression += ' = list_append(if_not_exists('
      setExpression += pathTokens(path, 's', state)
      setExpression += ', '
      setExpression += refOrValueTokens([], 's', state)
      setExpression += '), '
      /**
       * @debt type "Fix this cast"
       */
      setExpression += refOrValueTokens(
        value[$APPEND] as SchemaExtendedValue<UpdateItemInputExtension>,
        's',
        state
      )
      setExpression += ')'
      state.setExpressions.push(setExpression)
      break
    }
    case isPrepending(value): {
      let setExpression = pathTokens(path, 's', state)
      setExpression += ' = list_append('
      /**
       * @debt type "Fix this cast"
       */
      setExpression += refOrValueTokens(
        value[$PREPEND] as SchemaExtendedValue<UpdateItemInputExtension>,
        's',
        state
      )
      setExpression += ', if_not_exists('
      setExpression += pathTokens(path, 's', state)
      setExpression += ', '
      setExpression += refOrValueTokens([], 's', state)
      setExpression += '))'
      state.setExpressions.push(setExpression)
      break
    }
    case isRemoval(value): {
      state.removeExpressions.push(pathTokens(path, 'r', state))
      break
    }
    case isAddition(value): {
      let addExpression = pathTokens(path, 'a', state)
      addExpression += ' '
      addExpression += refOrValueTokens(
        /**
         * @debt type "Fix this cast"
         */
        value[$ADD] as SchemaExtendedValue<UpdateItemInputExtension>,
        'a',
        state
      )
      state.addExpressions.push(addExpression)
      break
    }
    case isDeletion(value): {
      let deleteExpression = pathTokens(path, 'd', state)
      deleteExpression += ' '
      /**
       * @debt type "Fix this cast"
       */
      deleteExpression += refOrValueTokens(
        value[$DELETE] as SchemaExtendedValue<UpdateItemInputExtension>,
        'd',
        state
      )
      state.deleteExpressions.push(deleteExpression)
      break
    }
    case isObject(value): {
      for (const [attrName, attrValue] of Object.entries(value)) {
        expressUpdateRec(attrValue, path.append(Path.fromArray([attrName])), state)
      }
      break
    }
    case isArray(value): {
      value.forEach((element, index) => {
        if (element === undefined) {
          return
        }

        expressUpdateRec(element, path.append(Path.fromArray([index])), state)
      })
      break
    }
    default: {
      let setExpression = pathTokens(path, 's', state)
      setExpression += ' = '
      setExpression += refOrValueTokens(value, 's', state)
      state.setExpressions.push(setExpression)
    }
  }

  return state
}
