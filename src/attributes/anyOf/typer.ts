import { $AnyOfAttribute } from './interface.js'
import type { AnyOfElementSchema } from './types.js'

type AnyOfAttributeTyper = <ELEMENTS extends AnyOfElementSchema[]>(
  ...elements: ELEMENTS
) => $AnyOfAttribute<{}, ELEMENTS>

/**
 * Define a new anyOf attribute
 * @param elements Attribute[]
 */
export const anyOf: AnyOfAttributeTyper = <ELEMENTS extends AnyOfElementSchema[]>(
  ...elements: ELEMENTS
) => new $AnyOfAttribute({}, elements)
