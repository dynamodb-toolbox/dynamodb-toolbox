import type { ParserInput } from 'v1/schema'
import type { EntityV2 } from 'v1/entity/class'

/**
 * User input of a PUT command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireIndependentDefaults Boolean
 * @return Object
 */
export type PutItemInput<SCHEMA extends EntityV2> = ParserInput<SCHEMA['schema']>
