import type { EntityPaths } from 'v1/operations/paths'
import type { FormattedValue, FormattedValueOptions } from 'v1/schema/actions/format'

import type { EntityV2 } from '../class'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity
 *
 * @param Entity Entity
 * @return Object
 */
export type FormattedItem<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends FormattedValueOptions<EntityPaths<ENTITY>> = {}
> = FormattedValue<ENTITY['schema'], OPTIONS>
