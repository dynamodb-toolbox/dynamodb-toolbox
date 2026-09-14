# `cdk` — `CDKTableV2`

Derives AWS CDK `TableV2` props (partition/sort keys, GSIs, LSIs, optional `tableName`) from a table, so the DynamoDB-Toolbox `Table` is the single source of truth for the CDK stack.

```ts
new TableV2(stack, 'PokeTable', {
  ...PokeTable.build(CDKTableV2).props(),   // CDKTableV2Props
  billing: Billing.onDemand()
})
```

## Files

- `cdk.ts` — `CDKTableV2` class (a `TableAction`); `CDKTableV2Options` / `CDKTableV2Props` types.

## Constraints

- `aws-cdk-lib` is imported **as types only** (`AttributeType` values are emitted as `'S' | 'N' | 'B'` literals, checked against the enum). The published JS never requires it, and it is **not** re-exported from `src/index.ts` nor added to `TableRepository`.
- 1-element GSI key arrays are collapsed to singular `partitionKey` / `sortKey` (plural props need `aws-cdk-lib` >= 2.226).
- Pure pass-through: no validation of the table definition (CDK / CloudFormation report their own errors).
