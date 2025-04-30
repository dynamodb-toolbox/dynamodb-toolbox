import type { Path } from '~/schema/actions/utils/path.js'

import type { $REMOVE } from '../../symbols/index.js'
import type { ExpressionState } from '../types.js'
import { pathTokens } from './utils.js'

export const expressRemoveUpdate = (
  value: unknown & { [$REMOVE]: unknown },
  path: Path,
  state: ExpressionState
): ExpressionState => {
  state.removeExpressions.push(pathTokens(path, 'r', state))

  return state
}
