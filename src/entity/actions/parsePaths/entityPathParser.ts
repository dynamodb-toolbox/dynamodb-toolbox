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

/** Build a DynamoDB projection expression from attribute paths of an entity. */
export class EntityPathParser<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'parsePaths'
  /** Express paths that have already been transformed. */
  static express(paths: string[]): ProjectionExpression {
    return PathParser.express(paths)
  }

  [$pathParser]: PathParser<ENTITY['schema']>

  /** Bind the parser to an entity. */
  constructor(entity: ENTITY) {
    super(entity)
    this[$pathParser] = new PathParser(entity.schema)
  }

  /** Rename attribute paths to their saved names. */
  transform(paths: string[], options?: TransformPathsOptions): string[] {
    return this[$pathParser].transform(paths, options)
  }

  /** Turn attribute paths into a DynamoDB projection expression. */
  parse(attributes: string[], options?: ParsePathsOptions): ProjectionExpression {
    return this[$pathParser].parse(attributes, options)
  }
}

/** Union of the attribute paths of an entity. */
export type EntityPaths<ENTITY extends Entity = Entity> = Paths<ENTITY['schema']>

/** Union of the attribute paths of several entities. */
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
