import { Parser } from '~/schema/actions/parse/index.js'
import { parseStringPath } from '~/schema/actions/utils/parseStringPath.js'
import { Path } from '~/schema/actions/utils/path.js'
import type { ArrayPath } from '~/schema/actions/utils/types.js'
import { AnySchema } from '~/schema/any/schema.js'
import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'
import { isInteger } from '~/utils/validation/isInteger.js'

import { SubSchema } from './subSchema.js'

// TO IMPROVE: Type path as Path<SCHEMA> and return typed SubSchema
export class Finder<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'finder' as const

  search(path: string): SubSchema[] {
    return findSubSchemas(this.schema, parseStringPath(path))
  }
}

export const findSubSchemas = (schema: Schema, path: ArrayPath): SubSchema[] => {
  const [pathHead, ...pathTail] = path

  if (pathHead === undefined) {
    return [
      new SubSchema({
        schema,
        originalPath: Path.fromArray([]),
        transformedPath: Path.fromArray([])
      })
    ]
  }

  switch (schema.type) {
    case 'any': {
      return [
        new SubSchema({
          // Why Required never?
          schema: new AnySchema({ required: 'never' }),
          originalPath: Path.fromArray(path),
          transformedPath: Path.fromArray(path)
        })
      ]
    }

    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
    case 'set':
      return []

    case 'record': {
      const keyAttribute = schema.keys

      let parsedKey: string
      try {
        parsedKey = new Parser(keyAttribute).parse(pathHead)
      } catch {
        return []
      }

      return findSubSchemas(schema.elements, pathTail).map(
        ({ schema, originalPath, transformedPath }) =>
          new SubSchema({
            schema,
            originalPath: originalPath.prepend(Path.fromArray([pathHead])),
            transformedPath: transformedPath.prepend(Path.fromArray([parsedKey]))
          })
      )
    }
    case 'item':
    case 'map': {
      const childAttribute = schema.attributes[pathHead]
      if (!childAttribute) {
        return []
      }

      const transformedLocalPath = childAttribute.props.savedAs ?? pathHead

      return findSubSchemas(childAttribute, pathTail).map(
        ({ schema, originalPath, transformedPath }) =>
          new SubSchema({
            schema,
            originalPath: originalPath.prepend(Path.fromArray([pathHead])),
            transformedPath: transformedPath.prepend(Path.fromArray([transformedLocalPath]))
          })
      )
    }
    case 'list': {
      if (!isInteger(pathHead)) {
        return []
      }

      return findSubSchemas(schema.elements, pathTail).map(
        ({ schema, originalPath, transformedPath }) =>
          new SubSchema({
            schema,
            originalPath: originalPath.prepend(Path.fromArray([pathHead])),
            transformedPath: transformedPath.prepend(Path.fromArray([pathHead]))
          })
      )
    }
    case 'anyOf': {
      return schema.elements.map(element => findSubSchemas(element, path)).flat()
    }
  }
}
