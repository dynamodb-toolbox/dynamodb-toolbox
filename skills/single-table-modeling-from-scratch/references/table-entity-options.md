# Table and Entity Options

- `Table.name`: required at send time; can be fixed string or getter
- `Table.documentClient`: required at send time unless command-level override exists
- `Table.entityAttributeSavedAs`: defaults to `_et`
- `Entity.entityAttribute`: defaults to enabled; hidden `entity`, saved as table `_et`
- `Entity.timestamps`: defaults to enabled; `created` saved as `_ct`, `modified` saved as `_md`
- `Entity.computeKey`: required when schema key attributes do not directly validate against the table key schema
- `Entity.name`: persisted identity in single-table setups; treat renames as migrations