import { PutItemInput, EntityV2, PossiblyUndefinedResolvedAttribute } from 'v1'

import { PutCommandInputParser } from './types'
import { parseItemPutCommandInput } from './item'

export const parseEntityPutCommandInput: PutCommandInputParser<EntityV2> = <
  ENTITY extends EntityV2,
  PUT_ITEM_INPUT extends PutItemInput<ENTITY, true> = PutItemInput<ENTITY, true>
>(
  entity: ENTITY,
  putItemInput: PossiblyUndefinedResolvedAttribute
): PUT_ITEM_INPUT => parseItemPutCommandInput(entity.item, putItemInput)
