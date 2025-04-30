import type { Path } from '~/schema/actions/utils/path.js'

import type { $GET } from '../../symbols/index.js'
import type { ExpressionState } from '../types.js'
import { pathTokens, refOrValueTokens } from './utils.js'

export const expressGetUpdate = (
  value: unknown & { [$GET]: unknown },
  path: Path,
  state: ExpressionState
): ExpressionState => {
  let setExpression = pathTokens(path, 's', state)
  setExpression += ' = '
  setExpression += refOrValueTokens(value, 's', state)
  state.setExpressions.push(setExpression)

  return state
}
