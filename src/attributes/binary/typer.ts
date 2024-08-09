import { primitiveAttributeTyperFactory } from '../primitive/typer.js'
import type { PrimitiveAttributeTyper } from '../primitive/typer.js'

/**
 * Define a new binary attribute
 *
 * @param options _(optional)_ Binary Options
 */
export const binary: PrimitiveAttributeTyper<'binary'> = primitiveAttributeTyperFactory('binary')
