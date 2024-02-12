import type { AnyAttributePath } from 'v1/operations/types'
import type { FormattedValue } from 'v1/schema/actions/format'

import type { EntityV2 } from '../class'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity
 *
 * @param Entity Entity
 * @return Object
 */
export type FormattedItem<
  ENTITY extends EntityV2,
  OPTIONS extends { attributes?: AnyAttributePath<ENTITY['schema']>[]; partial?: boolean } = {}
> = FormattedValue<
  ENTITY['schema'],
  {
    attributes: OPTIONS extends { attributes: string[] }
      ? OPTIONS['attributes']
      : AnyAttributePath<ENTITY['schema']>[]
    partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : false
  }
>
