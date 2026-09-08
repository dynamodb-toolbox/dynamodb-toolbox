import type { $sentArgs } from '~/entity/constants.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import { isInteger } from '~/utils/validation/isInteger.js'

import { $actionName, $spy } from './/constants.js'
import { $sentActions } from './constants.js'
import type { EntitySpy } from './spy.js'

/** Query the recorded calls of a stubbed entity action. */
export class EntityActionInspector<
  ENTITY extends Entity,
  ACTION extends EntitySendableAction<ENTITY>
> {
  [$spy]: EntitySpy<ENTITY>;
  [$actionName]: string

  /** Bind the inspector to a spy and the action to inspect. */
  constructor(spy: EntitySpy<ENTITY>, Action: new (entity: ENTITY) => ACTION) {
    this[$spy] = spy
    this[$actionName] = (Action as unknown as { actionName: string }).actionName
  }

  /** Return how many times the action was sent. */
  count(): number {
    return this[$spy][$sentActions][this[$actionName]]?.length ?? 0
  }

  /** Return the sent args of the call at the given index. */
  args(at: number): ReturnType<ACTION[$sentArgs]> | undefined {
    if (!isInteger(at)) {
      throw new Error('Please provide an integer when searching for received command arguments')
    }

    return this[$spy][$sentActions][this[$actionName]]?.[at]
  }

  /** Return the sent args of every recorded call. */
  allArgs(): ReturnType<ACTION[$sentArgs]>[] {
    return this[$spy][$sentActions][this[$actionName]] ?? []
  }
}
