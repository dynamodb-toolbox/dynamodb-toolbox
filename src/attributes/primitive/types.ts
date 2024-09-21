import type { ResolvedBinaryAttribute } from '../binary/index.js'
import type { ResolvedBooleanAttribute } from '../boolean/index.js'
import type { ResolvedNullAttribute } from '../null/index.js'
import type { ResolvedNumberAttribute } from '../number/index.js'
import type { ResolvedStringAttribute } from '../string/index.js'
import type { $transformerId } from './constants.js'

export interface Transformer<
  INPUT extends
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute =
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute,
  OUTPUT extends
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute =
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute,
  PARSED_OUTPUT extends
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute = OUTPUT
> {
  parse: (inputValue: INPUT) => OUTPUT
  format: (savedValue: OUTPUT) => PARSED_OUTPUT
}

export interface JSONizableTransformer<
  JSONIZED extends { transformerId: string } & object = { transformerId: string } & object,
  INPUT extends
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedStringAttribute
    | ResolvedNumberAttribute
    | ResolvedBinaryAttribute =
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute,
  OUTPUT extends
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute =
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute,
  PARSED_OUTPUT extends
    | ResolvedNullAttribute
    | ResolvedBooleanAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute = OUTPUT
> extends Transformer<INPUT, OUTPUT, PARSED_OUTPUT> {
  [$transformerId]: JSONIZED['transformerId']
  parse: (inputValue: INPUT) => OUTPUT
  format: (savedValue: OUTPUT) => PARSED_OUTPUT
  jsonize: () => JSONIZED
}
