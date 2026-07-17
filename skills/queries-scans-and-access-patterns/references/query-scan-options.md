# Query and Scan Options

- `attributes`: projection list validated against the selected entities or table shape
- `maxPages`: bound repeated query or scan pagination explicitly
- `limit`: page-size hint, not a global cost guard
- `index`: choose the table index path explicitly when needed
- `entityAttrFilter`: only relevant once entity-aware reads are involved