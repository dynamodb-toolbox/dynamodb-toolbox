import type { A } from 'ts-toolbelt'

import type { DefinedValuesKeys } from './definedValuesKeys'
import type { ObjectWithUndefinedValues } from './filterUndefinedValues.fixtures.test'

const assertDefinedValuesKeys: A.Equals<DefinedValuesKeys<ObjectWithUndefinedValues>, 'b' | 'c'> = 1
assertDefinedValuesKeys
