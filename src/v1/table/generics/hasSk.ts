import { TableV2 } from '../class'
import { Key } from '../types'

/**
 * Returns wether a Table has a Sort Key or not
 *
 * @param TableInput Table
 * @return Boolean
 */
export type HasSK<TableInput extends TableV2 = TableV2> = Key extends TableInput['sortKey']
  ? false
  : true
