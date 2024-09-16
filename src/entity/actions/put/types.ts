import type { Entity } from '~/entity/index.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import type { Not } from '~/types/not.js'

/**
 * User input of a PUT command for a given Entity
 *
 * @param ENTITY Entity
 * @return Object
 */
export type PutItemInput<ENTITY extends Entity, FILLED extends boolean = false> = ParserInput<
  ENTITY['schema'],
  { fill: Not<FILLED> }
>
