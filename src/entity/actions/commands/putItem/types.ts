import type { EntityV2 } from '~/entity/index.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'

/**
 * User input of a PUT command for a given Entity
 *
 * @param ENTITY Entity
 * @return Object
 */
export type PutItemInput<ENTITY extends EntityV2> = ParserInput<ENTITY['schema']>
