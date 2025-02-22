"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7302],{1591:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>d});var a=n(4848),i=n(8453);const s={title:"What is DynamoDB Toolbox?"},o="What is DynamoDB Toolbox?",r={id:"introduction/what-is-dynamodb-toolbox",title:"What is DynamoDB Toolbox?",description:"DynamoDB Toolbox is a set of tools that makes it easy to work with Amazon DynamoDB and the DocumentClient. It's designed with Single Tables in mind, but works just as well with multiple tables. It lets you define your Entities (with typings and aliases) and map them to your DynamoDB tables. You can then generate the API parameters to put, get, delete, update, query, scan, batchGet, and batchWrite data by passing in JavaScript objects. The DynamoDB Toolbox will map aliases, validate and coerce types, and even write complex UpdateExpressions for you. \ud83d\ude09",source:"@site/versioned_docs/version-v0.9/1-introduction/1-what-is-dynamodb-toolbox.md",sourceDirName:"1-introduction",slug:"/introduction/what-is-dynamodb-toolbox",permalink:"/docs/v0.9/introduction/what-is-dynamodb-toolbox",draft:!1,unlisted:!1,tags:[],version:"v0.9",sidebarPosition:1,frontMatter:{title:"What is DynamoDB Toolbox?"},sidebar:"tutorialSidebar",next:{title:"Quick Start",permalink:"/docs/v0.9/introduction/quick-start"}},l={},d=[{value:"This is NOT an ORM!",id:"this-is-not-an-orm",level:3},{value:"Features",id:"features",level:2},{value:"Conventions and Motivations",id:"conventions-and-motivations",level:2},{value:"Installation and Basic Usage",id:"installation-and-basic-usage",level:2},{value:"Install DynamoDB Toolbox",id:"install-dynamodb-toolbox",level:3},{value:"Define a Table",id:"define-a-table",level:3},{value:"Define an Entity",id:"define-an-entity",level:3},{value:"Put an item",id:"put-an-item",level:3},{value:"Get an Item",id:"get-an-item",level:3},{value:"Entity Type Inference",id:"entity-type-inference",level:3}];function c(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"what-is-dynamodb-toolbox",children:"What is DynamoDB Toolbox?"})}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.strong,{children:"DynamoDB Toolbox"})," is a set of tools that makes it easy to work with ",(0,a.jsx)(t.a,{href:"https://aws.amazon.com/dynamodb/",children:"Amazon DynamoDB"})," and the ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html",children:"DocumentClient"}),". It's designed with ",(0,a.jsx)(t.strong,{children:"Single Tables"})," in mind, but works just as well with multiple tables. It lets you define your Entities (with typings and aliases) and map them to your DynamoDB tables. You can then ",(0,a.jsx)(t.strong,{children:"generate the API parameters"})," to ",(0,a.jsx)(t.code,{children:"put"}),", ",(0,a.jsx)(t.code,{children:"get"}),", ",(0,a.jsx)(t.code,{children:"delete"}),", ",(0,a.jsx)(t.code,{children:"update"}),", ",(0,a.jsx)(t.code,{children:"query"}),", ",(0,a.jsx)(t.code,{children:"scan"}),", ",(0,a.jsx)(t.code,{children:"batchGet"}),", and ",(0,a.jsx)(t.code,{children:"batchWrite"})," data by passing in JavaScript objects. The DynamoDB Toolbox will map aliases, validate and coerce types, and even write complex ",(0,a.jsx)(t.code,{children:"UpdateExpression"}),"s for you. \ud83d\ude09"]}),"\n",(0,a.jsxs)(t.admonition,{title:"IMPORTANT",type:"info",children:[(0,a.jsx)(t.h3,{id:"this-is-not-an-orm",children:"This is NOT an ORM!"}),(0,a.jsxs)(t.p,{children:["There are several really good Object-Relational Mapping tools (ORMs) out there for DynamoDB. There's the ",(0,a.jsx)(t.a,{href:"https://github.com/awslabs/dynamodb-data-mapper-js",children:"Amazon DynamoDB DataMapper For JavaScript"}),", ",(0,a.jsx)(t.a,{href:"https://awspilot.dev/",children:"@Awspilot's DynamoDB"})," project, ",(0,a.jsx)(t.a,{href:"https://github.com/baseprime/dynamodb",children:"@baseprime's dynamodb"})," package, and many more."]}),(0,a.jsxs)(t.p,{children:["If you like working with ORMs, that's great, and you should definitely give these projects a look. But personally, I really dislike ORMs (especially ones for relational databases). I typically find them complex and likely to generate terribly inefficient queries (you know who you are). So this project is not an ORM, or at least it's not trying to be. This library helps you generate the necessary parameters needed to interact with the DynamoDB API by giving you a ",(0,a.jsx)(t.strong,{children:"consistent interface"})," and ",(0,a.jsx)(t.strong,{children:"handling all the heavy lifting"})," when working with the DynamoDB API. For convenience, this library will call the DynamoDB API for you and automatically parse the results, but you're welcome to just let it generate all (or just some) of the parameters for you. Hopefully this library will make the vast majority of your DynamoDB interactions super simple, and maybe even a little bit fun! \ud83d\ude0e"]})]}),"\n",(0,a.jsx)(t.h2,{id:"features",children:"Features"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Table Schemas and DynamoDB Typings:"})," Define your Table and Entity data models using a simple JavaScript object structure, assign DynamoDB data types, and optionally set defaults."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Magic UpdateExpressions:"})," Writing complex ",(0,a.jsx)(t.code,{children:"UpdateExpression"})," strings is a major pain, especially if the input data changes the underlying clauses or requires dynamic (or nested) attributes. This library handles everything from simple ",(0,a.jsx)(t.code,{children:"SET"})," clauses, to complex ",(0,a.jsx)(t.code,{children:"list"})," and ",(0,a.jsx)(t.code,{children:"set"})," manipulations, to defaulting values with smartly applied ",(0,a.jsx)(t.code,{children:"if_not_exists()"})," to avoid overwriting data."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Bidirectional Mapping and Aliasing:"})," When building a single table design, you can define multiple entities that map to the same table. Each entity can reuse fields (like ",(0,a.jsx)(t.code,{children:"pk"})," and",(0,a.jsx)(t.code,{children:"sk"}),") and map them to different aliases depending on the item type. Your data is automatically mapped correctly when reading and writing data."]}),"\n"]}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Type Coercion and Validation:"})," Automatically coerce values to strings, numbers and booleans to ensure consistent data types in your DynamoDB tables. Validate ",(0,a.jsx)(t.code,{children:"list"}),", ",(0,a.jsx)(t.code,{children:"map"}),", and ",(0,a.jsx)(t.code,{children:"set"})," types against your data. Oh yeah, and ",(0,a.jsx)(t.code,{children:"set"}),"s are automatically handled for you. \ud83d\ude09"]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Powerful Query Builder:"})," Specify a ",(0,a.jsx)(t.code,{children:"partitionKey"}),", and then easily configure your sortKey conditions, filters, and attribute projections to query your primary or secondary indexes. This library can even handle pagination with a simple ",(0,a.jsx)(t.code,{children:".next()"})," method."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Simple Table Scans:"})," Scan through your table or secondary indexes and add filters, projections, parallel scans and more. And don't forget the pagination support with ",(0,a.jsx)(t.code,{children:".next()"}),"."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Filter and Condition Expression Builder:"})," Build complex Filter and Condition expressions using a standardized ",(0,a.jsx)(t.code,{children:"array"})," and ",(0,a.jsx)(t.code,{children:"object"})," notation. No more appending strings!"]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Projection Builder:"})," Specify which attributes and paths should be returned for each entity type, and automatically filter the results."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Secondary Index Support:"})," Map your secondary indexes (GSIs and LSIs) to your table, and dynamically link your entity attributes."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Batch Operations:"})," Full support for batch operations with a simpler interface to work with multiple entities and tables."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Transactions:"})," Full support for transaction with a simpler interface to work with multiple entities and tables."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Default Value Dependency Graphs:"})," Create dynamic attribute defaults by chaining other dynamic attribute defaults together."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"TypeScript Support:"})," v0.4 of this library provides strong typing support AND type inference \ud83d\ude0d. Inferred type can still overriden with ",(0,a.jsx)(t.a,{href:"/docs/v0.9/type-inference/#overlays",children:"Overlays"}),". Some ",(0,a.jsx)(t.a,{href:"/docs/v0.9/type-inference/#utility-types",children:"Utility Types"})," are also exposed. Additional work is still required to support schema validation & typings."]}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"conventions-and-motivations",children:"Conventions and Motivations"}),"\n",(0,a.jsxs)(t.p,{children:["One of the most important goals of this library is to be as ",(0,a.jsx)(t.strong,{children:"unopinionated"}),' as possible, giving you the flexibility to bend it to your will and build amazing applications. But another important goal is developer efficiency and ease of use. In order to balance these two goals, some assumptions had to be made. These include the "default" behavior of the library (all of which, btw, can be disabled with a simple configuration change).']}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:[(0,a.jsxs)(t.strong,{children:[(0,a.jsx)(t.code,{children:"autoExecute"})," and ",(0,a.jsx)(t.code,{children:"autoParse"})," are enabled by default."]}),' The original version of this library only handled limited "parameter generation", so it was necessary for you to pass the payloads to the ',(0,a.jsx)(t.code,{children:"DocumentClient"}),". The library now provides support for all API options for each supported method, so by default, it will make the DynamoDB API call and parse the results, saving you redundant code. If you'd rather it didn't do this, you can disable it."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"It assumes a Single Table DynamoDB design."})," Watch the Rick Houlihan videos and read ",(0,a.jsx)(t.a,{href:"https://www.dynamodbbook.com",children:"Alex DeBrie's book"}),'. The jury is no longer out on this: Single Table designs are what all the cool kids are doing. This library assumes that you will have multiple "Entities" associated with a single "Table", so this requires you to instantiate a ',(0,a.jsx)(t.code,{children:"Table"})," and add at least one ",(0,a.jsx)(t.code,{children:"Entity"})," to it. If you have multiple ",(0,a.jsx)(t.code,{children:"Table"}),"s and just one ",(0,a.jsx)(t.code,{children:"Entity"})," type per ",(0,a.jsx)(t.code,{children:"Table"}),", that's fine, it'll still make your life much easier. Also, ",(0,a.jsx)(t.code,{children:"batchGet"})," and ",(0,a.jsx)(t.code,{children:"batchWrite"})," support multiple tables, so we've got you covered."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Entity Types are added to all items."}),' Since this library assumes a Single Table design, it needs a way to reliably distinguish between Entity types. It does this by adding an "Entity Type" attribute to each item in your table named ',(0,a.jsx)(t.code,{children:"_et"})," (short for \"Entity Type\"). Don't like this? Well, you can either disable it completely (but the library won't be able to parse entities into their aliases for you), or change the attribute name to something more snappy. It is purposefully short to minimize table storage (because item storage size includes the attribute names). Also, by default, Entities will alias this field to ",(0,a.jsx)(t.code,{children:"entity"})," (but you can change that too)."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Created and modified timestamps are enabled by default."})," I can't think of many instances where created and modified timestamps aren't used in database records, so the library automatically adds ",(0,a.jsx)(t.code,{children:"_ct"})," and ",(0,a.jsx)(t.code,{children:"_md"})," attributes when items are ",(0,a.jsx)(t.code,{children:"put"})," or ",(0,a.jsx)(t.code,{children:"update"}),"d. Again, these are kept purposefully short. You can disable them, change them, or even implement them yourself if you really want. By default, Entities will alias these attributes to ",(0,a.jsx)(t.code,{children:"created"})," and ",(0,a.jsx)(t.code,{children:"modified"})," (customizable, of course), and will automatically apply an ",(0,a.jsx)(t.code,{children:"if_not_exists()"})," on updates so that the ",(0,a.jsx)(t.code,{children:"created"})," date isn't overwritten."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Option names have been shortened using camelCase."})," Nothing against long and descriptive names, but typing ",(0,a.jsx)(t.code,{children:"ReturnConsumedCapacity"})," over and over again just seems like extra work. For simplification purposes, all API request parameters have been shortened to things like ",(0,a.jsx)(t.code,{children:"capacity"}),", ",(0,a.jsx)(t.code,{children:"consistent"})," and ",(0,a.jsx)(t.code,{children:"metrics"}),". The documentation shows which parameter they map to, but they should be intuitive enough to guess."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsxs)(t.strong,{children:["All configurations and options are plain JavaScript ",(0,a.jsx)(t.code,{children:"objects"}),"."]})," There are lots of JS libraries that use function chaining (like ",(0,a.jsx)(t.code,{children:"table.query('some pk value').condition('some condition').limit(50)"}),"). I really like this style for lots of use cases, but it ",(0,a.jsx)(t.strong,{children:"just feels wrong"})," to me when using DynamoDB. DynamoDB is the OG of cloud native databases. It's configured using IaC and its API is HTTP-based and uses structured JSON, so writing queries and other interactions using its native format just seems like the right thing to do. IMO, this makes your code more explicit and easier to reason about. Your ",(0,a.jsx)(t.code,{children:"options"})," could actually be stored as JSON and (unless you're using functions to define defaults on Entity attributes) your Table and Entity configurations could be too."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"API responses match the DynamoDB API responses."})," Something else I felt strongly about was the response signature returned by the library's methods. The DynamoDB Toolbox is a tool to help you interact with the DynamoDB API, ",(0,a.jsx)(t.strong,{children:"NOT a replacement for it"}),". ORMs typically trade ease of use with a tremendous amount of lock-in. But at the end of the day, it's just generating queries (and probably bad ones at that). DynamoDB Toolbox provides a number of helpful features to make constructing your API calls easier and more consistent, but the exact payload is always available to you. You can rip out this library whenever you want and just use the raw payloads if you really wanted to. This brings us to the responses. Other than aliasing the ",(0,a.jsx)(t.code,{children:"Items"})," and ",(0,a.jsx)(t.code,{children:"Attributes"})," returned from DynamoDB, the structure and format of the responses is the ",(0,a.jsx)(t.strong,{children:"exact same"})," (including any other meta data returned). This not only makes the library (kind of) future proof, but also allows you to reuse or repurpose any code or tools you've already written to deal with API responses."]}),"\n",(0,a.jsxs)(t.li,{children:[(0,a.jsx)(t.strong,{children:"Attributes with NULL values are removed (by default)."})," This was a hard one. I actually ran a ",(0,a.jsx)(t.a,{href:"https://twitter.com/jeremy_daly/status/1256259584819449856",children:"Twitter poll"})," to see how people felt about this, and although the reactions were mixed, ",(0,a.jsx)(t.em,{children:'"Remove the attributes"'})," came out on top. I can understand the use cases for ",(0,a.jsx)(t.code,{children:"NULL"}),"s, but since NoSQL database attribute names are part of the storage considerations, it seems more logical to simply check for the absence of an attribute, rather than a ",(0,a.jsx)(t.code,{children:"NULL"})," value. You may disagree with me, and that's cool. I've provided a ",(0,a.jsx)(t.code,{children:"removeNullAttributes"})," table setting that allows you to disable this and save ",(0,a.jsx)(t.code,{children:"NULL"})," attributes to your heart's content. I wouldn't, but the choice is yours."]}),"\n"]}),"\n",(0,a.jsx)(t.p,{children:"Hopefully these all make sense and will make working with the library easier."}),"\n",(0,a.jsx)(t.h2,{id:"installation-and-basic-usage",children:"Installation and Basic Usage"}),"\n",(0,a.jsx)(t.h3,{id:"install-dynamodb-toolbox",children:"Install DynamoDB Toolbox"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-bash",children:"# npm\nnpm i dynamodb-toolbox\n\n# yarn\nyarn add dynamodb-toolbox\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Require or import ",(0,a.jsx)(t.code,{children:"Table"})," and ",(0,a.jsx)(t.code,{children:"Entity"})," from ",(0,a.jsx)(t.code,{children:"dynamodb-toolbox"}),":"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-typescript",children:"import { Table, Entity } from 'dynamodb-toolbox'\n"})}),"\n",(0,a.jsx)(t.admonition,{title:"Please Note",type:"warning",children:(0,a.jsxs)(t.p,{children:["This library ",(0,a.jsx)(t.strong,{children:"DOES NOT"})," create DynamoDB Tables for you. You must create the tables yourself (either via the console or some form of Infrastructure as Code)."]})}),"\n",(0,a.jsx)(t.h3,{id:"define-a-table",children:"Define a Table"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-typescript",children:"// >=v0.8.0\nimport {\n  DynamoDB,\n  DynamoDBClient\n} from '@aws-sdk/client-dynamodb'\nimport { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'\n\nconst marshallOptions = {\n  // Specify your client options as usual\n  convertEmptyValues: false\n}\n\nconst translateConfig = { marshallOptions }\n\nexport const DocumentClient = DynamoDBDocumentClient.from(\n  new DynamoDBClient(),\n  translateConfig\n)\n\n// <v0.8.0\nimport DynamoDB from 'aws-sdk/clients/dynamodb'\n\nconst DocumentClient = new DynamoDB.DocumentClient({\n  // Specify your client options as usual\n  convertEmptyValues: false\n})\n\n// Instantiate a table\nconst MyTable = new Table({\n  // Specify table name (used by DynamoDB)\n  name: 'my-table',\n\n  // Define partition and sort keys\n  partitionKey: 'pk',\n  sortKey: 'sk',\n\n  // Add the DocumentClient\n  DocumentClient\n})\n"})}),"\n",(0,a.jsx)(t.h3,{id:"define-an-entity",children:"Define an Entity"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-typescript",children:"const Customer = new Entity({\n  // Specify entity name\n  name: 'Customer',\n\n  // Define attributes\n  attributes: {\n    id: { partitionKey: true }, // flag as partitionKey\n    sk: { hidden: true, sortKey: true }, // flag as sortKey and mark hidden\n    age: { type: 'number' }, // set the attribute type\n    name: { type: 'string', map: 'data' }, // map 'name' to table attribute 'data'\n    emailVerified: { type: 'boolean', required: true }, // specify attribute as required\n    co: { alias: 'company' }, // alias table attribute 'co' to 'company'\n    status: ['sk', 0], // composite key mapping\n    date_added: ['sk', 1] // composite key mapping\n  },\n\n  // Assign it to our table\n  table: MyTable\n\n  // In Typescript, the \"as const\" statement is needed for type inference\n} as const)\n"})}),"\n",(0,a.jsx)(t.h3,{id:"put-an-item",children:"Put an item"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-typescript",children:"// Create an item (using table attribute names or aliases)\nconst customer = {\n  id: 123,\n  age: 35,\n  name: 'Jane Smith',\n  emailVerified: true,\n  company: 'ACME',\n  status: 'active',\n  date_added: '2020-04-24'\n}\n\n// Use the 'put' method of Customer:\nawait Customer.put(customer)\n"})}),"\n",(0,a.jsx)(t.p,{children:"The item will be saved to DynamoDB like this:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-typescript",children:'{\n  "pk": 123,\n  "sk": "active#2020-04-24",\n  "age": 35,\n  "data": "Jane Smith",\n  "emailVerified": true,\n  "co": "ACME",\n  // Attributes auto-generated by DynamoDB-Toolbox\n  "_et": "customer", // Entity name (required for parsing)\n  "_ct": "2021-01-01T00:00:00.000Z", // Item creation date (optional)\n  "_md": "2021-01-01T00:00:00.000Z" // Item last modification date (optional)\n}\n'})}),"\n",(0,a.jsx)(t.h3,{id:"get-an-item",children:"Get an Item"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-typescript",children:"// Specify primary key\nconst primaryKey = {\n  id: 123,\n  status: 'active',\n  date_added: '2020-04-24'\n}\n\n// Use the 'get' method of Customer\nconst response = await Customer.get(primaryKey)\n"})}),"\n",(0,a.jsx)(t.h3,{id:"entity-type-inference",children:"Entity Type Inference"}),"\n",(0,a.jsx)(t.p,{children:"Since v0.4, the method inputs, options and response types are inferred from the Entity definition:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-typescript",children:"await Customer.put({\n  id: 123,\n  // \u274c Sort key is required (\"sk\" or both \"status\" and \"date_added\")\n  age: 35,\n  name: ['Jane', 'Smith'], // \u274c name should be a string\n  emailVerified: undefined, // \u274c attribute is marked as required\n  company: 'ACME'\n})\n\nconst { Item: customer } = await Customer.get({\n  id: 123,\n  status: 'active',\n  date_added: '2020-04-24' // \u2705 Valid primary key\n})\ntype Customer = typeof customer\n// \ud83d\ude4c Type is equal to:\ntype ExpectedCustomer =\n  | {\n      id: any\n      age?: number | undefined\n      name?: string | undefined\n      emailVerified: boolean\n      company?: any\n      status: any\n      date_added: any\n      entity: string\n      created: string\n      modified: string\n    }\n  | undefined\n"})})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>r});var a=n(6540);const i={},s=a.createContext(i);function o(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),a.createElement(s.Provider,{value:t},e.children)}}}]);