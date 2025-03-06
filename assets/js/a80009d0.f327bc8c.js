"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9153],{3975:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>h});var a=n(4848),s=n(8453),r=n(1470),i=n(9365);const o={title:"TableRepository",sidebar_custom_props:{sidebarActionType:"util"}},l="TableRepository",c={id:"tables/actions/repository/index",title:"TableRepository",description:"A utility action that exposes all table actions as methods. Using it leads to heavier bundles (as it necessarily imports all of their code) but provides a more concise syntax:",source:"@site/versioned_docs/version-v1/2-tables/2-actions/10-repository/index.md",sourceDirName:"2-tables/2-actions/10-repository",slug:"/tables/actions/repository/",permalink:"/docs/v1/tables/actions/repository/",draft:!1,unlisted:!1,tags:[],version:"v1",frontMatter:{title:"TableRepository",sidebar_custom_props:{sidebarActionType:"util"}},sidebar:"tutorialSidebar",previous:{title:"Spy",permalink:"/docs/v1/tables/actions/spy/"},next:{title:"Usage",permalink:"/docs/v1/entities/usage/"}},d={},h=[{value:"Specifying entities",id:"specifying-entities",level:2},{value:"Methods",id:"methods",level:2},{value:"<code>scan(...)</code>",id:"scan",level:3},{value:"<code>query(...)</code>",id:"query",level:3},{value:"<code>deletePartition(...)</code>",id:"deletepartition",level:3},{value:"Batch Gets",id:"batch-gets",level:2},{value:"<code>batchGet(...)</code>",id:"batchget",level:3},{value:"<code>executeBatchGet(...)</code>",id:"executebatchget",level:3},{value:"Batch Writes",id:"batch-writes",level:2},{value:"<code>batchWrite(...)</code>",id:"batchwrite",level:3},{value:"<code>executeBatchWrite(...)</code>",id:"executebatchwrite",level:3},{value:"Utils",id:"utils",level:2},{value:"<code>parsePrimaryKey(...)</code>",id:"parseprimarykey",level:3}];function u(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",...(0,s.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"tablerepository",children:"TableRepository"})}),"\n",(0,a.jsxs)(t.p,{children:["A utility action that exposes all table actions as ",(0,a.jsx)(t.strong,{children:"methods"}),". Using it leads to heavier bundles (as it necessarily imports all of their code) but provides a more concise syntax:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"import { TableRepository } from 'dynamodb-toolbox/table/actions/repository'\n\nconst pokeTableRepository = PokeTable.build(TableRepository)\n\n// \ud83d\udc47 Sends a `ScanCommand`\nawait pokeTableRepository.scan()\n"})}),"\n",(0,a.jsx)(t.admonition,{type:"note",children:(0,a.jsxs)(t.p,{children:["Note that ",(0,a.jsx)(t.a,{href:"/docs/v1/tables/actions/spy/",children:(0,a.jsx)(t.code,{children:"Spies"})})," can still be used in cunjunction with ",(0,a.jsx)(t.code,{children:"Repositories"})," as commands are still sent under the hood."]})}),"\n",(0,a.jsx)(t.h2,{id:"specifying-entities",children:"Specifying entities"}),"\n",(0,a.jsx)(t.p,{children:"You can provide a list of entities to the repository. Those are then provided to all underlying actions:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const pokeTableRepository = PokeTable.build(TableRepository)\n  .entities(PokemonEntity, TrainerEntity, ...)\n\n// \ud83d\udc47 Typed as (Pokemon | Trainer | ...)[]\nconst { Items } = await pokeTableRepository.scan()\n"})}),"\n",(0,a.jsx)(t.h2,{id:"methods",children:"Methods"}),"\n",(0,a.jsx)(t.h3,{id:"scan",children:(0,a.jsx)(t.code,{children:"scan(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:(0,a.jsx)("code",{children:"(options?: OPTIONS) => ScanResponse<TABLE, ENTITIES, OPTIONS>"})})}),"\n",(0,a.jsxs)(t.p,{children:["Performs a ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html",children:"Scan Operation"}),". See ",(0,a.jsx)(t.a,{href:"/docs/v1/tables/actions/scan/",children:(0,a.jsx)(t.code,{children:"ScanCommand"})})," for more details:"]}),"\n",(0,a.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,a.jsxs)(r.A,{children:[(0,a.jsx)(i.A,{value:"usage",label:"Usage",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const { Items } = await pokeTableRepository.scan()\n"})})}),(0,a.jsx)(i.A,{value:"options",label:"Options",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const { Items } = await pokeTableRepository.scan({\n  consistent: true,\n  limit: 10\n})\n"})})})]})}),"\n",(0,a.jsx)(t.h3,{id:"query",children:(0,a.jsx)(t.code,{children:"query(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:(0,a.jsx)("code",{children:"(query: QUERY, options?: OPTIONS) => QueryResponse<TABLE, QUERY, ENTITIES, OPTIONS>"})})}),"\n",(0,a.jsxs)(t.p,{children:["Performs a ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html",children:"Query Operation"}),". See ",(0,a.jsx)(t.a,{href:"/docs/v1/tables/actions/query/",children:(0,a.jsx)(t.code,{children:"QueryCommand"})})," for more details:"]}),"\n",(0,a.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,a.jsxs)(r.A,{children:[(0,a.jsx)(i.A,{value:"usage",label:"Usage",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"// Get 'ashKetchum' pokemons\nconst { Items } = await pokeTableRepository.query({\n  partition: 'ashKetchum'\n})\n"})})}),(0,a.jsx)(i.A,{value:"index",label:"Index",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"// Get 'ashKetchum1' pokemons with a level \u2265 50\nconst { Items } = await pokeTableRepository.query({\n  partition: 'ashKetchum1',\n  index: 'byTrainerId',\n  range: { gte: 50 }\n})\n"})})}),(0,a.jsx)(i.A,{value:"options",label:"Options",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"// Consistently get less than 10 'ashKetchum' pokemons\nconst { Items } = await pokeTableRepository.query(\n  { partition: 'ashKetchum' },\n  { consistent: true, limit: 10 }\n)\n"})})})]})}),"\n",(0,a.jsx)(t.h3,{id:"deletepartition",children:(0,a.jsx)(t.code,{children:"deletePartition(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:(0,a.jsx)("code",{children:"(query: QUERY, options?: OPTIONS) => DeletePartitionResponse<TABLE, QUERY, OPTIONS>"})})}),"\n",(0,a.jsx)(t.admonition,{type:"warning",children:(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.code,{children:"DeletePartitionCommand"})," is exposed as a quality of life improvement, but is NOT an official DynamoDB operation (eventhough we wish it was)."]})}),"\n",(0,a.jsxs)(t.p,{children:["Performs a paginated ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html",children:"Query Operation"})," on a ",(0,a.jsx)(t.code,{children:"Table"})," and run subsequent ",(0,a.jsx)(t.a,{href:"/docs/v1/tables/actions/batch-write/",children:(0,a.jsx)(t.code,{children:"BatchWriteCommands"})})," to batch delete returned items. See ",(0,a.jsx)(t.a,{href:"/docs/v1/tables/actions/deletePartition/",children:(0,a.jsx)(t.code,{children:"DeletePartitionCommand"})})," for more details:"]}),"\n",(0,a.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,a.jsxs)(r.A,{children:[(0,a.jsx)(i.A,{value:"usage",label:"Usage",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"// Delete 'ashKetchum' pokemons\nawait pokeTableRepository.deletePartition({\n  partition: 'ashKetchum'\n})\n"})})}),(0,a.jsx)(i.A,{value:"index",label:"Index",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"// Delete 'ashKetchum1' pokemons with a level \u2265 50\nawait pokeTableRepository.deletePartition({\n  partition: 'ashKetchum1',\n  index: 'byTrainerId',\n  range: { gte: 50 }\n})\n"})})}),(0,a.jsx)(i.A,{value:"options",label:"Options",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"// Consistently delete less than 10 'ashKetchum' pokemons\nawait pokeTableRepository.deletePartition(\n  { partition: 'ashKetchum' },\n  { consistent: true, limit: 10 }\n)\n"})})})]})}),"\n",(0,a.jsx)(t.h2,{id:"batch-gets",children:"Batch Gets"}),"\n",(0,a.jsx)(t.h3,{id:"batchget",children:(0,a.jsx)(t.code,{children:"batchGet(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:(0,a.jsx)("code",{children:"(opt?: OPTIONS, ...req: REQUESTS) => BatchGetCommand<TABLE, ENTITIES, REQUESTS, OPTIONS>"})})}),"\n",(0,a.jsxs)(t.p,{children:["Groups one or several ",(0,a.jsx)(t.a,{href:"/docs/v1/entities/actions/batch-get/",children:(0,a.jsx)(t.code,{children:"BatchGetRequest"})})," from the ",(0,a.jsx)(t.code,{children:"Table"})," entities to execute a ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html",children:"BatchGetItem"})," operation. Additional options can be provided as a first argument. See ",(0,a.jsx)(t.a,{href:"/docs/v1/tables/actions/batch-get/",children:(0,a.jsx)(t.code,{children:"BatchGet"})})," for more details:"]}),"\n",(0,a.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,a.jsxs)(r.A,{children:[(0,a.jsx)(i.A,{value:"usage",label:"Usage",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const batchGetCommand = pokeTableRepository.batchGet(\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  TrainerEntity.build(BatchGetRequest).key(ashKetchumKey)\n)\n"})})}),(0,a.jsx)(i.A,{value:"entity",label:"Ent. Repository",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const batchGetCommand = pokeTableRepository.batchGet(\n  pokemonRepository.batchGet(pikachuKey),\n  trainerRepository.batchGet(ashKetchumKey)\n)\n"})})}),(0,a.jsx)(i.A,{value:"options",label:"Options",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const batchGetCommand = pokeTableRepository.batchGet(\n  { consistent: true },\n  pokemonRepository.batchGet(pikachuKey),\n  trainerRepository.batchGet(ashKetchumKey)\n)\n"})})})]})}),"\n",(0,a.jsx)(t.h3,{id:"executebatchget",children:(0,a.jsx)(t.code,{children:"executeBatchGet(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:(0,a.jsxs)("code",{children:[(0,a.jsx)("b",{children:"static"})," (opt?: OPTIONS, ...cmd: COMMANDS) => ExecuteBatchGetResponses<COMMANDS>"]})})}),"\n",(0,a.jsxs)(t.p,{children:["The ",(0,a.jsxs)(t.a,{href:"/docs/v1/tables/actions/batch-get/#execution",children:[(0,a.jsx)(t.code,{children:"BatchGetCommand"})," executor"]})," exposed as a ",(0,a.jsx)(t.strong,{children:"static"})," method:"]}),"\n",(0,a.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,a.jsxs)(r.A,{children:[(0,a.jsx)(i.A,{value:"usage",label:"Usage",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const { Responses } = await TableRepository.executeBatchGet(\n  // Only one `BatchGetCommand` per table is supported\n  pokeTableRepository.batchGet(...),\n  otherTableRepository.batchGet(...),\n)\n"})})}),(0,a.jsx)(i.A,{value:"options",label:"Options",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const { Responses } = await TableRepository.executeBatchGet(\n  { maxAttempts: Infinity },\n  // Only one `BatchGetCommand` per table is supported\n  pokeTableRepository.batchGet(...),\n  otherTableRepository.batchGet(...),\n)\n"})})})]})}),"\n",(0,a.jsx)(t.h2,{id:"batch-writes",children:"Batch Writes"}),"\n",(0,a.jsx)(t.h3,{id:"batchwrite",children:(0,a.jsx)(t.code,{children:"batchWrite(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:(0,a.jsx)("code",{children:"(opt?: OPTIONS, ...req: REQUESTS) => BatchWriteCommand<TABLE, ENTITIES, REQUESTS>"})})}),"\n",(0,a.jsxs)(t.p,{children:["Groups one or several ",(0,a.jsx)(t.a,{href:"/docs/v1/entities/actions/batch-put/",children:(0,a.jsx)(t.code,{children:"BatchPutRequest"})})," and ",(0,a.jsx)(t.a,{href:"/docs/v1/entities/actions/batch-delete/",children:(0,a.jsx)(t.code,{children:"BatchDeleteRequest"})})," from the ",(0,a.jsx)(t.code,{children:"Table"})," entities to execute a ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html",children:"BatchWriteItem"})," operation. Additional options can be provided as a first argument. See ",(0,a.jsx)(t.a,{href:"/docs/v1/tables/actions/batch-write/",children:(0,a.jsx)(t.code,{children:"BatchWrite"})})," for more details:"]}),"\n",(0,a.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,a.jsxs)(r.A,{children:[(0,a.jsx)(i.A,{value:"usage",label:"Usage",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const batchWriteCommand = pokeTableRepository.batchWrite(\n  PokemonEntity.build(BatchPutRequest).item(pikachu),\n  TrainerEntity.build(BatchPutRequest).item(ashKetchum)\n)\n"})})}),(0,a.jsx)(i.A,{value:"entity",label:"Ent. Repository",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const batchWriteCommand = pokeTableRepository.batchWrite(\n  pokemonRepository.batchPut(pikachu),\n  trainerRepository.batchPut(ashKetchum)\n)\n"})})}),(0,a.jsx)(i.A,{value:"options",label:"Options",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const batchWriteCommand = pokeTableRepository.batchWrite(\n  { tableName: `tenant-${tenantId}-pokemons` },\n  pokemonRepository.batchPut(pikachu),\n  trainerRepository.batchPut(ashKetchum)\n)\n"})})})]})}),"\n",(0,a.jsx)(t.h3,{id:"executebatchwrite",children:(0,a.jsx)(t.code,{children:"executeBatchWrite(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:(0,a.jsxs)("code",{children:[(0,a.jsx)("b",{children:"static"})," (opt?: OPTIONS, ...cmd: COMMANDS) => BatchWriteCommandOutput"]})})}),"\n",(0,a.jsxs)(t.p,{children:["The ",(0,a.jsxs)(t.a,{href:"/docs/v1/tables/actions/batch-write/#execution",children:[(0,a.jsx)(t.code,{children:"BatchWriteCommand"})," executor"]})," exposed as a ",(0,a.jsx)(t.strong,{children:"static"})," method:"]}),"\n",(0,a.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,a.jsxs)(r.A,{children:[(0,a.jsx)(i.A,{value:"usage",label:"Usage",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"await TableRepository.executeBatchWrite(\n  // Only one `BatchWriteCommand` per table is supported\n  pokeTableRepository.batchWrite(...),\n  otherTableRepository.batchWrite(...),\n)\n"})})}),(0,a.jsx)(i.A,{value:"options",label:"Options",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"await TableRepository.executeBatchWrite(\n  { maxAttempts: Infinity },\n  // Only one `BatchWriteCommand` per table is supported\n  pokeTableRepository.batchWrite(...),\n  otherTableRepository.batchWrite(...),\n)\n"})})})]})}),"\n",(0,a.jsx)(t.h2,{id:"utils",children:"Utils"}),"\n",(0,a.jsx)(t.h3,{id:"parseprimarykey",children:(0,a.jsx)(t.code,{children:"parsePrimaryKey(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:(0,a.jsx)("code",{children:"(input: unknown) => PrimaryKey<TABLE>"})})}),"\n",(0,a.jsxs)(t.p,{children:["Parses a ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey",children:"Primary Key"}),". See ",(0,a.jsx)(t.a,{href:"/docs/v1/tables/actions/parse-primary-key/",children:(0,a.jsx)(t.code,{children:"ParsePrimaryKey"})})," for more details:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const primaryKey = pokeTableRepository.parsePrimaryKey({\n  partitionKey: 'pikachu',\n  sortKey: 42,\n  foo: 'bar'\n})\n// \u2705 => { partitionKey: 'pikachu', sortKey: 42 }\n\npokeTableRepository.parsePrimaryKey({ invalid: 'input' })\n// \u274c Throws an error\n"})})]})}function p(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(u,{...e})}):u(e)}},9365:(e,t,n)=>{n.d(t,{A:()=>i});n(6540);var a=n(8215);const s={tabItem:"tabItem_Ymn6"};var r=n(4848);function i(e){let{children:t,hidden:n,className:i}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,a.A)(s.tabItem,i),hidden:n,children:t})}},1470:(e,t,n)=>{n.d(t,{A:()=>T});var a=n(6540),s=n(8215),r=n(3104),i=n(6347),o=n(205),l=n(7485),c=n(1682),d=n(679);function h(e){return a.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function u(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??function(e){return h(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:s}}=e;return{value:t,label:n,attributes:a,default:s}}))}(n);return function(e){const t=(0,c.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:n}=e;const s=(0,i.W6)(),r=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l.aZ)(r),(0,a.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(s.location.search);t.set(r,e),s.replace({...s.location,search:t.toString()})}),[r,s])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:s}=e,r=u(e),[i,l]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:r}))),[c,h]=m({queryString:n,groupId:s}),[x,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[s,r]=(0,d.Dv)(n);return[s,(0,a.useCallback)((e=>{n&&r.set(e)}),[n,r])]}({groupId:s}),y=(()=>{const e=c??x;return p({value:e,tabValues:r})?e:null})();(0,o.A)((()=>{y&&l(y)}),[y]);return{selectedValue:i,selectValue:(0,a.useCallback)((e=>{if(!p({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);l(e),h(e),b(e)}),[h,b,r]),tabValues:r}}var b=n(2303);const y={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=n(4848);function g(e){let{className:t,block:n,selectedValue:a,selectValue:i,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,r.a_)(),d=e=>{const t=e.currentTarget,n=l.indexOf(t),s=o[n].value;s!==a&&(c(t),i(s))},h=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=l.indexOf(e.currentTarget)+1;t=l[n]??l[0];break}case"ArrowLeft":{const n=l.indexOf(e.currentTarget)-1;t=l[n]??l[l.length-1];break}}t?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.A)("tabs",{"tabs--block":n},t),children:o.map((e=>{let{value:t,label:n,attributes:r}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:a===t?0:-1,"aria-selected":a===t,ref:e=>l.push(e),onKeyDown:h,onClick:d,...r,className:(0,s.A)("tabs__item",y.tabItem,r?.className,{"tabs__item--active":a===t}),children:n??t},t)}))})}function v(e){let{lazy:t,children:n,selectedValue:r}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===r));return e?(0,a.cloneElement)(e,{className:(0,s.A)("margin-top--md",e.props.className)}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function f(e){const t=x(e);return(0,j.jsxs)("div",{className:(0,s.A)("tabs-container",y.tabList),children:[(0,j.jsx)(g,{...t,...e}),(0,j.jsx)(v,{...t,...e})]})}function T(e){const t=(0,b.A)();return(0,j.jsx)(f,{...e,children:h(e.children)},String(t))}},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>o});var a=n(6540);const s={},r=a.createContext(s);function i(e){const t=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),a.createElement(r.Provider,{value:t},e.children)}}}]);