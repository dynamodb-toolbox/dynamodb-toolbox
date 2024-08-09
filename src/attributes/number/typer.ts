import { primitiveAttributeTyperFactory } from '../primitive/typer.js'
import type { PrimitiveAttributeTyper } from '../primitive/typer.js'

/**
 * Define a new number attribute
 *
 * @param options _(optional)_ Number Options
 */
export const number: PrimitiveAttributeTyper<'number'> = primitiveAttributeTyperFactory('number')
