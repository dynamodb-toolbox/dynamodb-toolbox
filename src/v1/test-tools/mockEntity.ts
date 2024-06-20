import type { EntityV2 } from 'v1/entity/index.js'

import { MockedEntity } from './mocks/entity.js'

export const mockEntity = <ENTITY extends EntityV2 = EntityV2>(
  entity: ENTITY
): MockedEntity<ENTITY> => new MockedEntity(entity)
