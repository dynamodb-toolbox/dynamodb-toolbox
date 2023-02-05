import type { $value } from '../constants/attributeOptions'

import type { $ConstantAttribute, ConstantAttribute } from './interface'

export type $ResolveConstantAttribute<$ATTRIBUTE extends $ConstantAttribute> = $ATTRIBUTE[$value]

export type ResolveConstantAttribute<ATTRIBUTE extends ConstantAttribute> = ATTRIBUTE['value']
