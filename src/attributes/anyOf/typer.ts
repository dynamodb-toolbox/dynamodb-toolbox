import { $AnyOfAttribute } from './interface.js'
import { ANY_OF_DEFAULT_OPTIONS } from './options.js'
import type { AnyOfAttributeDefaultOptions } from './options.js'
import type { $AnyOfAttributeElements } from './types.js'

type AnyOfAttributeTyper = <ELEMENTS extends $AnyOfAttributeElements[]>(
  ...elements: ELEMENTS
) => $AnyOfAttribute<AnyOfAttributeDefaultOptions, ELEMENTS>

/**
 * Define a new anyOf attribute
 * @param elements Attribute[]
 * @param options _(optional)_ AnyOf Options
 */
export const anyOf: AnyOfAttributeTyper = <$ELEMENTS extends $AnyOfAttributeElements[]>(
  ...elements: $ELEMENTS
) => new $AnyOfAttribute(ANY_OF_DEFAULT_OPTIONS, elements)
