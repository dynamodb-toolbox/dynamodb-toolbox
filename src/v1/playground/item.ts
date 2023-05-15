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
  item,
  // constants
  ComputedDefault,
  // generics
  PutItemInput,
  FormattedAttribute,
  SavedItem,
  KeyInput,
  HasComputedDefaults
} from 'v1'

const playgroundItem1 = item({
  reqStr: string(),
  reqStrWithDef: string().default('string'),
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

type PlaygroundItem1PutItemInput = PutItemInput<typeof playgroundItem1>
type PlaygroundItem1FormattedItem = FormattedAttribute<typeof playgroundItem1>

const allCasesOfProps = {
  optProp: string().optional(),
  optPropWithHardDef: string().optional().default('foo'),
  optPropWithCompDef: string().optional().default(ComputedDefault),
  reqProp: string(),
  reqPropWithHardDef: string().default('baz'),
  reqPropWithCompDef: string().default(ComputedDefault)
}

const playgroundItem2 = item({
  ...allCasesOfProps,
  map: map(allCasesOfProps),
  list: list(map(allCasesOfProps))
})

type PlaygroundItem2FormattedItem = FormattedAttribute<typeof playgroundItem2>
type PlaygroundItem2HasComputedDefault = HasComputedDefaults<typeof playgroundItem3>
type PlaygroundItem2PutItemInput = PutItemInput<typeof playgroundItem2>
type PlaygroundItem2PutItemInputWithDefaults = PutItemInput<typeof playgroundItem2, true>

const playgroundItem3 = item({
  keyEl: string().key(),
  nonKeyEl: string().optional(),
  coucou: map({
    renamed: string().savedAs('bar').key()
  })
    .savedAs('baz')
    .key(),
  anyvalue: any()
})

type PlaygroundItem3SavedItem = SavedItem<typeof playgroundItem3>
type PlaygroundItem3KeyInput = KeyInput<typeof playgroundItem3>
type PlaygroundItem3HasComputedDefault = HasComputedDefaults<typeof playgroundItem3>
