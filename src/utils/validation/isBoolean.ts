/** Type guard checking that `candidate` is a boolean. */
export const isBoolean = (candidate: unknown): candidate is boolean =>
  typeof candidate === 'boolean'
