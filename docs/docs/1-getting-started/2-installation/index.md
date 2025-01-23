---
title: Installation
---

# Installation

```bash
# npm
npm install dynamodb-toolbox

# pnpm
pnpm add dynamodb-toolbox

# yarn
yarn add dynamodb-toolbox
```

DynamoDB-Toolbox has `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb` as peer dependencies, so you have to install them as well:

```bash
# npm
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb

# pnpm
pnpm add @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb

# yarn
yarn add @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

:::note

If you use TypeScript, make sure to activate the [`strict`](https://www.typescriptlang.org/tsconfig/#strict) option in your `tsconfig.json` to avoid Type Inference issues.

:::
