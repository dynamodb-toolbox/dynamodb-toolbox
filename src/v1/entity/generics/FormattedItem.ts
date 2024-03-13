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
  OPTIONS extends FormattedValueOptions<ENTITY['schema']> = {}
> = FormattedValue<ENTITY['schema'], OPTIONS>
