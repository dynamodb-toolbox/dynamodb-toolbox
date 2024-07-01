import type { Entity } from '~/entity/index.js'

import { MockedEntity } from './mocks/entity.js'

export const mockEntity = <ENTITY extends Entity = Entity>(entity: ENTITY): MockedEntity<ENTITY> =>
  new MockedEntity(entity)
