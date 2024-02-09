import type { Prettify } from 'v1/types'

import type { ResolveAttribute } from '../types'

import type { RecordAttribute } from './interface'

export type ResolveRecordAttribute<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends { key: boolean } = { key: false }
> = {
  // We cannot use Record type as it messes up map resolution down the line
  // [KEY in ResolveAttribute<ATTRIBUTE['keys'], OPTIONS> & string]?: Prettify<
  //   ResolveAttribute<ATTRIBUTE['elements'], OPTIONS>
  // >
  [KEY in ResolveAttribute<ATTRIBUTE['keys'], OPTIONS> & string]?: ResolveAttribute<
    ATTRIBUTE['elements'],
    OPTIONS
  >
}
