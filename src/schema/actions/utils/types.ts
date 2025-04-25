/**
 * String attribute path. Used in Conditions and Projections.
 */
export type StrPath = string

/**
 * Parsed attribute path. Must NOT contain escaped string (the must be de-escaped).
 */
export type ArrayPath = (string | number)[]
