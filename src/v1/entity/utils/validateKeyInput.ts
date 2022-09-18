import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'
import type { Item, Mapped, Property, ResolvedProperty } from 'v1/item'
import { isClosed, isKeyProperty } from 'v1/item/utils'
import { isArray, isObject, validatorsByLeafType } from 'v1/utils/validation'

import type { EntityV2 } from '../class'
import type { KeyInput } from '../generics'

export class InvalidKeyInputValueTypeError extends Error {
  constructor({
    expectedType,
    keyInput,
    path
  }: {
    expectedType: Property['_type']
    keyInput: unknown
    path?: string
  }) {
    super(
      `Invalid key input value type${getInfoTextForItemPath(
        path
      )}. Expected: ${expectedType}. Received: ${String(keyInput)}.`
    )
  }
}

export class UnrecognizedKeyInputPropertyError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Unrecognized key input property${getInfoTextForItemPath(
        path
      )}. Property is not tagged as key input.`
    )
  }
}

export class MissingRequiredPropertyError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Missing always required key input property${getInfoTextForItemPath(path)}.`)
  }
}

export class UnexpectedPropertyError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Unexpected key input property${getInfoTextForItemPath(path)}.`)
  }
}

type KeyInputValidator = <E extends EntityV2 | Item | Property>(
  entity: E,
  keyInput: KeyInput<E>,
  path?: string
) => void

const validateProperties = (
  itemOrMapped: Item | Mapped,
  keyInput: ResolvedProperty,
  path?: string
): void => {
  if (!isObject(keyInput))
    throw new InvalidKeyInputValueTypeError({ expectedType: 'map', keyInput, path })

  // Check that keyInput values match item or mapped
  Object.entries(keyInput).forEach(([propertyName, propertyInput]) => {
    const property = itemOrMapped._properties[propertyName]
    // TODO, create joinPath util
    const propertyPath = [path, propertyName].filter(Boolean).join('.')

    if (property !== undefined) {
      validateKeyInput(property, propertyInput, propertyPath)
    } else {
      if (isClosed(itemOrMapped)) {
        throw new UnexpectedPropertyError({ path: propertyPath })
      }
      // TODO: create validateAny ?
    }
  })

  // Check that all key & always required properties are present in keyInput
  Object.entries(itemOrMapped._properties)
    .filter(([, property]) => isKeyProperty(property) && property._required === 'always')
    .forEach(([propertyName, property]) => {
      const propertyKeyInput = keyInput[propertyName]
      // TODO, create joinPath util
      const propertyPath = [path, propertyName].filter(Boolean).join('.')

      if (propertyKeyInput !== undefined) {
        validateKeyInput(property, propertyKeyInput, propertyPath)
      } else {
        throw new MissingRequiredPropertyError({ path: propertyPath })
      }
    })
}

/**
 * Validates the primary key input of a single item command (GET, DELETE ...) for a given Entity
 *
 * @param entry Entity | Item | Property
 * @param keyInput Key input
 * @param path _(optional)_ Path of the property in the related item (string)
 * @return void
 */
export const validateKeyInput: KeyInputValidator = <E extends EntityV2 | Item | Property>(
  entry: E,
  keyInput: KeyInput<E>,
  path?: string
): void => {
  if (entry._type === 'entity') {
    return validateKeyInput(entry.item, keyInput)
  }

  if (entry._type === 'item') {
    return validateProperties(entry, keyInput, path)
  }

  if (!isKeyProperty(entry)) throw new UnrecognizedKeyInputPropertyError({ path })

  switch (entry._type) {
    case 'any':
      break
    case 'binary':
    case 'boolean':
    case 'number':
    case 'string':
      const validator = validatorsByLeafType[entry._type]
      if (!validator(keyInput))
        throw new InvalidKeyInputValueTypeError({ expectedType: entry._type, keyInput, path })
      break
    case 'list':
      if (!isArray(keyInput))
        throw new InvalidKeyInputValueTypeError({ expectedType: 'list', keyInput, path })
      keyInput.forEach((keyInputElement, index) =>
        validateKeyInput(entry._elements, keyInputElement, `${path ?? ''}[${index}]`)
      )
      break
    case 'map':
      validateProperties(entry, keyInput, path)
      break
  }
}
