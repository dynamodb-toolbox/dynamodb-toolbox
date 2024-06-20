import type { ParserInput } from 'v1/schema/actions/parse/index.js'
import type { EntityV2 } from 'v1/entity/index.js'

/**
 * User input of a PUT command for a given Entity
 *
 * @param ENTITY Entity
 * @return Object
 */
export type PutItemInput<ENTITY extends EntityV2> = ParserInput<ENTITY['schema']>
