import { $interceptor, $sentArgs } from '~/entity/constants.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import { EntityAction } from '~/entity/index.js'

import { EntityActionInspector } from './actionInspector.js'
import { EntityActionStub } from './actionStub.js'
import { $mocks, $sentActions } from './constants.js'

/** Intercept an entity's sendable actions to stub responses and record calls in tests. */
export class EntitySpy<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'spy';

  [$mocks]: Record<string, (...args: any[]) => any>;
  [$sentActions]: Record<string, any[]>

  /** Bind the spy to an entity and install its action interceptor. */
  constructor(entity: ENTITY) {
    super(entity)

    this[$mocks] = {}
    this[$sentActions] = {}

    entity[$interceptor] = (action: EntitySendableAction) => {
      const actionName = (action.constructor as unknown as { actionName: string }).actionName

      const sentArgs = action[$sentArgs]()

      const actionSentArgs = this[$sentActions][actionName]
      if (actionSentArgs !== undefined) {
        actionSentArgs.push(sentArgs)
      } else {
        this[$sentActions][actionName] = [sentArgs]
      }

      const actionMock = this[$mocks][actionName]
      if (actionMock !== undefined) {
        return actionMock(...sentArgs)
      }
    }
  }

  /** Clear all mocks and recorded actions. */
  reset(): EntitySpy<ENTITY> {
    this[$mocks] = {}
    this[$sentActions] = {}

    return this
  }

  /** Stub a given action's `send` with a canned response. */
  on<ACTION extends EntitySendableAction<ENTITY> = EntitySendableAction<ENTITY>>(
    Action: new (entity: ENTITY) => ACTION
  ): EntityActionStub<ENTITY, ACTION> {
    return new EntityActionStub(this, Action)
  }

  /** Inspect the recorded calls for a given action. */
  sent<ACTION extends EntitySendableAction<ENTITY> = EntitySendableAction<ENTITY>>(
    Action: new (entity: ENTITY) => ACTION
  ): EntityActionInspector<ENTITY, ACTION> {
    return new EntityActionInspector(this, Action)
  }

  /** Remove the interceptor, restoring the entity's normal behavior. */
  restore(): void {
    delete this.entity[$interceptor]
  }
}
