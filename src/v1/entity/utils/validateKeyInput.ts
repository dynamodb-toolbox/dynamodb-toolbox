import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'
import type { Item, Mapped, Attribute, ResolvedAttribute } from 'v1/item'
import { isClosed, isKeyAttribute } from 'v1/item/utils'
import { isArray, isObject, validatorsByLeafType } from 'v1/utils/validation'

import type { EntityV2 } from '../class'
import type { KeyInput } from '../generics'

type KeyInputValidator = <Input extends EntityV2 | Item | Attribute>(
  entity: Input,
  keyInput: KeyInput<Input>,
  path?: string
) => void

/**
 * Validates the primary key input of a single item command (GET, DELETE ...) for a given Entity
 *
 * @param entry Entity | Item | Attribute
 * @param keyInput Key input
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return void
 */
export const validateKeyInput: KeyInputValidator = <Input extends EntityV2 | Item | Attribute>(
  entry: Input,
  keyInput: KeyInput<Input>,
  path?: string
): void => {
  if (entry._type === 'entity') {
    return validateKeyInput(entry.item, keyInput)
  }

  if (entry._type === 'item') {
    return validateAttributes(entry, keyInput, path)
  }

  if (!isKeyAttribute(entry)) throw new UnrecognizedKeyInputAttributeError({ path })

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
      validateAttributes(entry, keyInput, path)
      break
  }
}

const validateAttributes = (
  itemOrMapped: Item | Mapped,
  keyInput: ResolvedAttribute,
  path?: string
): void => {
  if (!isObject(keyInput))
    throw new InvalidKeyInputValueTypeError({ expectedType: 'map', keyInput, path })

  // Check that keyInput values match item or mapped
  Object.entries(keyInput).forEach(([attributeName, attributeInput]) => {
    const attribute = itemOrMapped._attributes[attributeName]
    // TODO, create joinPath util
    const attributePath = [path, attributeName].filter(Boolean).join('.')

    if (attribute !== undefined) {
      validateKeyInput(attribute, attributeInput, attributePath)
    } else {
      if (isClosed(itemOrMapped)) {
        throw new UnexpectedAttributeError({ path: attributePath })
      }
      // TODO: create validateAny ?
    }
  })

  // Check that all key & always required attributes are present in keyInput
  Object.entries(itemOrMapped._attributes)
    .filter(([, attribute]) => isKeyAttribute(attribute) && attribute._required === 'always')
    .forEach(([attributeName, attribute]) => {
      const attributeKeyInput = keyInput[attributeName]
      // TODO, create joinPath util
      const attributePath = [path, attributeName].filter(Boolean).join('.')

      if (attributeKeyInput !== undefined) {
        validateKeyInput(attribute, attributeKeyInput, attributePath)
      } else {
        throw new MissingRequiredAttributeError({ path: attributePath })
      }
    })
}

export class InvalidKeyInputValueTypeError extends Error {
  constructor({
    expectedType,
    keyInput,
    path
  }: {
    expectedType: Attribute['_type']
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

export class UnrecognizedKeyInputAttributeError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Unrecognized key input attribute${getInfoTextForItemPath(
        path
      )}. Attribute is not tagged as key input.`
    )
  }
}

export class MissingRequiredAttributeError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Missing always required key input attribute${getInfoTextForItemPath(path)}.`)
  }
}

export class UnexpectedAttributeError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Unexpected key input attribute${getInfoTextForItemPath(path)}.`)
  }
}
