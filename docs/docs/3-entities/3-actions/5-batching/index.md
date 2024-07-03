---
title: Batching
sidebar_custom_props:
  sidebarActionTitle: true
---

# Batching

DynamoDB-Toolbox exposes the following actions to perform batch operations:

- [`BatchGetRequest`](../6-batch-get/index.md): Builds a request to get an entity item, to be used within [`BatchGetCommands`](../../../2-tables/2-actions/4-batch-get/index.md)
- [`BatchPutRequest`](../7-batch-put/index.md): Builds a request to put an entity item, to be used within [`BatchWriteCommands`](../../../2-tables/2-actions/5-batch-write/index.md)
- [`BatchDeleteRequest`](../8-batch-delete/index.md): Builds a request to delete an entity item, to be used within [`BatchWriteCommands`](../../../2-tables/2-actions/5-batch-write/index.md)

See also the following table actions:

- [`BatchGetCommand`](../../../2-tables/2-actions/4-batch-get/index.md): Groups one or several `BatchGetRequests` from the `Table` entities to execute a [BatchGetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) operation
- [`BatchWriteCommand`](../../../2-tables/2-actions/5-batch-write/index.md): Groups one or several `BatchPutRequests` and `BatchDeleteRequests` from the `Table` entities to execute a [BatchWriteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) operation
