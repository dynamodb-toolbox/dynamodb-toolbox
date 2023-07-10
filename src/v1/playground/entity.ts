/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ComputedDefault,
  number,
  string,
  map,
  set,
  list,
  schema,
  EntityV2,
  PutItemInput,
  SavedItem,
  FormattedItem,
  KeyInput,
  UpdateItemInput
} from 'v1'

import { MyTable } from './table'

export const UserEntity = new EntityV2({
  name: 'User',
  table: MyTable,
  schema: schema({
    userId: string().key(),
    age: number().key().enum(41, 42).putDefault(42).savedAs('sk'),
    constant: string().const('toto').optional(),
    firstName: string().savedAs('fn'),
    lastName: string().savedAs('ln'),
    parents: map({
      father: string(),
      mother: string()
    }),

    someSet: set(string().enum('foo', 'bar')).optional(),

    // Primitive
    completeName: string().putDefault(ComputedDefault),

    // Maps
    defaultedMap: map({
      nestedCompleteName: string()
    })
      .optional()
      .putDefault(ComputedDefault),

    defaultInMap: map({
      nestedCompleteName: string().putDefault(ComputedDefault)
    }).optional(),

    bothDefaultsMap: map({
      nestedCompleteName: string().putDefault(ComputedDefault)
    })
      .optional()
      .putDefault(ComputedDefault),

    // List
    defaultedList: list(
      map({
        nestedCompleteName: string()
      })
    )
      .optional()
      .putDefault(ComputedDefault),

    defaultInList: list(
      map({
        nestedCompleteName: string().putDefault(ComputedDefault)
      })
    ).optional(),

    bothDefaultsList: list(
      map({
        nestedCompleteName: string().putDefault(ComputedDefault)
      })
    )
      .optional()
      .putDefault(ComputedDefault)
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
type UserUpdateItemInput = UpdateItemInput<typeof UserEntity>
