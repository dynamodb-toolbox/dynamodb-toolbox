export const isEmpty = (candidate: object | unknown[]): boolean =>
  Object.keys(candidate).length === 0
