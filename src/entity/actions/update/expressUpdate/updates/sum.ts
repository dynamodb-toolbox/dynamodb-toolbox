import type { Path } from '~/schema/actions/utils/path.js'
import type { SchemaExtendedValue } from '~/schema/index.js'

import { $SUM } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { pathTokens, refOrValueTokens } from './utils.js'

export const expressSumUpdate = (
  value: unknown & { [$SUM]: unknown },
  path: Path,
  state: ExpressionState
): ExpressionState => {
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

  return state
}
