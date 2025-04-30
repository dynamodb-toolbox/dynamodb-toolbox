import type { Path } from '~/schema/actions/utils/path.js'
import type { SchemaExtendedValue } from '~/schema/index.js'

import { $APPEND } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { pathTokens, refOrValueTokens } from './utils.js'

export const expressAppendUpdate = (
  value: unknown & { [$APPEND]: unknown },
  path: Path,
  state: ExpressionState
): ExpressionState => {
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

  return state
}
