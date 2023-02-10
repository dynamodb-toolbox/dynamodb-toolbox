import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type { MetricsOption } from 'v1/commands/constants/options/metrics'
import type {
  NoneReturnValuesOption,
  AllOldReturnValuesOption
} from 'v1/commands/constants/options/returnValues'

export type DeleteItemCommandReturnValuesOption = NoneReturnValuesOption | AllOldReturnValuesOption

export const deleteItemCommandReturnValuesOptionsSet = new Set<DeleteItemCommandReturnValuesOption>(
  ['NONE', 'ALL_OLD']
)

export interface DeleteItemOptions<
  RETURN_VALUES extends DeleteItemCommandReturnValuesOption = DeleteItemCommandReturnValuesOption
> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: RETURN_VALUES
}
