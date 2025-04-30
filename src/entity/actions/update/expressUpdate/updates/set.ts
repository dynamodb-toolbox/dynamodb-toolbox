import type { Path } from '~/schema/actions/utils/path.js'

import { $SET } from '../../symbols/index.js'
import type { ExpressionState } from '../types.js'
import { pathTokens, refOrValueTokens } from './utils.js'

export const expressSetUpdate = (
  value: unknown & { [$SET]: unknown },
  path: Path,
  state: ExpressionState
): ExpressionState => {
  let setExpression = pathTokens(path, 's', state)
  setExpression += ' = '
  setExpression += refOrValueTokens(value[$SET], 's', state)
  state.setExpressions.push(setExpression)

  return state
}
