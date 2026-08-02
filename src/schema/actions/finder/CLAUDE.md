# `finder` — `Finder`

Locates the **sub-schema(s)** sitting at a given attribute path within a schema tree. A path can resolve to more than one sub-schema (e.g. through an `anyOf` union or a `record`), so results come back as a list of `SubSchema`.

```ts
const finder = schema.build(Finder)
const subSchemas = finder.search('friends[0].name')   // SubSchema[]
```

## Files

- `finder.ts` — `Finder` class (`actionName = 'finder'`) + `findSubSchemas(schema, arrayPath)` core walk.
- `subSchema.ts` — `SubSchema` wrapper (also a `SchemaAction`) pairing a resolved schema with its concrete path.

Underpins path/condition resolution where a path isn't statically single-typed. `@debt` note in source: path is not yet typed as `Path<SCHEMA>`.
