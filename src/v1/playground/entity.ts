import { ComputedDefault, number, set, string, map, list, item } from 'v1/item'
import { EntityV2, PutItemInput, SavedItem, FormattedItem, KeyInput, PutItem } from 'v1/entity'

import { MyTable } from './table'

export const UserEntity = new EntityV2({
  name: 'User',
  table: MyTable,
  item: item({
    userId: string().key().required('always'),
    age: number().key().required('always').enum(41, 42).default(42).savedAs('sk'),
    firstName: string().required().savedAs('fn'),
    lastName: string().required().savedAs('ln'),
    parents: map({
      father: string().required(),
      mother: string().required()
    }),

    // Primitive
    completeName: string().required().default(ComputedDefault),

    // Maps
    defaultedMap: map({
      nestedCompleteName: string().required()
    }).default(ComputedDefault),

    defaultInMap: map({
      nestedCompleteName: string().required().default(ComputedDefault)
    }),

    bothDefaultsMap: map({
      nestedCompleteName: string().required().default(ComputedDefault)
    }).default(ComputedDefault),

    // List
    defaultedList: list(
      map({
        nestedCompleteName: string().required()
      }).required()
    ).default(ComputedDefault),

    defaultInList: list(
      map({
        nestedCompleteName: string().required().default(ComputedDefault)
      }).required()
    ),

    bothDefaultsList: list(
      map({
        nestedCompleteName: string().required().default(ComputedDefault)
      }).required()
    ).default(ComputedDefault)
  }),

  computedDefaults: {
    completeName: item => item.firstName + item.lastName,

    // MAPS
    defaultedMap: item => ({
      nestedCompleteName: item.firstName + item.lastName
    }),

    defaultInMap: {
      _attributes: {
        nestedCompleteName: (_map, item) => item.firstName + item.lastName
      }
    },

    bothDefaultsMap: {
      _attributes: {
        nestedCompleteName: (_map, item) => item.firstName + item.lastName
      },
      _map: item => ({ nestedCompleteName: item.firstName + item.lastName })
    },

    // LISTS
    defaultedList: item => [{ nestedCompleteName: item.firstName + item.lastName }],

    defaultInList: {
      _elements: {
        nestedCompleteName: (_el, _elIndex, item) => item.firstName + item.lastName
      }
    },

    bothDefaultsList: {
      _elements: {
        nestedCompleteName: (_el, _elIndex, item) => item.firstName + item.lastName
      },
      _list: item => [{ nestedCompleteName: item.firstName + item.lastName }]
    }
  }
})

type UserPutItemInput = PutItemInput<typeof UserEntity>
type SavedUser = SavedItem<typeof UserEntity>
type UserOutput = FormattedItem<typeof UserEntity>
type UserInputKeys = KeyInput<typeof UserEntity>
type UserPutItem = PutItem<typeof UserEntity>
