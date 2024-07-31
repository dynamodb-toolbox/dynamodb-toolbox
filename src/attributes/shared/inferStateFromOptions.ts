import type { Update } from '~/types/update.js'

import type { AttributeOptions } from '../constants/attributeOptions.js'

type InferStateValueFromOption<
  OPTIONS_CONSTRAINTS extends Partial<AttributeOptions>,
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
  OPTIONS_CONSTRAINTS extends Partial<AttributeOptions>,
  DEFAULT_OPTIONS extends OPTIONS_CONSTRAINTS,
  OPTIONS extends Partial<OPTIONS_CONSTRAINTS>,
  ADDITIONAL_OPTIONS extends object = {}
> = Update<
  {
    [KEY in Extract<keyof OPTIONS_CONSTRAINTS, keyof AttributeOptions>]: InferStateValueFromOption<
      OPTIONS_CONSTRAINTS,
      DEFAULT_OPTIONS,
      OPTIONS,
      KEY
    >
  } & ADDITIONAL_OPTIONS,
  never,
  never
>
