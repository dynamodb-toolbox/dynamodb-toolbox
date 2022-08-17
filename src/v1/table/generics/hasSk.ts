import { TableV2 } from '../class'
import { Key } from '../types'

/**
 * Returns wether a Table has a Sort Key or not
 *
 * @param T Table
 * @return Boolean
 */
export type HasSK<T extends TableV2 = TableV2> = Key extends T['sortKey'] ? false : true
