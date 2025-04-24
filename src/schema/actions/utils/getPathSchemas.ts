import { Parser } from '~/schema/actions/parse/index.js'
import { AnySchema } from '~/schema/any/schema.js'
import type { Schema } from '~/schema/index.js'
import { isInteger } from '~/utils/validation/isInteger.js'

import { Path } from './path.js'
import type { ArrayPath } from './types.js'

export const getPathSchemas = (
  schema: Schema,
  path: ArrayPath
): { path: Path; schema: Schema }[] => {
  const [pathHead, ...pathTail] = path

  if (pathHead === undefined) {
    return [{ path: Path.fromArray([]), schema }]
  }

  switch (schema.type) {
    case 'any': {
      // Why Required never?
      return [{ path: Path.fromArray(path), schema: new AnySchema({ required: 'never' }) }]
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

      return getPathSchemas(schema.elements, pathTail).map(({ path, ...rest }) => ({
        path: path.prepend(Path.fromArray([parsedKey])),
        ...rest
      }))
    }
    case 'item':
    case 'map': {
      const childAttribute = schema.attributes[pathHead]
      if (!childAttribute) {
        return []
      }

      const transformedLocalPath = childAttribute.props.savedAs ?? pathHead

      return getPathSchemas(childAttribute, pathTail).map(({ path, ...rest }) => ({
        path: path.prepend(Path.fromArray([transformedLocalPath])),
        ...rest
      }))
    }
    case 'list': {
      if (!isInteger(pathHead)) {
        return []
      }

      return getPathSchemas(schema.elements, pathTail).map(({ path, ...rest }) => ({
        path: path.prepend(Path.fromArray([pathHead])),
        ...rest
      }))
    }
    case 'anyOf': {
      return schema.elements.map(element => getPathSchemas(element, path)).flat()
    }
  }
}
