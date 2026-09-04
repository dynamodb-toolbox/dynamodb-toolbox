/**
 * Escape a string for safe use inside a projection regex.
 */
export const sanitize = (str: string): string =>
  str.replace(/\\/g, '\\\\').replace(/[-[\]/{}()*+?.^$|]/g, '\\$&')

type ProjectionMatch =
  | { isProjected: false; childrenAttributes?: never }
  | { isProjected: true; childrenAttributes?: string[] }

/**
 * Match a root item attribute against the projected attributes.
 */
export const matchItemProjection = (
  attributeName: string,
  projectedAttributes?: string[]
): ProjectionMatch => {
  const sanitizedAttributeName = sanitize(attributeName)

  return matchProjection(
    new RegExp(`^(${sanitizedAttributeName}|\\['${sanitizedAttributeName}'\\])(?=\\.|\\[|$)`),
    projectedAttributes
  )
}

/**
 * Match a `map` attribute against the projected attributes.
 */
export const matchMapProjection = (
  attributeName: string,
  projectedAttributes?: string[]
): ProjectionMatch => {
  const sanitizedAttributeName = sanitize(attributeName)

  return matchProjection(
    new RegExp(`^(\\.${sanitizedAttributeName}|\\['${sanitizedAttributeName}'])(?=\\.|\\[|$)`),
    projectedAttributes
  )
}

/**
 * Match a `list` element against the projected attributes.
 */
export const matchListProjection = (projectedAttributes?: string[]): ProjectionMatch =>
  matchProjection(/\[\d+\]/, projectedAttributes)

/**
 * Match a `tuple` element against the projected attributes.
 */
export const matchTupleProjection = (
  elementIndex: number,
  projectedAttributes?: string[]
): ProjectionMatch =>
  matchProjection(new RegExp(`^\\[${elementIndex}](?=\\.|\\[|$)`), projectedAttributes)

const matchProjection = (
  attributeNameRegex: RegExp,
  projectedAttributes?: string[]
): ProjectionMatch => {
  if (projectedAttributes === undefined) {
    return { isProjected: true }
  }

  const childrenAttributes: string[] = []
  for (const attributePath of projectedAttributes) {
    const attributeMatch = attributePath.match(attributeNameRegex)

    if (attributeMatch !== null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const firstMatch = attributeMatch[0]!
      childrenAttributes.push(attributePath.slice(firstMatch.length))
    }
  }

  if (childrenAttributes.length === 0) {
    return { isProjected: false }
  }

  if (childrenAttributes.some(attribute => attribute === '')) {
    // We do not add childrenAttributes as we want all of them
    return { isProjected: true }
  }

  return { isProjected: true, childrenAttributes }
}
