import type { UpdateItemInput, UpdateAttributeInput } from 'v1/commands/updateItem/types'

import type { UpdateParser } from '../updateParser'

export const parseUpdate = (
  state: UpdateParser,
  input: UpdateItemInput | UpdateAttributeInput
): void => {
  state
  input
}
