import { Condition, Conditions } from 'v1/commands/conditions/types'

import { ComparisonOperator, isComparisonOperator } from '../comparison/operators'

export const detectConditionType = (
  condition: Conditions
): { type: 'comparison'; condition: Condition; operator: ComparisonOperator } | undefined => {
  for (const conditionKey of Object.keys(condition)) {
    if (isComparisonOperator(conditionKey)) {
      return { type: 'comparison', condition: condition as Condition, operator: conditionKey }
    }
  }
}
