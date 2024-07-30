import type { $sentArgs } from '~/entity/constants.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import { isInteger } from '~/utils/validation/isInteger.js'

import { $actionName, $spy } from './/constants.js'
import { $sentActions } from './constants.js'
import type { EntitySpy } from './spy.js'

export class EntityActionInspector<
  ENTITY extends Entity,
  ACTION extends EntitySendableAction<ENTITY>
> {
  [$spy]: EntitySpy<ENTITY>;
  [$actionName]: string

  constructor(spy: EntitySpy<ENTITY>, Action: new (entity: ENTITY) => ACTION) {
    this[$spy] = spy
    this[$actionName] = (Action as unknown as { actionName: string }).actionName
  }

  count(): number {
    return this[$spy][$sentActions][this[$actionName]]?.length ?? 0
  }

  args(at: number): ReturnType<ACTION[$sentArgs]> | undefined {
    if (!isInteger(at)) {
      throw new Error('Please provide an integer when searching for received command arguments')
    }

    return this[$spy][$sentActions][this[$actionName]]?.[at]
  }

  allArgs(): ReturnType<ACTION[$sentArgs]>[] {
    return this[$spy][$sentActions][this[$actionName]] ?? []
  }
}
