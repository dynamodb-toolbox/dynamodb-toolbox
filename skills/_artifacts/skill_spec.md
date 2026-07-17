# DynamoDB-Toolbox - Skill Spec

DynamoDB-Toolbox is a framework-agnostic TypeScript library that sits on top of the AWS SDK DocumentClient and turns DynamoDB usage into an explicit modeling workflow. It does not replace DynamoDB architecture or infrastructure; it provides typed table, entity, schema, and action abstractions that make request construction, validation, and mixed-entity formatting more repeatable.

## Domains

| Domain | Description | Skills |
| ------ | ----------- | ------ |
| Bootstrapping and data modeling | Define the foundational table and entity model that later reads and writes depend on. | first-working-setup, single-table-modeling-from-scratch |
| Shaping and mutating data | Describe item structure and express write behavior without raw expressions. | schema-and-data-shaping-design, defaults-links-and-derived-attributes, basic-reads-and-writes, update-semantics-and-state-transitions |
| Reading and interpreting data | Build query and scan paths and safely interpret mixed-entity results. | queries-scans-and-access-patterns, mixed-entity-querying-and-formatting |
| Coordinating multi-item workflows | Orchestrate batches, transactions, repositories, and database-level entry points. | batch-and-transaction-orchestration, repositories-and-database-entry-points |
| Maintaining correctness over time | Use types, errors, migrations, and review heuristics to keep usage coherent as systems evolve. | typescript-integration-and-error-management, adopting-migrating-and-reviewing-toolbox-architecture |

## Skill Inventory

| Skill | Type | Domain | What it covers | Failure modes |
| ----- | ---- | ------ | -------------- | ------------- |
| First Working Setup | lifecycle | Bootstrapping and data modeling | install, peers, document client, first command, TS strictness | 3 |
| Single-Table Modeling From Scratch | core | Bootstrapping and data modeling | table and entity setup, internal entity/timestamp attrs, computeKey, indexes | 5 |
| Schema and Data-Shaping Design | core | Shaping and mutating data | item/map/list/set/record/anyOf schema rules | 3 |
| Defaults, Links, and Derived Attributes | core | Shaping and mutating data | put/update/key defaults, links, denormalized fields | 4 |
| Basic Reads and Writes | core | Shaping and mutating data | get/put/update/delete, required inputs, return values | 3 |
| Update Semantics and State Transitions | core | Shaping and mutating data | update DSL, nested writes, counters, references | 3 |
| Queries, Scans, and Access Patterns | core | Reading and interpreting data | QueryCommand, ScanCommand, access patterns, projections, pagination | 4 |
| Mixed-Entity Querying and Formatting | core | Reading and interpreting data | entityAttrFilter, noEntityMatchBehavior, formatter fallback | 4 |
| Batch and Transaction Orchestration | core | Coordinating multi-item workflows | batch execute helpers, transaction builders, idempotency | 4 |
| Repositories and Database Entry Points | core | Coordinating multi-item workflows | repositories, Registry, Database, bundle-size tradeoffs | 4 |
| TypeScript Integration and Error Management | core | Maintaining correctness over time | helper types, formatted vs saved shapes, typed Toolbox errors | 4 |
| Adopting, Migrating, and Reviewing Toolbox Architecture | lifecycle | Maintaining correctness over time | v1 to v2 migration, legacy API drift, architecture review | 3 |

## Failure Mode Inventory

### First Working Setup (3 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Sending commands without a document client | CRITICAL | src/table/table.ts | - |
| 2 | Omitting table name entirely | HIGH | src/table/table.ts; docs/docs/2-tables/1-usage/index.md | - |
| 3 | Using loose TypeScript settings | MEDIUM | docs/docs/1-getting-started/2-installation/index.md | typescript-integration-and-error-management |

### Single-Table Modeling From Scratch (5 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Disabling entity tagging in single-table flows | HIGH | docs/docs/3-entities/1-usage/index.md | mixed-entity-querying-and-formatting |
| 2 | Skipping computeKey when schema does not fit table keys | CRITICAL | src/entity/entity.ts | - |
| 3 | Renaming entity names after data exists | HIGH | docs/docs/3-entities/2-internal-attributes/index.md | adopting-migrating-and-reviewing-toolbox-architecture |
| 4 | Colliding with default internal attribute names | HIGH | docs/docs/3-entities/2-internal-attributes/index.md; src/entity/utils/buildEntitySchema/buildEntitySchema.ts | schema-and-data-shaping-design |
| 5 | String-concatenating multi-attribute index keys unnecessarily | MEDIUM | maintainer interview; docs/docs/2-tables/1-usage/index.md | queries-scans-and-access-patterns |

### Schema and Data-Shaping Design (3 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Creating duplicate savedAs names | HIGH | src/schema/item/schema.ts; src/schema/map/schema.ts | - |
| 2 | Treating list or set elements like full attributes | HIGH | src/schema/list/schema.ts; src/schema/set/schema.ts | - |
| 3 | Using record key schemas with DynamoDB-only props | MEDIUM | src/schema/record/schema.ts | - |

### Defaults, Links, and Derived Attributes (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Calling default before key on key attributes | HIGH | docs/docs/4-schemas/2-defaults-and-links/index.md | - |
| 2 | Forgetting to tag linked key fields with key() | CRITICAL | docs/docs/4-schemas/2-defaults-and-links/index.md | single-table-modeling-from-scratch |
| 3 | Assuming updateLink always receives plain values | HIGH | docs/docs/4-schemas/2-defaults-and-links/index.md | update-semantics-and-state-transitions |
| 4 | Not handling deleted attributes inside putLink or updateLink | HIGH | maintainer interview; docs/docs/4-schemas/2-defaults-and-links/index.md | update-semantics-and-state-transitions |

### Basic Reads and Writes (3 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Calling send before key or item is complete | HIGH | src/entity/actions/get/getItemCommand.ts and related sendable actions | batch-and-transaction-orchestration |
| 2 | Passing values that violate schema parsing on write | HIGH | docs/docs/6-error-management/index.md | typescript-integration-and-error-management |
| 3 | Assuming write builders return old/new item bodies by default | MEDIUM | docs/docs/3-entities/4-actions/4-update-item/index.md | - |

### Update Semantics and State Transitions (3 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Treating update extensions like read-before-write fetches | HIGH | docs/docs/3-entities/4-actions/4-update-item/index.md | - |
| 2 | Overwriting deep structures when a partial update is intended | MEDIUM | docs/docs/3-entities/4-actions/4-update-item/index.md | - |
| 3 | Using invalid attribute references in update extensions | HIGH | docs/docs/3-entities/4-actions/4-update-item/index.md; source extension validators | defaults-links-and-derived-attributes |

### Queries, Scans, and Access Patterns (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Building queries without a valid partition clause | CRITICAL | src/table/actions/query/queryParams/parseQuery.ts | - |
| 2 | Treating scans as a cheaper convenience query | MEDIUM | docs current guides and scan docs | architecture review |
| 3 | Using invalid projection shapes | MEDIUM | src/table/actions/query/queryParams/queryParams.ts | mixed-entity-querying-and-formatting |
| 4 | Using maxPages Infinity in normal app code | HIGH | maintainer interview; src/options/maxPages.ts | batch-and-transaction-orchestration |

### Mixed-Entity Querying and Formatting (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Combining multiple entity filters with entityAttrFilter false | CRITICAL | src/options/entityAttrFilter.ts | queries-scans-and-access-patterns |
| 2 | Expecting entityAttrFilter to work when entityAttribute is disabled | HIGH | src/options/entityAttrFilter.ts | single-table-modeling-from-scratch |
| 3 | Assuming unmatched items are silently discarded by default | HIGH | migration guide and query formatter | adopting-migrating-and-reviewing-toolbox-architecture |
| 4 | Assuming filters still apply once entities(...) is used | HIGH | maintainer interview | queries-scans-and-access-patterns |

### Batch and Transaction Orchestration (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Calling send on batch or transaction builders | CRITICAL | docs batch and transaction pages | basic-reads-and-writes |
| 2 | Placing two write transactions on the same item | HIGH | docs/docs/3-entities/4-actions/11-transactions/index.md | update-semantics-and-state-transitions |
| 3 | Selling batch APIs as a cost optimization | MEDIUM | docs batch pages | architecture review |
| 4 | Ignoring unprocessed items or partial batch success | CRITICAL | maintainer interview; batch docs | basic-reads-and-writes |

### Repositories and Database Entry Points (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Using Database in bundle-sensitive paths by default | MEDIUM | docs/docs/5-databases/1-usage/index.md | first-working-setup |
| 2 | Using repositories where precise tree-shaking matters | MEDIUM | getting started and repository docs | first-working-setup |
| 3 | Assuming Database replaces table and entity definitions | LOW | docs/docs/5-databases/1-usage/index.md | single-table-modeling-from-scratch |
| 4 | Jumping to Database without asking first | MEDIUM | maintainer interview; docs/docs/5-databases/1-usage/index.md | first-working-setup |

### TypeScript Integration and Error Management (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Using generic Error handling for Toolbox failures | HIGH | docs/docs/6-error-management/index.md | basic-reads-and-writes |
| 2 | Using the wrong instanceof guard shape | HIGH | maintainer interview; docs/docs/6-error-management/index.md | - |
| 3 | Typing against formatted or saved shapes interchangeably | MEDIUM | docs/docs/3-entities/2-internal-attributes/index.md | single-table-modeling-from-scratch |
| 4 | Manually declaring created and modified instead of using timestamps | HIGH | maintainer interview; docs/docs/3-entities/2-internal-attributes/index.md | single-table-modeling-from-scratch |

### Adopting, Migrating, and Reviewing Toolbox Architecture (3 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Using v1 schema freeze patterns in v2 | CRITICAL | docs/versioned_docs/version-v1/6-migration-guide/index.md | schema-and-data-shaping-design |
| 2 | Using old attr/schema naming conventions | HIGH | docs/versioned_docs/version-v1/6-migration-guide/index.md | first-working-setup |
| 3 | Using transformer parse/format names after rename | HIGH | docs/versioned_docs/version-v1/6-migration-guide/index.md | defaults-links-and-derived-attributes |

## Tensions

| Tension | Skills | Agent implication |
| ------- | ------ | ----------------- |
| Entity-tag flexibility versus mixed-read performance | single-table-modeling-from-scratch ↔ mixed-entity-querying-and-formatting | Agents may disable entity tags for convenience and silently degrade mixed-entity correctness and performance. |
| Repository convenience versus bundle discipline | repositories-and-database-entry-points ↔ first-working-setup | Agents may default to high-level APIs that are easy to explain but too heavy for production bundle-sensitive code. |
| Derived-field automation versus update clarity | defaults-links-and-derived-attributes ↔ update-semantics-and-state-transitions | Agents may over-automate derived updates and mishandle extension objects or hidden write semantics. |

## Cross-References

| From | To | Reason |
| ---- | -- | ------ |
| first-working-setup | single-table-modeling-from-scratch | Setup choices determine whether later single-table modeling remains coherent. |
| single-table-modeling-from-scratch | mixed-entity-querying-and-formatting | Entity tagging and key design control mixed-entity read behavior. |
| schema-and-data-shaping-design | defaults-links-and-derived-attributes | Defaults and links depend on schema rule correctness. |
| queries-scans-and-access-patterns | batch-and-transaction-orchestration | Read design often expands into multi-item orchestration decisions. |
| typescript-integration-and-error-management | adopting-migrating-and-reviewing-toolbox-architecture | Typed shapes and error codes make migration and review safer. |

## Subsystems & Reference Candidates

| Skill | Subsystems | Reference candidates |
| ----- | ---------- | ------------------- |
| first-working-setup | - | - |
| single-table-modeling-from-scratch | - | table and entity constructor options |
| schema-and-data-shaping-design | - | schema property rules |
| defaults-links-and-derived-attributes | - | default and link modes |
| basic-reads-and-writes | - | - |
| update-semantics-and-state-transitions | - | update extensions |
| queries-scans-and-access-patterns | - | query and scan options |
| mixed-entity-querying-and-formatting | - | - |
| batch-and-transaction-orchestration | - | - |
| repositories-and-database-entry-points | - | - |
| typescript-integration-and-error-management | - | - |
| adopting-migrating-and-reviewing-toolbox-architecture | - | - |

## Remaining Gaps

| Skill | Question | Status |
| ----- | -------- | ------ |
| adopting-migrating-and-reviewing-toolbox-architecture | Which other legacy patterns do agents still hallucinate most often? | open |

## Recommended Skill File Structure

- **Core skills:** first-working-setup, single-table-modeling-from-scratch, schema-and-data-shaping-design, defaults-links-and-derived-attributes, basic-reads-and-writes, update-semantics-and-state-transitions, queries-scans-and-access-patterns, mixed-entity-querying-and-formatting, batch-and-transaction-orchestration, repositories-and-database-entry-points, typescript-integration-and-error-management
- **Framework skills:** none
- **Lifecycle skills:** first-working-setup, adopting-migrating-and-reviewing-toolbox-architecture
- **Composition skills:** none at draft stage
- **Reference files:** update-semantics-and-state-transitions, schema-and-data-shaping-design, queries-scans-and-access-patterns, defaults-links-and-derived-attributes

## Composition Opportunities

| Library | Integration points | Composition skill needed? |
| ------- | ------------------ | ------------------------- |
| @aws-sdk/lib-dynamodb | DocumentClient ownership and send path execution | no |
| @aws-sdk/client-dynamodb | low-level client creation feeding DocumentClient.from | no |