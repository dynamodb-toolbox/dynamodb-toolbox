export const normalizeExpression = (
  expressionNames: Record<string, string>,
  expressionValues: Record<string, string>,
): {
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, string>
} => {
  const normalizedExpressionNames = Object.keys(expressionNames).reduce(
    (acc, key) => {
      const value = expressionNames[key]
      return {
        ...acc,
        [normalizeKey(key)]: value,
      }
    },
    {},
  )
  const normalizedExpressionValues = Object.keys(expressionValues).reduce(
    (acc, key) => {
      const value = expressionValues[key]
      return {
        ...acc,
        [normalizeKey(key)]: value,
      }
    },
    {},
  )
  return {
    ExpressionAttributeNames: normalizedExpressionNames,
    ExpressionAttributeValues: normalizedExpressionValues,
  }
}


const normalizeKey = (key: string): string => {
  return key.replace(/[.#[]- ]/g, '_')
}
