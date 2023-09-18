/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  // typers
  binary,
  boolean,
  number,
  string,
  map,
  list,
  any,
  schema,
  // constants
  ComputedDefault,
  // generics
  PutItemInput,
  FormattedAttribute,
  SavedItem,
  KeyInput,
  HasComputedDefaults
} from 'v1'

const playgroundSchema1 = schema({
  reqStr: string(),
  reqStrWithDef: string().putDefault('string'),
  hiddenStr: string().optional().hidden(),
  num: number().optional(),
  bool: boolean().optional(),
  bin: binary().optional(),
  map: map({
    nestedMap: map({
      str: string().optional()
    }).optional()
  }).optional(),
  reqMap: map({
    str: string().optional()
  }),
  hiddenMap: map({
    str: string().optional()
  })
    .optional()
    .hidden(),
  reqList: list(
    map({
      str: string().optional()
    })
  ),
  hiddenList: list(string()).optional().hidden()
})

type PlaygroundSchema1PutItemInput = PutItemInput<typeof playgroundSchema1>
type PlaygroundSchema1FormattedItem = FormattedAttribute<typeof playgroundSchema1>

const allCasesOfProps = {
  optProp: string().optional(),
  optPropWithIndepDef: string().optional().putDefault('foo'),
  optPropWithCompDef: string().optional().putDefault(ComputedDefault),
  reqProp: string(),
  reqPropWithIndepDef: string().putDefault('baz'),
  reqPropWithCompDef: string().putDefault(ComputedDefault)
}

const playgroundSchema2 = schema({
  ...allCasesOfProps,
  map: map(allCasesOfProps),
  list: list(map(allCasesOfProps))
})

type PlaygroundSchema2FormattedItem = FormattedAttribute<typeof playgroundSchema2>
type PlaygroundSchema2HasComputedDefault = HasComputedDefaults<typeof playgroundSchema3, 'put'>
type PlaygroundSchema2PutItemInput = PutItemInput<typeof playgroundSchema2>
type PlaygroundSchema2PutItemInputWithDefaults = PutItemInput<typeof playgroundSchema2, true>

const playgroundSchema3 = schema({
  keyEl: string().key(),
  nonKeyEl: string().optional(),
  coucou: map({
    renamed: string().savedAs('bar').key()
  })
    .savedAs('baz')
    .key(),
  anyvalue: any()
})

type PlaygroundSchema3SavedItem = SavedItem<typeof playgroundSchema3>
type PlaygroundSchema3KeyInput = KeyInput<typeof playgroundSchema3>
type PlaygroundSchema3HasComputedDefault = HasComputedDefaults<typeof playgroundSchema3, 'put'>
