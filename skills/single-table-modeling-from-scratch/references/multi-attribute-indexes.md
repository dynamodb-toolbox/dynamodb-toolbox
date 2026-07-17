# Multi-Attribute Indexes

Use this reference when a table or GSI uses `partitionKeys` or `sortKeys` instead of a single synthetic key attribute.

## Why this matters

Native multi-attribute keys let DynamoDB index existing domain attributes directly. That avoids:

- writing concatenated synthetic keys like `TOURNAMENT#WINTER2024#REGION#NA-EAST`
- parsing those keys back into domain fields later
- backfilling synthetic attributes across existing items just to add a new GSI

For agents, this is important because older DynamoDB advice often defaults to synthetic key strings even when the table design can now use multi-attribute GSIs directly.

## Define the index with natural attributes

```ts
const TournamentTable = new Table({
  name: 'TournamentMatches',
  documentClient,
  partitionKey: { name: 'matchId', type: 'string' },
  indexes: {
    TournamentRegionIndex: {
      type: 'global',
      partitionKeys: [
        { name: 'tournamentId', type: 'string' },
        { name: 'region', type: 'string' }
      ],
      sortKeys: [
        { name: 'round', type: 'string' },
        { name: 'bracket', type: 'string' },
        { name: 'matchId', type: 'string' }
      ]
    },
    PlayerMatchHistoryIndex: {
      type: 'global',
      partitionKey: { name: 'player1Id', type: 'string' },
      sortKeys: [
        { name: 'matchDate', type: 'string' },
        { name: 'round', type: 'string' }
      ]
    }
  }
})
```

Write items with normal attributes only:

```ts
await TournamentEntity.build(PutItemCommand)
  .item({
    matchId: 'match-002',
    tournamentId: 'WINTER2024',
    region: 'NA-EAST',
    round: 'SEMIFINALS',
    bracket: 'UPPER',
    player1Id: '101',
    matchDate: '2024-01-18'
  })
  .send()
```

No synthetic GSI key fields are needed.

## Query rules

### 1. Provide all partition-key components

For a multi-attribute partition key, every component must be present.

```ts
await TournamentTable.build(QueryCommand)
  .query({
    index: 'TournamentRegionIndex',
    partition: ['WINTER2024', 'NA-EAST']
  })
  .send()
```

Do not do this:

```ts
partition: ['WINTER2024']
```

### 2. Query sort keys left to right

Each array slot matches the next sort-key attribute in definition order.

```ts
range: ['SEMIFINALS']
range: ['SEMIFINALS', 'UPPER']
range: ['SEMIFINALS', 'UPPER', 'match-002']
```

Do not skip middle attributes:

```ts
range: ['SEMIFINALS', 'match-002']
```

That incorrectly skips `bracket`.

### 3. Put inequalities last

Comparison operators and `begins_with` can only appear on the final constrained sort-key attribute.

Valid:

```ts
range: [{ gte: 'QUARTERFINALS' }]
range: ['SEMIFINALS', { beginsWith: 'U' }]
range: ['SEMIFINALS', 'UPPER', { gte: 'match-002' }]
```

Invalid:

```ts
range: [{ gte: 'QUARTERFINALS' }, 'UPPER']
range: ['SEMIFINALS', { beginsWith: 'U' }, 'match-002']
```

## Modeling guidance

- Prefer multi-attribute GSIs when the access pattern naturally groups existing attributes.
- Order sort-key attributes from most general to most specific.
- Keep synthetic concatenation only for cases where the physical index truly requires a single encoded value.
- When adding a new multi-attribute GSI, prefer reusing existing domain attributes instead of inventing derived key fields.

## Good fits

- tournament + region, then round + bracket + matchId
- playerId, then matchDate + round
- seller + region, then orderDate + category + orderId
- company + division, then department + team + employeeId
- accountId, then year + month + day + transactionId
