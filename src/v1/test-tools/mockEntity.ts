import type { EntityV2 } from 'v1/entity/class'

import { MockedEntity } from './mocks/entity'

export const mockEntity = <ENTITY extends EntityV2 = EntityV2>(
  entity: ENTITY
): MockedEntity<ENTITY> => new MockedEntity(entity)
