import {
  item,
  binary,
  boolean,
  number,
  string,
  map,
  list,
  ItemInput,
  ItemOutput,
  ComputedDefault,
  PreComputeDefaults,
  PostComputeDefaults,
  ItemSavedAs,
  ItemKeyInput
} from '.'

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
}).computeDefaults(preComp => {
  const equivalentMap = map(allCasesOfProps)
  type PreCompProps = PreComputeDefaults<typeof equivalentMap>
  type PostCompProps = PostComputeDefaults<typeof equivalentMap>

  const fillGaps = (preComp: PreCompProps): PostCompProps => ({
    ...preComp,
    optPropWithCompDef: preComp.optPropWithCompDef ?? 'baz',
    reqPropWithCompDef: preComp.reqPropWithCompDef ?? 'foo'
  })

  return {
    ...fillGaps(preComp),
    map: fillGaps(preComp.map),
    list: preComp.list.map(fillGaps)
  }
})

type PlaygroundItem2Input = ItemInput<typeof playgroundItem2>
type PlaygroundItem2Output = ItemOutput<typeof playgroundItem2>

const playgroundItem3 = item({
  keyEl: string().key().required(),
  nonKeyEl: string(),
  coucou: map({
    renamed: string().required().savedAs('bar').key()
  })
    .required()
    .savedAs('baz')
    .key()
})

type PlaygroundItem3SavedAs = ItemSavedAs<typeof playgroundItem3>
type PlaygroundItem3KeyInputs = ItemKeyInput<typeof playgroundItem3>
