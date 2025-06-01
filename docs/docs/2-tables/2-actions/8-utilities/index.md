---
title: Utilities
sidebar_custom_props:
  sidebarActionTitle: true
---

# Utilities

DynamoDB-Toolbox exposes the following _utility_ actions for `Tables`:

- [`PrimaryKeyParser`](../9-parse-primary-key/index.md): Given an input of any type, validates that it respects the Primary Key schema of the `Table`
- [`TableSpy`](../10-spy/index.md): Enables [spying](https://en.wikipedia.org/wiki/Mock_object) the provided `Table`
- [`TableRepository`](../11-repository/index.md): A utility action that exposes all table actions as **methods**
- [`TableDTO`](../12-dto/index.md): Builds a [Data Transfer Object](https://en.wikipedia.org/wiki/Data_transfer_object) of the provided `Table`
