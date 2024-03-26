import type { Paths } from 'v1/schema/actions/paths'
import type { EntityV2 } from 'v1/entity'

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
