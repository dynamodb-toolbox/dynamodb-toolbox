---
title: Usage
---

# Entity

Entities represent a typology of data

An entity must belong to a Table, but the same Table can contain items from several entities. DynamoDB-Toolbox is designed with **Single Tables** in mind, but works just as well with multiple tables, it'll still make your life much easier (`batchGet` and `batchWrite` support multiple tables, so we've got you covered).
