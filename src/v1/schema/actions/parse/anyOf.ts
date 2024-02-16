import cloneDeep from 'lodash.clonedeep'

import type {
  Schema,
  Attribute,
  AnyOfAttribute,
  AnyOfAttributeElements,
  Extension,
  ExtendedValue
} from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ValidValue } from './parser'
import type { HasExtension, ParsingOptions } from './types'
import { attrWorkflow, ValidAttrValue } from './attribute'

export type ValidAnyOfAttrValue<
  ATTRIBUTE extends AnyOfAttribute,
  EXTENSION extends Extension = never
> = ValidAnyOfAttrValueRec<ATTRIBUTE['elements'], EXTENSION> | ExtendedValue<EXTENSION, 'anyOf'>

type ValidAnyOfAttrValueRec<
  ELEMENTS extends Attribute[],
  EXTENSION extends Extension = never,
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? ValidAnyOfAttrValueRec<
          ELEMENTS_TAIL,
          EXTENSION,
          RESULTS | ValidAttrValue<ELEMENTS_HEAD, EXTENSION>
        >
      : never
    : never
  : [RESULTS] extends [never]
  ? unknown
  : RESULTS

export function* anyOfAttributeParser<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: AnyOfAttribute,
  inputValue: unknown,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  ValidAnyOfAttrValue<AnyOfAttribute, INPUT_EXTENSION>,
  ValidAnyOfAttrValue<AnyOfAttribute, INPUT_EXTENSION>,
  ValidValue<Schema, SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  let parser:
    | Generator<
        ValidValue<AnyOfAttributeElements, INPUT_EXTENSION>,
        ValidValue<AnyOfAttributeElements, INPUT_EXTENSION>,
        ValidValue<Schema, SCHEMA_EXTENSION> | undefined
      >
    | undefined = undefined
  let _defaultedValue = undefined
  let _linkedValue = undefined
  let _parsedValue = undefined

  for (const elementAttribute of attribute.elements) {
    try {
      parser = attrWorkflow(elementAttribute, inputValue, options)
      if (fill) {
        _defaultedValue = parser.next().value
        // Note: Links cannot be used in anyOf elements or sub elements for this reason (we need the return of the yield)
        _linkedValue = parser.next().value
      }
      _parsedValue = parser.next().value
      break
    } catch (error) {
      parser = undefined
      _defaultedValue = undefined
      _linkedValue = undefined
      _parsedValue = undefined
      continue
    }
  }

  if (fill) {
    const defaultedValue = _defaultedValue ?? cloneDeep(inputValue)
    yield defaultedValue

    const linkedValue = _linkedValue ?? defaultedValue
    yield linkedValue
  }

  const parsedValue = _parsedValue
  if (parser === undefined || parsedValue === undefined) {
    const { path } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${
        path !== undefined ? `'${path}' ` : ''
      }does not match any of the possible sub-types.`,
      path,
      payload: {
        received: inputValue
      }
    })
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parser.next().value
  return transformedValue
}
