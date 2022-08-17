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
  ItemInput,
  ItemOutput,
  PreComputeDefaults,
  PostComputeDefaults,
  ItemSavedAs,
  ItemKeyInput,
  HasComputedDefaults
} from 'v1/item'

const playgroundItem1 = item({
  reqStr: string().required(),
  reqStrWithDef: string().required().default('string'),
  hiddenStr: string().hidden(),
  num: number(),
  bool: boolean(),
  bin: binary(),
  map: map({
    nestedMap: map({
      str: string()
    })
  }),
  reqMap: map({
    str: string()
  }).required(),
  hiddenMap: map({
    str: string()
  }).hidden(),
  reqList: list(
    map({
      str: string()
    }).required()
  ).required(),
  hiddenList: list(string().required()).hidden()
})

type PlaygroundItem1Input = ItemInput<typeof playgroundItem1>
type PlaygroundItem1Output = ItemOutput<typeof playgroundItem1>

const allCasesOfProps = {
  optProp: string(),
  optPropWithInitDef: string().default('foo'),
  optPropWithCompDef: string().default(ComputedDefault),
  reqProp: string().required(),
  reqPropWithInitDef: string().required().default('baz'),
  reqPropWithCompDef: string().required().default(ComputedDefault)
}

const playgroundItem2 = item({
  ...allCasesOfProps,
  map: map(allCasesOfProps).required(),
  list: list(map(allCasesOfProps).required()).required()
})

type PlaygroundItem2Input = ItemInput<typeof playgroundItem2>
type PlaygroundItem2Output = ItemOutput<typeof playgroundItem2>
type PlaygroundItem2HasComputedDefault = HasComputedDefaults<typeof playgroundItem2>
type PlaygroundItem2PreComputeDefaults = PreComputeDefaults<typeof playgroundItem2>
type PlaygroundItem2PostComputeDefaults = PostComputeDefaults<typeof playgroundItem2>

const playgroundItem3 = item({
  keyEl: string().key().required(),
  nonKeyEl: string(),
  coucou: map({
    renamed: string().required().savedAs('bar').key()
  })
    .required()
    .savedAs('baz')
    .key()
    .open(),
  anyvalue: any().required()
})

type PlaygroundItem3SavedAs = ItemSavedAs<typeof playgroundItem3>
type PlaygroundItem3KeyInput = ItemKeyInput<typeof playgroundItem3>
type PlaygroundItem3HasComputedDefault = HasComputedDefaults<typeof playgroundItem3>
