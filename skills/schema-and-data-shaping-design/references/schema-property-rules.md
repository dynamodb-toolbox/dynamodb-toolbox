# Schema Property Rules

- `item` and `map` reject duplicate `savedAs` targets
- `list` and `set` elements cannot be optional, hidden, savedAs, or defaulted
- `record` keys cannot use key, optional, hidden, savedAs, or default props
- `anyOf` elements must remain compatible with the union rules enforced by source checks
- Run `.check(path)` on reusable schemas to surface invalid combinations early