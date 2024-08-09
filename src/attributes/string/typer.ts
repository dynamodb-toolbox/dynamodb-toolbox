import { primitiveAttributeTyperFactory } from '../primitive/typer.js'
import type { PrimitiveAttributeTyper } from '../primitive/typer.js'

/**
 * Define a new string attribute
 *
 * @param options _(optional)_ String Options
 */
export const string: PrimitiveAttributeTyper<'string'> = primitiveAttributeTyperFactory('string')
