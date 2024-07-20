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

:::info
Already have `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb` as part of your runtime and using a bundler? We recommend marking these dependencies as external to not have several copies of them
