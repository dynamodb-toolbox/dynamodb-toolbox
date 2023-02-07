import type { O } from 'ts-toolbelt'
import isEqual from 'lodash.isequal'

import { DynamoDBToolboxError } from 'v1/errors'
import { isComputedDefault } from 'v1/item/utils/isComputedDefault'
import { isStaticDefault } from 'v1/item/utils/isStaticDefault'

import {
  $type,
  $value,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default,
  AttributeOptionNameSymbol
} from '../constants/attributeOptions'
import { validateAttributeProperties } from '../shared/validate'

import type {
  $ConstantAttribute,
  ConstantAttributeStateConstraint,
  ConstantAttribute
} from './interface'

export type FreezeConstantAttribute<$CONSTANT_ATTRIBUTE extends $ConstantAttribute> =
  // Applying void O.Update improves type display
  O.Update<
    ConstantAttribute<
      $CONSTANT_ATTRIBUTE[$value],
      {
        [KEY in keyof ConstantAttributeStateConstraint]: $CONSTANT_ATTRIBUTE[AttributeOptionNameSymbol[KEY]]
      }
    >,
    never,
    never
  >

type ConstantAttributeFreezer = <$CONSTANT_ATTRIBUTE extends $ConstantAttribute>(
  $constantAttribute: $CONSTANT_ATTRIBUTE,
  path: string
) => FreezeConstantAttribute<$CONSTANT_ATTRIBUTE>

/**
 * Validates a constant instance
 *
 * @param $constantAttribute Primitive
 * @param path Path of the instance in the related item (string)
 * @return void
 */
export const freezeConstantAttribute: ConstantAttributeFreezer = ($constantAttribute, path) => {
  validateAttributeProperties($constantAttribute, path)

  const constValue = $constantAttribute[$value]
  const defaultValue = $constantAttribute[$default]
  if (
    defaultValue !== undefined &&
    !isComputedDefault(defaultValue) &&
    isStaticDefault(defaultValue)
  ) {
    if (!isEqual(constValue, defaultValue)) {
      throw new DynamoDBToolboxError('invalidConstantAttributeDefaultValue', {
        message: `Invalid default value at path ${path}: Expected: ${String(
          constValue
        )}. Received: ${String(defaultValue)}`,
        path,
        payload: { expectedValue: constValue, defaultValue }
      })
    }
  }

  return {
    path,
    type: $constantAttribute[$type],
    value: constValue,
    required: $constantAttribute[$required],
    hidden: $constantAttribute[$hidden],
    key: $constantAttribute[$key],
    savedAs: $constantAttribute[$savedAs],
    default: defaultValue
  }
}
