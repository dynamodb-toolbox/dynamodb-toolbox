import { DynamoDBToolboxError } from '~/errors/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import type { Schema } from '../types/index.js'
import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import { hasDefinedDefault } from '../utils/hasDefinedDefault.js'
import { $computed, $discriminations_, $discriminators, $discriminators_ } from './constants.js'
import type { AnyOfSchemaProps } from './types.js'

export class AnyOfSchema<
  ELEMENTS extends Schema[] = Schema[],
  PROPS extends AnyOfSchemaProps = AnyOfSchemaProps
> {
  type: 'anyOf'
  elements: ELEMENTS
  props: PROPS;

  // Lazily computed discriminators (attrName to attrSavedAs mapping) & element schema matches
  [$discriminators_]: Record<string, string> & { [$computed]: boolean };
  [$discriminations_]: Record<string, Schema> & { [$computed]: boolean }

  constructor(elements: ELEMENTS, props: PROPS) {
    this.type = 'anyOf'
    this.elements = elements
    this.props = props

    this[$discriminators_] = { [$computed]: false }
    this[$discriminations_] = { [$computed]: false }
  }

  get checked(): boolean {
    return Object.isFrozen(this.props)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkSchemaProps(this.props, path)

    if (!isArray(this.elements)) {
      throw new DynamoDBToolboxError('schema.anyOf.invalidElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements must be an array.`,
        path
      })
    }

    if (this.elements.length === 0) {
      throw new DynamoDBToolboxError('schema.anyOf.missingElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf attributes must have at least one element.`,
        path
      })
    }

    for (const element of this.elements) {
      const { required, hidden, savedAs } = element.props

      if (required !== undefined && required !== 'atLeastOnce' && required !== 'always') {
        throw new DynamoDBToolboxError('schema.anyOf.optionalElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements must be required.`,
          path
        })
      }

      if (hidden !== undefined && hidden !== false) {
        throw new DynamoDBToolboxError('schema.anyOf.hiddenElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements cannot be hidden.`,
          path
        })
      }

      if (savedAs !== undefined) {
        throw new DynamoDBToolboxError('schema.anyOf.savedAsElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements cannot be renamed (have savedAs prop).`,
          path
        })
      }

      if (hasDefinedDefault(element)) {
        throw new DynamoDBToolboxError('schema.anyOf.defaultedElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements cannot have default or linked values.`,
          path
        })
      }
    }

    const { discriminator } = this.props
    if (discriminator !== undefined) {
      if (!(discriminator in this[$discriminators])) {
        throw new DynamoDBToolboxError('schema.anyOf.invalidDiscriminator', {
          message: `Invalid discriminator${
            path !== undefined ? ` at path '${path}'` : ''
          }: All elements must be map or anyOf schemas and discriminator must be the key of a string enum schema.`,
          path,
          payload: { discriminator }
        })
      }
    }

    this.elements.forEach((element, index) => {
      element.check(`${path ?? ''}[${index}]`)
    })

    Object.freeze(this.props)
    Object.freeze(this.elements)
  }

  get [$discriminators](): Record<string, string> {
    if (!this[$discriminators_][$computed]) {
      Object.assign(
        this[$discriminators_],
        this.elements.map(getDiscriminators).reduce(intersectDiscriminators, undefined) ?? {},
        { [$computed]: true }
      )
    }

    return this[$discriminators_]
  }

  match(value: string): Schema | undefined {
    if (!this[$discriminations_][$computed]) {
      const { discriminator } = this.props

      if (discriminator === undefined) {
        return undefined
      }

      for (const elementSchema of this.elements) {
        Object.assign(this[$discriminations_], getDiscriminations(elementSchema, discriminator))
      }

      Object.assign(this[$discriminations_], { [$computed]: true })
    }

    return this[$discriminations_][value]
  }
}

const getDiscriminators = (schema: Schema): Record<string, string> | undefined => {
  switch (schema.type) {
    case 'anyOf':
      return schema[$discriminators]
    case 'map': {
      const discriminators: Record<string, string> = {}

      for (const [attrName, attr] of Object.entries(schema.attributes)) {
        if (
          attr.type === 'string' &&
          attr.props.enum !== undefined &&
          (attr.props.required === undefined || attr.props.required !== 'never') &&
          attr.props.transform === undefined
        ) {
          discriminators[attrName] = attr.props.savedAs ?? attrName
        }
      }

      return discriminators
    }
    default:
      return {}
  }
}

const intersectDiscriminators = (
  discriminatorsA: Record<string, string> | undefined,
  discriminatorsB: Record<string, string> | undefined
): Record<string, string> | undefined => {
  if (discriminatorsA === undefined) {
    return discriminatorsB
  }

  if (discriminatorsB === undefined) {
    return discriminatorsA
  }

  const [smallestDiscr, largestDiscr] = [discriminatorsA, discriminatorsB].sort((discA, discB) =>
    Object.keys(discA).length > Object.keys(discB).length ? 1 : -1
  ) as [Record<string, string>, Record<string, string>]

  const intersectedDiscriminators: Record<string, string> = {}

  for (const [attrName, attrSavedAs] of Object.entries(smallestDiscr)) {
    if (attrName in largestDiscr && largestDiscr[attrName] === attrSavedAs) {
      intersectedDiscriminators[attrName] = attrSavedAs
    }
  }

  return intersectedDiscriminators
}

const getDiscriminations = (schema: Schema, discriminator: string): Record<string, Schema> => {
  switch (schema.type) {
    case 'anyOf': {
      let discriminations: Record<string, Schema> = {}

      for (const elementSchema of schema.elements) {
        discriminations = {
          ...discriminations,
          ...getDiscriminations(elementSchema, discriminator)
        }
      }

      return discriminations
    }
    case 'map': {
      const discriminations: Record<string, Schema> = {}

      const discriminatorAttr = schema.attributes[discriminator]

      if (discriminatorAttr?.type === 'string') {
        for (const enumValue of discriminatorAttr.props.enum ?? []) {
          discriminations[enumValue] = schema
        }
      }

      return discriminations
    }
    default:
      return {}
  }
}
