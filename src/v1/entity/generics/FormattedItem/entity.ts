import type { AnyAttributePath } from 'v1/commands/types/paths'

import type { EntityV2 } from '../../class'
import type { FormattedAttribute } from './attribute'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity
 *
 * @param Entity Entity
 * @return Object
 */
export type FormattedItem<
  ENTITY extends EntityV2,
  OPTIONS extends { attributes?: AnyAttributePath<ENTITY>; partial?: boolean } = {}
> = FormattedAttribute<
  ENTITY['schema'],
  {
    attributes: OPTIONS extends { attributes: string }
      ? OPTIONS['attributes']
      : AnyAttributePath<ENTITY>
    partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : false
  }
>
