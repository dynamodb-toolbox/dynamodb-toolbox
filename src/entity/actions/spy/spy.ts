import { $interceptor, $sentArgs } from '~/entity/constants.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import { EntityAction } from '~/entity/index.js'

import { EntityActionStub } from './actionStub.js'
import { $mocks, $sentActions } from './constants.js'
import { EntitySentActions } from './sentActions.js'

export class EntitySpy<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static actionName: 'spy';

  [$mocks]: Record<string, (...args: any[]) => any>;
  [$sentActions]: Record<string, any[]>

  constructor(entity: ENTITY) {
    super(entity)

    this[$mocks] = {}
    this[$sentActions] = {}

    entity[$interceptor] = (action: EntitySendableAction) => {
      const actionName = (action.constructor as unknown as { actionName: string }).actionName

      const sentArgs = action[$sentArgs]()

      if (this[$sentActions][actionName] !== undefined) {
        this[$sentActions][actionName].push(sentArgs)
      } else {
        this[$sentActions][actionName] = [sentArgs]
      }

      if (this[$mocks][actionName] !== undefined) {
        return this[$mocks][actionName](...sentArgs)
      }
    }
  }

  reset(): EntitySpy<ENTITY> {
    this[$mocks] = {}
    this[$sentActions] = {}

    return this
  }

  on<ACTION extends EntitySendableAction<ENTITY> = EntitySendableAction<ENTITY>>(
    Action: new (entity: ENTITY) => ACTION
  ): EntityActionStub<ENTITY, ACTION> {
    return new EntityActionStub(this, Action)
  }

  sent<ACTION extends EntitySendableAction<ENTITY> = EntitySendableAction<ENTITY>>(
    Action: new (entity: ENTITY) => ACTION
  ): EntitySentActions<ENTITY, ACTION> {
    return new EntitySentActions(this, Action)
  }

  restore(): void {
    delete this.entity[$interceptor]
  }
}
