---
title: Utilities
sidebar_custom_props:
  sidebarActionTitle: true
---

# Utilities

DynamoDB-Toolbox exposes the following _utility_ actions for `Tables`:

- [`Registry`](../9-registry/index.md): Serves as a single entry point for the Table's `Entities` and `AccessPatterns`
- [`PrimaryKeyParser`](../10-parse-primary-key/index.md): Given an input of any type, validates that it respects the Primary Key schema of the `Table`
- [`TableSpy`](../11-spy/index.md): Enables [spying](https://en.wikipedia.org/wiki/Mock_object) the provided `Table`
- [`TableRepository`](../12-repository/index.md): A utility action that exposes all table actions as **methods**
- [`TableDTO`](../13-dto/index.md): Builds a [Data Transfer Object](https://en.wikipedia.org/wiki/Data_transfer_object) of the provided `Table`
