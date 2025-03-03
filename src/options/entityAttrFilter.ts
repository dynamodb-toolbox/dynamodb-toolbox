import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

export const parseEntityAttrFilterOption = (
  entityAttrFilter: boolean,
  entities: Entity[],
  filters: Record<string, Condition>
): boolean => {
  if (!isBoolean(entityAttrFilter)) {
    throw new DynamoDBToolboxError('options.invalidEntityAttrFilterOption', {
      message: `Invalid 'entityAttrFilter' option: '${String(
        entityAttrFilter
      )}'. 'entityAttrFilter' must be a boolean.`,
      payload: { entityAttrFilter }
    })
  }

  const entityWithoutEntityAttr = entities.find(entity => !entity.entityAttribute)
  if (entityAttrFilter && entityWithoutEntityAttr !== undefined) {
    throw new DynamoDBToolboxError('options.invalidEntityAttrFilterOption', {
      message: `Invalid 'entityAttrFilter' option: '${String(
        entityAttrFilter
      )}'. 'entityAttrFilter' cannot be true as ${entityWithoutEntityAttr.entityName} entity has no entity attribute.`,
      payload: { entityAttrFilter }
    })
  }

  const entitiesWithFilter = entities.filter(entity => filters[entity.entityName] !== undefined)
  if (!entityAttrFilter && entitiesWithFilter.length > 1) {
    throw new DynamoDBToolboxError('options.invalidEntityAttrFilterOption', {
      message: `Invalid 'entityAttrFilter' option: '${String(
        entityAttrFilter
      )}'. 'entityAttrFilter' must be true when applying multiple filters.`,
      payload: { entityAttrFilter }
    })
  }

  return entityAttrFilter
}
