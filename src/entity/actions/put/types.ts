import type { Entity } from '~/entity/index.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'

/**
 * User input of a PUT command for a given Entity
 *
 * @param ENTITY Entity
 * @return Object
 */
export type PutItemInput<ENTITY extends Entity> = ParserInput<ENTITY['schema']>
