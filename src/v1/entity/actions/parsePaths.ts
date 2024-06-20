import { PathParser, Paths } from 'v1/schema/actions/parsePaths/index.js'
import { EntityV2, EntityAction } from 'v1/entity/index.js'

const $pathParser = Symbol('$pathParser')
type $pathParser = typeof $pathParser

export class EntityPathParser<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName: 'parsePaths';
  [$pathParser]: PathParser<ENTITY['schema']>

  constructor(entity: ENTITY, id = '') {
    super(entity)
    this[$pathParser] = new PathParser(entity.schema, id)
  }

  setId(nextId: string): this {
    this[$pathParser].setId(nextId)
    return this
  }

  parse = (attributes: string[]): this => {
    this[$pathParser].parse(attributes)
    return this
  }

  toCommandOptions(): {
    ProjectionExpression: string
    ExpressionAttributeNames: Record<string, string>
  } {
    return this[$pathParser].toCommandOptions()
  }
}

export type EntityPaths<ENTITY extends EntityV2 = EntityV2> = Paths<ENTITY['schema']>

export type EntityPathsIntersection<
  ENTITIES extends EntityV2[] = EntityV2[],
  RESULTS extends string = string
> = ENTITIES extends [infer ENTITIES_HEAD, ...infer ENTITIES_TAIL]
  ? ENTITIES_HEAD extends EntityV2
    ? ENTITIES_TAIL extends EntityV2[]
      ? EntityPathsIntersection<ENTITIES_TAIL, RESULTS & EntityPaths<ENTITIES_HEAD>>
      : never
    : never
  : RESULTS
