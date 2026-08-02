# `jsonSchemer` — `JSONSchemer`

Converts a DDB-TB schema into a standard **JSON Schema** describing its *formatted* (read) value. Useful for OpenAPI specs, form generation, MCP tool schemas, etc.

```ts
const jsonSchema = schema.build(JSONSchemer).jsonSchema
```

## Files

- `jsonSchemer.ts` — `JSONSchemer` class (`actionName = 'jsonSchemer'`).
- `formattedValue/` — per-schema-type conversion producing `FormattedValueJSONSchema` (the exported output type).

Describes the formatted value, so it mirrors what `Formatter` returns (not the raw saved shape).
