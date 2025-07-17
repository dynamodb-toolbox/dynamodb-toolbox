export const sanitize = (str: string): string =>
  str.replace(/\\/g, '\\\\').replace(/[-[\]/{}()*+?.^$|]/g, '\\$&')

type ProjectionMatch =
  | { isProjected: false; childrenAttributes?: never }
  | { isProjected: true; childrenAttributes?: string[] }

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

export const matchListProjection = (projectedAttributes?: string[]): ProjectionMatch =>
  matchProjection(/\[\d+\]/, projectedAttributes)

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
