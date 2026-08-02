# `src/entity/actions` — Entity actions

Tree-shakable operations on an `Entity`, each a class extending `EntityAction` (`../entity.ts`), bound via `entity.build(ActionClass)`. Each has its own subpath export (`dynamodb-toolbox/entity/actions/<name>`).

```ts
const { Item } = await User.build(GetItemCommand).key({ id: '1' }).send()
```

## The actions

### Single-item commands (sendable)
| Folder | Export | DynamoDB op |
| --- | --- | --- |
| `get` | `GetItemCommand` | GetItem |
| `put` | `PutItemCommand` | PutItem |
| `update` | `UpdateItemCommand` | UpdateItem (with update extensions) |
| `updateAttributes` | `UpdateAttributesCommand` | UpdateItem (attribute-set semantics) |
| `delete` | `DeleteItemCommand` | DeleteItem |

### Batch requests (fed to a Table batch command)
| Folder | Export |
| --- | --- |
| `batchGet` | `BatchGetRequest` |
| `batchPut` | `BatchPutRequest` |
| `batchDelete` | `BatchDeleteRequest` |

These build request objects only; execution happens via `table/actions/batchGet` / `batchWrite`.

### Transactions
| Folder | Export | Role |
| --- | --- | --- |
| `transactGet` | `GetTransaction` + `execute` | read item in a TransactGetItems |
| `transactPut` | `PutTransaction` | write item in a TransactWriteItems |
| `transactUpdate` | `UpdateTransaction` | update item in a transaction |
| `transactDelete` | `DeleteTransaction` | delete item in a transaction |
| `transactCheck` | `ConditionCheck` | condition-only check in a transaction |
| `transactWrite` | `execute` | runs a TransactWriteItems from the above |

`execute` for `transactGet` / `transactWrite` is exported at the root as `executeTransactGet` / `executeTransactWrite`.

### Parsing / formatting
| Folder | Export | Purpose |
| --- | --- | --- |
| `parse` | `EntityParser` | validate + transform an input item (write path) |
| `format` | `EntityFormatter` | format a saved item (read path) |
| `parseCondition` | `EntityConditionParser` | build a `Condition` expression |
| `parsePaths` | `EntityPathParser` | build a projection from `EntityPaths` |

These wrap the corresponding **schema** actions, pre-bound to the entity's augmented schema.

### Other
| Folder | Export | Purpose |
| --- | --- | --- |
| `accessPattern` | `EntityAccessPattern` | reusable named access pattern |
| `spy` | `EntitySpy` | mock/inspect actions in tests |
| `repository` | `EntityRepository` | actions exposed as plain methods |
| `dto` | `EntityDTO` | serialize entity → JSON DTO |
| `fromDTO` | `fromEntityDTO` | rebuild entity from DTO |

## Anatomy of a command action

- `<name>ItemCommand.ts` — command class (sendable `EntityAction`).
- `options.ts` — command options (condition, returnValues, capacity, metrics, ...) paired with `src/options`.
- `<name>ItemParams/` — builds the raw AWS SDK input.
- `constants.ts`.

Each action folder has its own `CLAUDE.md`.
