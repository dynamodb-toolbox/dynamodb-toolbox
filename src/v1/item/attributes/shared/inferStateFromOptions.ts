import type {
  AttributeOptionSymbolName,
  AttributeOptionNameSymbol,
  AttributeOptionsConstraints,
  AttributeOptionName
} from '../constants/attributeOptions'

type InferStateValueFromOption<
  OPTIONS_CONSTRAINTS extends Partial<AttributeOptionsConstraints>,
  DEFAULT_OPTIONS extends OPTIONS_CONSTRAINTS,
  OPTIONS extends Partial<OPTIONS_CONSTRAINTS>,
  OPTION_NAME extends keyof OPTIONS_CONSTRAINTS,
  OPTION_VALUE = undefined extends OPTIONS_CONSTRAINTS[OPTION_NAME]
    ? OPTIONS[OPTION_NAME]
    : NonNullable<OPTIONS[OPTION_NAME]>
> = OPTIONS_CONSTRAINTS[OPTION_NAME] extends OPTION_VALUE
  ? DEFAULT_OPTIONS[OPTION_NAME]
  : OPTION_VALUE

export type InferStateFromOptions<
  OPTIONS_CONSTRAINTS extends Partial<AttributeOptionsConstraints>,
  DEFAULT_OPTIONS extends OPTIONS_CONSTRAINTS,
  OPTIONS extends Partial<OPTIONS_CONSTRAINTS>
> = {
  [KEY in AttributeOptionNameSymbol[Extract<
    keyof OPTIONS_CONSTRAINTS,
    AttributeOptionName
  >]]: InferStateValueFromOption<
    OPTIONS_CONSTRAINTS,
    DEFAULT_OPTIONS,
    OPTIONS,
    Extract<AttributeOptionSymbolName[KEY], keyof OPTIONS_CONSTRAINTS>
  >
}
