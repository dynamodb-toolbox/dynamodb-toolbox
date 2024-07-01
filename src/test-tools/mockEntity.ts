import type { Entity } from '~/entity/index.js'

import { MockedEntity } from './mocks/entity.js'

type EntityMocker = <ENTITY extends Entity = Entity>(entity: ENTITY) => MockedEntity<ENTITY>

export const mockEntity: EntityMocker = entity => new MockedEntity(entity)
