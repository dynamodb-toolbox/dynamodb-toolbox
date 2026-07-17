# Default and Link Modes

- `default(...)`: shorthand for `keyDefault` on key fields, otherwise `putDefault`
- `putDefault`: applied on put actions
- `updateDefault`: applied on update actions
- `keyDefault`: overrides other defaults on key schemas
- `link(...)`: shorthand for `keyLink` on key fields, otherwise `putLink`
- `putLink`: applied on put actions
- `updateLink`: applied on update actions and may receive extension syntax
- `keyLink`: overrides other link modes on key schemas