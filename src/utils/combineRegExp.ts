/** Combine several regular expressions into one that matches any of them, merging their flags. */
export const combineRegExp = (...patterns: RegExp[]): RegExp => {
  const combinedPatterns = patterns.map(pattern => pattern.source).join('|')
  const flags = new Set(patterns.flatMap(pattern => [...pattern.flags]))

  return new RegExp(combinedPatterns, [...flags].join(''))
}
