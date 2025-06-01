---
title: Batching
sidebar_custom_props:
  sidebarActionTitle: true
---

# Batching

DynamoDB-Toolbox exposes the following actions to perform batch operations on one or several `Tables`:

- [`BatchGetCommand`](../6-batch-get/index.md): Groups one or several [`BatchGetRequests`](../../../3-entities/4-actions/8-batch-get/index.md) from the `Table` entities to execute a [BatchGetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) operation
- [`BatchWriteCommand`](../7-batch-write/index.md): Groups one or several [`BatchPutRequests`](../../../3-entities/4-actions/9-batch-put/index.md) and [`BatchDeleteRequests`](../../../3-entities/4-actions/10-batch-delete/index.md) from the `Table` entities to execute a [BatchWriteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) operation
