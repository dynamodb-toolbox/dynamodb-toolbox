---
title: Batching
sidebar_custom_props:
  sidebarActionTitle: true
---

# Batching

DynamoDB-Toolbox exposes the following actions to perform batch operations on one or several `Tables`:

- [`BatchGetCommand`](../4-batch-get/index.md): Groups one or several [`BatchGetRequests`](../../../3-entities/3-actions/6-batch-get/index.md) from the `Table` entities to execute a [BatchGetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) operation
- [`BatchWriteCommand`](../5-batch-write/index.md): Groups one or several [`BatchPutRequests`](../../../3-entities/3-actions/7-batch-put/index.md) and [`BatchDeleteRequests`](../../../3-entities/3-actions/8-batch-delete/index.md) from the `Table` entities to execute a [BatchWriteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) operation
