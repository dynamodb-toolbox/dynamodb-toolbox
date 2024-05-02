---
title: Properties
---

# Entity Properties

The following properties are available on instances of the `Entity` Class. Certain properties can be changed by directly setting the property value. See below for a list of properties and their descriptions.

```javascript
MyEntity.autoExecute = false
MyEntity.autoParse = false
```

## table

Retrieves a reference to the Table instance that the Entity is attached to. You can use this property to add the Entity to a Table by assigning it a valid Table instance. Note that you **cannot change a table** once it has been assigned.

## DocumentClient

The `DocumentClient` property retrieves a reference to the table's assigned `DocumentClient`. This value **cannot** be updated by the Entity.

## autoExecute

This property will retrieve a `boolean` indicating the current `autoExecute` setting on the entity. If no value is set, it will return the inherited value from the attached table. You can change this setting for the current entity by supplying a `boolean` value.

## autoParse

This property will retrieve a `boolean` indicating the current `autoParse` setting on the entity. If no value is set, it will return the inherited value from the attached table. You can change this setting for the current entity by supplying a `boolean` value.

## partitionKey

Returns the Entity's assigned `partitionKey`. This value **cannot** be updated by the Entity.

## sortKey

Returns the Entity's assigned `sortKey`. This value **cannot** be updated by the Entity.
