# Table Properties

The following properties are available on instances of the `Table` Class. Properties can be changed by directly setting the property value:

```javascript
MyTable.autoExecute = false
MyTable.autoParse = false
```

## DocumentClient

The `DocumentClient` property allows you to get a reference to the table's assigned `DocumentClient`, or to add/update the table's `DocumentClient`. When setting this property, it must be a valid instance of the AWS [DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html).

## entities

The `entities` property is used to add entities to the table. When adding entities, property accepts either an `array` of `Entity` instances, or a single `Entity` instance. This will add the entities to the table and create a table property with the same name as your entities `name`. For example, if an entity with the name `User` is assigned: `MyTable.entities = User`, then the Entity and its properties and methods will be accessible via `MyTable.User`.

The `entities` property will retrieve an `array` of `string`s containing all entity names attached to the table.

## autoExecute

This property will retrieve a `boolean` indicating the current `autoExecute` setting on the table. You can change this setting by supplying a `boolean` value.

## autoParse

This property will retrieve a `boolean` indicating the current `autoParse` setting on the table. You can change this setting by supplying a `boolean` value.
