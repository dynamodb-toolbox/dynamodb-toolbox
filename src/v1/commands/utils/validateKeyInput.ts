import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'
import type {
  Attribute,
  ResolvedAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  Item
} from 'v1/item'
import { isClosed, isKeyAttribute } from 'v1/item/utils'
import { validatorsByPrimitiveType, isArray, isSet, isObject } from 'v1/utils/validation'
import type { EntityV2, KeyInput } from 'v1'

type ValidationContext = { elementsIndexes?: number[] }

type KeyInputValidator = <INPUT extends EntityV2 | Item | Attribute>(
  entity: INPUT,
  keyInput: KeyInput<INPUT>,
  context?: ValidationContext
) => void

/**
 * Validates the primary key input of a single item command (GET, DELETE ...) for a given Entity
 *
 * @param entry Entity | Item | Attribute
 * @param keyInput Key input
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return void
 */
export const validateKeyInput: KeyInputValidator = <INPUT extends EntityV2 | Item | Attribute>(
  entry: INPUT,
  keyInput: KeyInput<INPUT>,
  context: ValidationContext = {}
): void => {
  if (entry.type === 'entity') {
    return validateKeyInput(entry.item, keyInput, context)
  }

  if (entry.type === 'item') {
    return validateAttributes(entry, keyInput, context)
  }

  const { path } = entry

  if (!isKeyAttribute(entry)) throw new UnrecognizedKeyInputAttributeError({ path })

  switch (entry.type) {
    case 'any':
      break
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      const validator = validatorsByPrimitiveType[entry.type]
      if (!validator(keyInput))
        throw new InvalidKeyInputValueTypeError({
          expectedType: entry.type,
          keyInput,
          path,
          context
        })
      break
    case 'set':
      if (!isSet(keyInput))
        throw new InvalidKeyInputValueTypeError({ expectedType: 'set', keyInput, path, context })
      validateSetElements(entry, keyInput as Set<string | number | Buffer>, context)
      break
    case 'list':
      if (!isArray(keyInput))
        throw new InvalidKeyInputValueTypeError({ expectedType: 'list', keyInput, path, context })
      validateListElements(entry, keyInput as ResolvedAttribute[], context)
      break
    case 'map':
      validateAttributes(entry, keyInput, context)
      break
  }
}

const validateSetElements = (
  set: SetAttribute,
  keyInput: Set<string | number | Buffer>,
  context: ValidationContext
): void => {
  keyInput.forEach(keyInputElement => validateKeyInput(set.elements, keyInputElement, context))
}

const validateListElements = (
  list: ListAttribute,
  keyInput: ResolvedAttribute[],
  context: ValidationContext
): void => {
  keyInput.forEach((keyInputElement, elementIndex) =>
    validateKeyInput(list.elements, keyInputElement, {
      elementsIndexes: [...(context?.elementsIndexes ?? []), elementIndex]
    })
  )
}

const validateAttributes = (
  itemOrMapAttribute: Item | MapAttribute,
  keyInput: ResolvedAttribute,
  context: ValidationContext
): void => {
  const path = itemOrMapAttribute.type === 'map' ? itemOrMapAttribute.path : undefined

  if (!isObject(keyInput))
    throw new InvalidKeyInputValueTypeError({ expectedType: 'map', keyInput, path, context })

  // Check that keyInput values match item or mapped
  Object.entries(keyInput).forEach(([attributeName, attributeInput]) => {
    const attribute = itemOrMapAttribute.attributes[attributeName]
    // TODO, create joinPath util
    const attributePath = [path, attributeName].filter(Boolean).join('.')

    if (attribute !== undefined) {
      validateKeyInput(attribute, attributeInput, context)
    } else {
      if (isClosed(itemOrMapAttribute)) {
        throw new UnexpectedAttributeError({ path: attributePath })
      }
      // TODO: create validateAny ?
    }
  })

  // Check that all key & always required attributes are present in keyInput
  Object.entries(itemOrMapAttribute.attributes)
    .filter(([, attribute]) => isKeyAttribute(attribute) && attribute.required === 'always')
    .forEach(([attributeName, attribute]) => {
      const attributeKeyInput = keyInput[attributeName]
      // TODO, create joinPath util
      const attributePath = [path, attributeName].filter(Boolean).join('.')

      if (attributeKeyInput !== undefined) {
        validateKeyInput(attribute, attributeKeyInput, context)
      } else {
        throw new MissingRequiredAttributeError({ path: attributePath })
      }
    })
}

export class InvalidKeyInputValueTypeError extends Error {
  constructor({
    expectedType,
    keyInput,
    context,
    path
  }: {
    expectedType: Attribute['type']
    keyInput: unknown
    context: ValidationContext
    path?: string
  }) {
    let computedPath = path

    if (computedPath && context.elementsIndexes) {
      context.elementsIndexes.forEach(elementIndex => {
        computedPath = (computedPath as string).replace('[n]', `[${elementIndex}]`)
      })
    }

    super(
      `Invalid key input value type${getInfoTextForItemPath(
        computedPath
      )}. Expected: ${expectedType}. Received: ${String(keyInput)}.`
    )
  }
}

export class UnrecognizedKeyInputAttributeError extends Error {
  constructor({ path }: { path: string }) {
    super(`Unrecognized key input attribute at path ${path}. Attribute is not tagged as key input.`)
  }
}

export class MissingRequiredAttributeError extends Error {
  constructor({ path }: { path: string }) {
    super(`Missing always required key input attribute at path ${path}.`)
  }
}

export class UnexpectedAttributeError extends Error {
  constructor({ path }: { path: string }) {
    super(`Unexpected key input attribute at path ${path}.`)
  }
}
