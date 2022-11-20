"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[402],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>u});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),d=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=d(e.components);return a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=d(n),u=r,y=c["".concat(l,".").concat(u)]||c[u]||m[u]||i;return n?a.createElement(y,o(o({ref:t},p),{},{components:n})):a.createElement(y,o({ref:t},p))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=c;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var d=2;d<i;d++)o[d]=n[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},5778:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>d});var a=n(7462),r=(n(7294),n(3905));const i={},o="Quick Start",s={unversionedId:"introduction/quick-start",id:"introduction/quick-start",title:"Quick Start",description:"We're using aws-sdk v2 DynamoDB tools, the support for aws-sdk v3 is on its way.",source:"@site/docs/introduction/quick-start.md",sourceDirName:"introduction",slug:"/introduction/quick-start",permalink:"/docs/introduction/quick-start",draft:!1,editUrl:"https://github.com/jeremydaly/dynamodb-toolbox/tree/main/docs/docs/introduction/quick-start.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"What is DynamoDB Toolbox?",permalink:"/docs/"},next:{title:"Table",permalink:"/docs/table/"}},l={},d=[{value:"Install DynamoDB Toolbox",id:"install-dynamodb-toolbox",level:2},{value:"Add to your code",id:"add-to-your-code",level:2},{value:"Load the DocumentClient using aws-sdk v2",id:"load-the-documentclient-using-aws-sdk-v2",level:2},{value:"Define a Table",id:"define-a-table",level:2},{value:"Define an Entity",id:"define-an-entity",level:2},{value:"Put an item",id:"put-an-item",level:2},{value:"Get an Item",id:"get-an-item",level:2},{value:"Entity Type Inference",id:"entity-type-inference",level:2}],p={toc:d};function m(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"quick-start"},"Quick Start"),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"We're using ",(0,r.kt)("strong",{parentName:"p"},"aws-sdk v2")," DynamoDB tools, the support for ",(0,r.kt)("strong",{parentName:"p"},"aws-sdk v3")," is on its way. ",(0,r.kt)("br",null),"\nYou can read more about the development ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/jeremydaly/dynamodb-toolbox/pull/174"},"here"),"."))),(0,r.kt)("h2",{id:"install-dynamodb-toolbox"},"Install DynamoDB Toolbox"),(0,r.kt)("p",null,"Using your favorite package manager, install DynamoDB Toolbox and aws-sdk v2 in your project by running one of the following commands:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# npm\nnpm i dynamodb-toolbox\nnpm install aws-sdk\n\n# yarn\nyarn add dynamodb-toolbox\nyarn add aws-sdk\n\n")),(0,r.kt)("h2",{id:"add-to-your-code"},"Add to your code"),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"dynamodb-toolbox")," package exports ",(0,r.kt)("inlineCode",{parentName:"p"},"Table")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"Entity")," classes. Import or require them into your code as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="JavaScript"',title:'"JavaScript"'},"const { Table, Entity } = require('dynamodb-toolbox')\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="TypeScript"',title:'"TypeScript"'},"import { Table, Entity } from 'dynamodb-toolbox'\n")),(0,r.kt)("h2",{id:"load-the-documentclient-using-aws-sdk-v2"},"Load the DocumentClient using aws-sdk v2"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="TypeScript"',title:'"TypeScript"'},"import DynamoDB from 'aws-sdk/clients/dynamodb'\n\nconst DocumentClient = new DynamoDB.DocumentClient({\n  // Specify your client options as usual\n  convertEmptyValues: false\n})\n")),(0,r.kt)("h2",{id:"define-a-table"},"Define a Table"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"// Instantiate a table\nconst MyTable = new Table({\n  // Specify table name (used by DynamoDB)\n  name: 'my-table',\n\n  // Define partition and sort keys\n  partitionKey: 'pk',\n  sortKey: 'sk',\n\n  // Add the DocumentClient\n  DocumentClient\n})\n")),(0,r.kt)("h2",{id:"define-an-entity"},"Define an Entity"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"const Customer = new Entity({\n  // Specify entity name\n  name: 'Customer',\n\n  // Define attributes\n  attributes: {\n    id: { partitionKey: true }, // flag as partitionKey\n    sk: { hidden: true, sortKey: true }, // flag as sortKey and mark hidden\n    age: { type: 'number' }, // set the attribute type\n    name: { type: 'string', map: 'data' }, // map 'name' to table attribute 'data'\n    emailVerified: { type: 'boolean', required: true }, // specify attribute as required\n    co: { alias: 'company' }, // alias table attribute 'co' to 'company'\n    status: ['sk', 0], // composite key mapping\n    date_added: ['sk', 1] // composite key mapping\n  },\n\n  // Assign it to our table\n  table: MyTable\n\n  // In Typescript, the \"as const\" statement is needed for type inference\n} as const)\n")),(0,r.kt)("h2",{id:"put-an-item"},"Put an item"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"// Create an item (using table attribute names or aliases)\nconst customer = {\n  id: 123,\n  age: 35,\n  name: 'Jane Smith',\n  emailVerified: true,\n  company: 'ACME',\n  status: 'active',\n  date_added: '2020-04-24'\n}\n\n// Use the 'put' method of Customer:\nawait Customer.put(customer)\n")),(0,r.kt)("p",null,"The item will be saved to DynamoDB like this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},'{\n  "pk": 123,\n  "sk": "active#2020-04-24",\n  "age": 35,\n  "data": "Jane Smith",\n  "emailVerified": true,\n  "co": "ACME",\n  // Attributes auto-generated by DynamoDB-Toolbox\n  "_et": "customer", // Entity name (required for parsing)\n  "_ct": "2021-01-01T00:00:00.000Z", // Item creation date (optional)\n  "_md": "2021-01-01T00:00:00.000Z" // Item last modification date (optional)\n}\n')),(0,r.kt)("h2",{id:"get-an-item"},"Get an Item"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"// Specify primary key\nconst primaryKey = {\n  id: 123,\n  status: 'active',\n  date_added: '2020-04-24'\n}\n\n// Use the 'get' method of Customer\nconst response = await Customer.get(primaryKey)\n")),(0,r.kt)("h2",{id:"entity-type-inference"},"Entity Type Inference"),(0,r.kt)("p",null,"Since v0.4, the method inputs, options and response types are inferred from the Entity definition:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"await Customer.put({\n  id: 123,\n  // \u274c Sort key is required (\"sk\" or both \"status\" and \"date_added\")\n  age: 35,\n  name: ['Jane', 'Smith'], // \u274c name should be a string\n  emailVerified: undefined, // \u274c attribute is marked as required\n  company: 'ACME'\n})\n\nconst { Item: customer } = await Customer.get({\n  id: 123,\n  status: 'active',\n  date_added: '2020-04-24' // \u2705 Valid primary key\n})\ntype Customer = typeof customer\n// \ud83d\ude4c Type is equal to:\ntype ExpectedCustomer =\n  | {\n      id: any\n      age?: number | undefined\n      name?: string | undefined\n      emailVerified: boolean\n      company?: any\n      status: any\n      date_added: any\n      entity: string\n      created: string\n      modified: string\n    }\n  | undefined\n")))}m.isMDXComponent=!0}}]);