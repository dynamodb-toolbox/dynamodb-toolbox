export const combineRegExp = (...patterns: RegExp[]): RegExp => {
  const combinedPatterns = patterns.map(pattern => pattern.source).join('|')
  const flags = new Set(patterns.flatMap(pattern => [...pattern.flags]))

  return new RegExp(combinedPatterns, [...flags].join(''))
}
