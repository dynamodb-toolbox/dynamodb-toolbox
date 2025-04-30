import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { PathParser } from '~/schema/actions/parsePaths/index.js'
import type {
  ParsePathsOptions,
  ProjectionExpression,
  TransformPathsOptions
} from '~/schema/actions/parsePaths/index.js'
import type { Paths } from '~/schema/index.js'

import { $pathParser } from './constants.js'

export class EntityPathParser<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'parsePaths'
  static express(paths: string[]): ProjectionExpression {
    return PathParser.express(paths)
  }

  [$pathParser]: PathParser<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$pathParser] = new PathParser(entity.schema)
  }

  transform(paths: string[], options?: TransformPathsOptions): string[] {
    return this[$pathParser].transform(paths, options)
  }

  parse(attributes: string[], options?: ParsePathsOptions): ProjectionExpression {
    return this[$pathParser].parse(attributes, options)
  }
}

export type EntityPaths<ENTITY extends Entity = Entity> = Paths<ENTITY['schema']>

export type EntityPathsUnion<
  ENTITIES extends Entity[] = Entity[],
  RESULTS extends string = never
> = ENTITIES extends [infer ENTITIES_HEAD, ...infer ENTITIES_TAIL]
  ? ENTITIES_HEAD extends Entity
    ? ENTITIES_TAIL extends Entity[]
      ? EntityPathsUnion<ENTITIES_TAIL, RESULTS | EntityPaths<ENTITIES_HEAD>>
      : never
    : never
  : RESULTS
