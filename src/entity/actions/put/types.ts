import type { Entity, InputItem } from '~/entity/index.js'

/**
 * User input of a PUT command for a given Entity
 *
 * @param ENTITY Entity
 * @return Object
 */
export type PutItemInput<ENTITY extends Entity> = InputItem<ENTITY>
