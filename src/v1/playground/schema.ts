/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  binary,
  boolean,
  number,
  string,
  map,
  list,
  any,
  schema,
  PutItemInput,
  FormattedAttribute,
  SavedItem,
  KeyInput,
  anyOf,
  record
} from 'v1'

const playgroundSchema1 = schema({
  reqStr: string().key(),
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

const parsed = playgroundSchema1.parse('foo')

const parsed2 = list(string()).freeze('').parse('bar')

// TOTO: Prettify
const parsed3 = anyOf(list(string()), number(), map({ yo: string() }))
  .freeze('')
  .parse('baz')

const parsed4 = map({
  nestedMap: map({
    str: list(map({ l: list(string()).key() }))
      .key()
      .optional(),
    yoo: anyOf(list(string()), number(), map({ yo: string() })),
    rec: record(string(), record(string(), number()))
  })
    .optional()
    .key()
})
  .optional()
  .key()
  .freeze('')
  .parse('foobar')

type PlaygroundSchema1PutItemInput = PutItemInput<typeof playgroundSchema1>
type PlaygroundSchema1FormattedItem = FormattedAttribute<typeof playgroundSchema1>

const allCasesOfProps = {
  optProp: string().optional(),
  optPropWithIndepDef: string().optional().putDefault('foo'),
  reqProp: string(),
  reqPropWithIndepDef: string().putDefault('baz')
}

const playgroundSchema2 = schema({
  ...allCasesOfProps,
  map: map(allCasesOfProps),
  list: list(map(allCasesOfProps))
}).and(schema => ({
  optLink: string()
    .optional()
    .putLink<typeof schema>(({ optPropWithIndepDef }) => optPropWithIndepDef),
  reqLink: string().putLink<typeof schema>(({ reqPropWithIndepDef }) => reqPropWithIndepDef)
}))

type PlaygroundSchema2FormattedItem = FormattedAttribute<typeof playgroundSchema2>
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
