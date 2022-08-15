import { TableV2 } from '../class'
import { Key } from '../types'

export type HasSK<T extends TableV2 = TableV2> = Key extends T['sortKey'] ? false : true
