/** Type guard checking that `candidate` is a number (excluding `NaN`). */
export const isNumber = (candidate: unknown): candidate is number =>
  typeof candidate === 'number' && !Number.isNaN(candidate)
