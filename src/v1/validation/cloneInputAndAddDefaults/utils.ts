import type { ComputeDefaultsContext } from './types'

export const canComputeDefaults = (
  computeDefaultsContext?: ComputeDefaultsContext
): computeDefaultsContext is ComputeDefaultsContext => computeDefaultsContext !== undefined
