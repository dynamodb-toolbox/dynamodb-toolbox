import { $AnyOfAttribute } from './interface.js'
import type { $AnyOfAttributeElements } from './types.js'

type AnyOfAttributeTyper = <ELEMENTS extends $AnyOfAttributeElements[]>(
  ...elements: ELEMENTS
) => $AnyOfAttribute<{}, ELEMENTS>

/**
 * Define a new anyOf attribute
 * @param elements Attribute[]
 */
export const anyOf: AnyOfAttributeTyper = <$ELEMENTS extends $AnyOfAttributeElements[]>(
  ...elements: $ELEMENTS
) => new $AnyOfAttribute({}, elements)
