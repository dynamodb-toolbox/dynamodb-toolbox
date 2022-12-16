import { EntityV2, PutItemInput, PossiblyUndefinedResolvedAttribute } from 'v1'

import { addItemInitialDefaults } from './item'

export const addEntityInitialDefaults = <ENTITY extends EntityV2>(
  entity: ENTITY,
  putItemInput: PutItemInput<ENTITY, false>
): PutItemInput<ENTITY, true> =>
  addItemInitialDefaults(
    entity.item,
    putItemInput as { [key: string]: PossiblyUndefinedResolvedAttribute }
  ) as any
