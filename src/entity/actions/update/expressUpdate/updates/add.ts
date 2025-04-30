import type { Path } from '~/schema/actions/utils/path.js'
import type { SchemaExtendedValue } from '~/schema/index.js'

import { $ADD } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { pathTokens, refOrValueTokens } from './utils.js'

export const expressAddUpdate = (
  value: unknown & { [$ADD]: unknown },
  path: Path,
  state: ExpressionState
): ExpressionState => {
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

  return state
}
