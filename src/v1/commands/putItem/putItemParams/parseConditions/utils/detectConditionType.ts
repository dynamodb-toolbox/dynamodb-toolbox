import { Condition, Conditions } from 'v1/commands/conditions/types'

import { ComparisonOperator, isComparisonOperator } from '../comparison/operators'
import { SingleArgFnOperator, isSingleArgFnOperator } from '../singleArgFn/operators'

export const detectConditionType = (
  $condition: Conditions
):
  | { type: 'comparison'; condition: Condition; operator: ComparisonOperator }
  | { type: 'singleArgFn'; condition: Condition; operator: SingleArgFnOperator }
  | undefined => {
  const condition = $condition as Condition

  for (const operator of Object.keys(condition)) {
    if (isComparisonOperator(operator)) {
      return { type: 'comparison', condition, operator }
    }

    if (isSingleArgFnOperator(operator)) {
      return { type: 'singleArgFn', condition, operator }
    }
  }
}
