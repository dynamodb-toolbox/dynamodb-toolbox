export const isNumber = (candidate: unknown): candidate is number =>
  typeof candidate === 'number' && !Number.isNaN(candidate)
