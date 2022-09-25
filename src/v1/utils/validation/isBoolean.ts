export const isBoolean = (candidate: unknown): candidate is boolean =>
  typeof candidate === 'boolean'
