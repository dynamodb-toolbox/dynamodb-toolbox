import { primitiveAttributeTyperFactory } from '../primitive/typer.js'
import type { PrimitiveAttributeTyper } from '../primitive/typer.js'

/**
 * Define a new boolean attribute
 *
 * @param options _(optional)_ Boolean Options
 */
export const boolean: PrimitiveAttributeTyper<'boolean'> = primitiveAttributeTyperFactory('boolean')
