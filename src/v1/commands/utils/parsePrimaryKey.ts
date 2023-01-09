import { EntityV2 } from 'v1/entity'
import { PossiblyUndefinedResolvedItem, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { PrimaryKey } from 'v1/table'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

export const parsePrimaryKey = <ENTITY extends EntityV2>(
  entity: ENTITY,
  keyInput: PossiblyUndefinedResolvedItem
): PrimaryKey<ENTITY['table']> => {
  const { table } = entity
  const { partitionKey, sortKey } = table

  const primaryKey: Record<string, PossiblyUndefinedResolvedAttribute> = {}

  const partitionKeyValidator = validatorsByPrimitiveType[partitionKey.type]
  const partitionKeyValue = keyInput[partitionKey.name]

  if (partitionKeyValidator(partitionKeyValue)) {
    primaryKey[partitionKey.name] = partitionKeyValue
  } else {
    // TODO
    throw new Error()
  }

  if (sortKey !== undefined) {
    const sortKeyValidator = validatorsByPrimitiveType[sortKey.type]
    const sortKeyValue = keyInput[sortKey.name]

    if (sortKeyValidator(sortKeyValue)) {
      primaryKey[sortKey.name] = sortKeyValue
    } else {
      // TODO
      throw new Error()
    }
  }

  return primaryKey as PrimaryKey<ENTITY['table']>
}
