import { primitiveAttributeTyperFactory } from '../primitive/typer.js'
import type { PrimitiveAttributeTyper } from '../primitive/typer.js'

/**
 * Define a new null attribute
 *
 * @param options _(optional)_ Null Options
 */
export const nul: PrimitiveAttributeTyper<'null'> = primitiveAttributeTyperFactory('null')
