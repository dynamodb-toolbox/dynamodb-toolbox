import type { RecordAttribute } from './interface'
import type { ResolveAttribute } from '../types'

export type ResolveRecordAttribute<ATTRIBUTE extends RecordAttribute> = {
  // We cannot use Record type as it messes up map resolution down the line
  [KEY in ResolveAttribute<ATTRIBUTE['keys']> & string]?: ResolveAttribute<ATTRIBUTE['elements']>
}
