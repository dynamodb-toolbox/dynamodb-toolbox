---
title: Utilities
sidebar_custom_props:
  sidebarActionTitle: true
---

# Utilities

DynamoDB-Toolbox exposes the following _utility_ actions for `Entities`:

- [`EntityParser`](../18-parse/index.md): Given an input of any type and a mode, validates that it respects the schema of the `Entity`
- [`ConditionParser`](../19-parse-condition/index.md): Builds a [Condition Expression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) that can be used to condition write operations, or filter the results of a [Query](../../../2-tables/2-actions/2-query/index.md) or a [Scan](../../../2-tables/2-actions/1-scan/index.md)
- [`PathParser`](../20-parse-paths/index.md): Builds a [Projection Expression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html) that can be used to filter the returned attributes of a read operation like a [GetItem](../1-get-item/index.md), [Query](/docs/tables/actions/query) or [Scan](/docs/tables/actions/scan)
- [`EntityFormatter`](../21-format/index.md): Given a saved item, validates that it respects the schema of the `Entity` and formats it
- [`EntitySpy`](../22-spy/index.md): Enables [spying](https://en.wikipedia.org/wiki/Mock_object) the provided `Entity`
- [`EntityRepository`](../23-repository/index.md): A utility action that exposes all entity actions as **methods**
- [`EntityDTO`](../24-dto/index.md): Builds a [Data Transfer Object](https://en.wikipedia.org/wiki/Data_transfer_object) of the provided `Entity`
