import type { Path } from '~/schema/actions/utils/path.js'
import type { SchemaExtendedValue } from '~/schema/index.js'

import { $DELETE } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { pathTokens, refOrValueTokens } from './utils.js'

export const expressDeleteUpdate = (
  value: unknown & { [$DELETE]: unknown },
  path: Path,
  state: ExpressionState
): ExpressionState => {
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

  return state
}
