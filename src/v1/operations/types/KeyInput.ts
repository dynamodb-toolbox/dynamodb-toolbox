import type { ParserInput } from 'v1/schema/actions/tParse'
import type { EntityV2 } from 'v1/entity'

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity or Schema
 *
 * @param ENTITY Entity
 * @return Object
 */
export type KeyInput<ENTITY extends EntityV2> = ParserInput<ENTITY['schema'], { operation: 'key' }>
