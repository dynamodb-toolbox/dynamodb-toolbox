"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[58],{5052:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>m,frontMatter:()=>l,metadata:()=>i,toc:()=>h});var s=n(4848),a=n(8453),r=n(1470),o=n(9365);const l={title:"BatchGet",sidebar_custom_props:{sidebarActionType:"read"}},c="BatchGetCommand",i={id:"tables/actions/batch-get/index",title:"BatchGet",description:"Groups one or several BatchGetRequest from the Table entities to execute a BatchGetItem operation.",source:"@site/versioned_docs/version-v1/2-tables/2-actions/5-batch-get/index.md",sourceDirName:"2-tables/2-actions/5-batch-get",slug:"/tables/actions/batch-get/",permalink:"/docs/v1/tables/actions/batch-get/",draft:!1,unlisted:!1,tags:[],version:"v1",frontMatter:{title:"BatchGet",sidebar_custom_props:{sidebarActionType:"read"}},sidebar:"tutorialSidebar",previous:{title:"Batching",permalink:"/docs/v1/tables/actions/batching/"},next:{title:"BatchWrite",permalink:"/docs/v1/tables/actions/batch-write/"}},d={},h=[{value:"Request",id:"request",level:2},{value:"<code>.requests(...)</code>",id:"requests",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Examples",id:"examples",level:3},{value:"Execution",id:"execution",level:2},{value:"Options",id:"options-1",level:3},{value:"Examples",id:"examples-1",level:3},{value:"Response",id:"response",level:3}];function u(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"batchgetcommand",children:"BatchGetCommand"})}),"\n",(0,s.jsxs)(t.p,{children:["Groups one or several ",(0,s.jsx)(t.a,{href:"/docs/v1/entities/actions/batch-get/",children:(0,s.jsx)(t.code,{children:"BatchGetRequest"})})," from the ",(0,s.jsx)(t.code,{children:"Table"})," entities to execute a ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html",children:"BatchGetItem"})," operation."]}),"\n",(0,s.jsxs)(t.p,{children:["BatchGetItem operations can affect ",(0,s.jsx)(t.strong,{children:"multiple tables"}),", so ",(0,s.jsx)(t.code,{children:"BatchGetCommands"})," do not have a ",(0,s.jsx)(t.code,{children:".send(...)"})," method. Instead, they should be performed via the dedicated ",(0,s.jsx)(t.code,{children:"execute"})," function:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import {\n  BatchGetCommand,\n  execute\n} from 'dynamodb-toolbox/table/actions/batchGet'\nimport { BatchGetRequest } from 'dynamodb-toolbox/entity/actions/batchGet'\n\nconst pokeCmd = PokeTable.build(BatchGetCommand).requests(\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  PokemonEntity.build(BatchGetRequest).key(charizardKey)\n)\n\nconst params = pokeCmd.params()\n\nconst otherCmd = OtherTable.build(BatchGetCommand).requests(\n  TrainerEntity.build(BatchGetRequest).key(ashKey)\n)\n\nconst { Responses } = await execute(pokeCmd, otherCmd)\n\n// \ud83d\ude4c Correctly typed!\nconst [[pikachu, charizard], [ash]] = Responses\n"})}),"\n",(0,s.jsx)(t.admonition,{type:"note",children:(0,s.jsxs)(t.p,{children:["Note that batch operations are more efficient than running their equivalent commands in parallel, but ",(0,s.jsx)(t.strong,{children:"do not reduce costs"}),"."]})}),"\n",(0,s.jsx)(t.h2,{id:"request",children:"Request"}),"\n",(0,s.jsx)(t.h3,{id:"requests",children:(0,s.jsx)(t.code,{children:".requests(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:"(required)"})}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.a,{href:"/docs/v1/entities/actions/batch-get/",children:(0,s.jsx)(t.code,{children:"BatchGetRequests"})})," to execute."]}),"\n",(0,s.jsxs)(t.p,{children:["Note that the requests can be provided as ",(0,s.jsx)(t.strong,{children:"tuples"})," or ",(0,s.jsx)(t.strong,{children:"arrays"})," (the output is typed accordingly):"]}),"\n",(0,s.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(o.A,{value:"tuple",label:"Tuple",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const command = PokeTable.build(BatchGetCommand).requests(\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  PokemonEntity.build(BatchGetRequest).key(charizardKey),\n  ...\n)\n"})})}),(0,s.jsx)(o.A,{value:"array",label:"Array",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const requests: BatchGetRequest<typeof PokemonEntity>[] = [\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  PokemonEntity.build(BatchGetRequest).key(charizardKey),\n  ...\n]\n\nconst command =\n  PokeTable.build(BatchGetCommand).requests(...requests)\n"})})})]})}),"\n",(0,s.jsx)(t.h3,{id:"options",children:(0,s.jsx)(t.code,{children:".options(...)"})}),"\n",(0,s.jsxs)(t.p,{children:["Provides additional ",(0,s.jsx)(t.strong,{children:"table-level"})," options:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const command = PokeTable.build(BatchGetCommand).options({\n  consistent: true,\n  ...\n})\n"})}),"\n",(0,s.jsxs)(t.p,{children:["You can use the ",(0,s.jsx)(t.code,{children:"BatchGetCommandOptions"})," type to explicitly type an object as a ",(0,s.jsx)(t.code,{children:"BatchGetCommand"})," options object:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import type { BatchGetCommandOptions } from 'dynamodb-toolbox/table/actions/batchGet'\n\nconst batchGetOptions: BatchGetCommandOptions<\n  // \ud83d\udc47 Optional entities\n  [typeof PokemonEntity, typeof TrainerEntity]\n> = {\n  consistent: true,\n  ...\n}\n\nconst command = PokeTable.build(BatchGetCommand)\n  .requests(...)\n  .options(batchGetOptions)\n"})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["It is advised to provide ",(0,s.jsx)(t.code,{children:"requests"})," first as they constrain the ",(0,s.jsx)(t.code,{children:"options"})," type."]})}),"\n",(0,s.jsxs)(t.p,{children:["Available options (see the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html#API_BatchGetItem_RequestParameters",children:"DynamoDB documentation"})," for more details):"]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Option"}),(0,s.jsx)(t.th,{style:{textAlign:"center"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"center"},children:"Default"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"consistent"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"boolean"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"false"})}),(0,s.jsxs)(t.td,{children:["By default, read operations are ",(0,s.jsx)("b",{children:"eventually"})," consistent (which improves performances and reduces costs).",(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"Set to ",(0,s.jsx)(t.code,{children:"true"})," to use ",(0,s.jsx)("b",{children:"strongly"})," consistent reads."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"attributes"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"string[]"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,s.jsxs)(t.td,{children:["To specify a list of attributes to retrieve (improves performances but does not reduce costs).",(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"Requires ",(0,s.jsx)(t.a,{href:"#requests",children:"requests"}),". Paths must be common to all requested entities.",(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"See the ",(0,s.jsx)(t.a,{href:"/docs/v1/entities/actions/parse-paths/#paths",children:"PathParser"})," action for more details on how to write attribute paths."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"tableName"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,s.jsxs)(t.td,{children:["Overrides the ",(0,s.jsx)(t.code,{children:"Table"})," name. Mostly useful for ",(0,s.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Multitenancy",children:"multitenancy"}),"."]})]})]})]}),"\n",(0,s.jsx)(t.h3,{id:"examples",children:"Examples"}),"\n",(0,s.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(o.A,{value:"tuple",label:"Tuple",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const command = PokeTable.build(BatchGetCommand).requests(\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  PokemonEntity.build(BatchGetRequest).key(charizardKey),\n  ...\n)\n"})})}),(0,s.jsx)(o.A,{value:"array",label:"Array",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const requests: BatchGetRequest<typeof PokemonEntity>[] = [\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  PokemonEntity.build(BatchGetRequest).key(charizardKey),\n  ...\n]\n\nconst command =\n  PokeTable.build(BatchGetCommand).requests(...requests)\n"})})}),(0,s.jsx)(o.A,{value:"consistent",label:"Strongly consistent",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const command = PokeTable.build(BatchGetCommand)\n  .requests(...)\n  .options({\n    consistent: true\n  })\n"})})}),(0,s.jsx)(o.A,{value:"attributes",label:"Attributes",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const command = PokeTable.build(BatchGetCommand)\n  .requests(...)\n  .options({\n    attributes: ['name', 'type']\n  })\n"})})}),(0,s.jsx)(o.A,{value:"multitenant",label:"Multitenant",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const command = PokeTable.build(BatchGetCommand)\n  .requests(...)\n  .options({\n    tableName: `tenant-${tenantId}-pokemons`\n  })\n"})})})]})}),"\n",(0,s.jsx)(t.h2,{id:"execution",children:"Execution"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { execute } from 'dynamodb-toolbox/table/actions/batchGet'\n\nconst { Responses } = await execute(...batchGetCommands)\n"})}),"\n",(0,s.jsx)(t.admonition,{type:"warning",children:(0,s.jsxs)(t.p,{children:["Only one ",(0,s.jsx)(t.code,{children:"BatchGetCommand"})," per Table is supported."]})}),"\n",(0,s.jsxs)(t.p,{children:["Note that the commands can be provided as ",(0,s.jsx)(t.strong,{children:"tuples"})," or ",(0,s.jsx)(t.strong,{children:"arrays"})," (the output is typed accordingly):"]}),"\n",(0,s.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(o.A,{value:"tuple",label:"Tuple",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const { Response } = await execute(\n  PokeTable.build(BatchGetCommand).requests(...),\n  OtherTable.build(BatchGetCommand).requests(...),\n  ...\n)\n"})})}),(0,s.jsx)(o.A,{value:"array",label:"Array",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const commands: (\n  | BatchGetCommand<typeof PokeTable>\n  | BatchGetCommand<typeof OtherTable>\n)[] = [\n  PokeTable.build(BatchGetCommand).requests(...),\n  OtherTable.build(BatchGetCommand).requests(...)\n]\n\nconst { Response } = await execute(...commands)\n"})})})]})}),"\n",(0,s.jsx)(t.h3,{id:"options-1",children:"Options"}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.code,{children:"execute"})," function accepts an additional object as a first argument for ",(0,s.jsx)(t.strong,{children:"operation-level"})," options, as well as DocumentClient options such as ",(0,s.jsx)(t.a,{href:"https://github.com/aws/aws-sdk-js-v3?tab=readme-ov-file#abortcontroller-example",children:(0,s.jsx)(t.code,{children:"abortSignal"})}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"await execute(options, ...batchGetCommands)\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Available options (see the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html#API_BatchGetItem_RequestParameters",children:"DynamoDB documentation"})," for more details):"]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Option"}),(0,s.jsx)(t.th,{style:{textAlign:"center"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"center"},children:"Default"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"capacity"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"CapacityOption"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:'"NONE"'})}),(0,s.jsxs)(t.td,{children:["Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.",(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"Possible values are ",(0,s.jsx)(t.code,{children:'"NONE"'}),", ",(0,s.jsx)(t.code,{children:'"TOTAL"'})," and ",(0,s.jsx)(t.code,{children:'"INDEXES"'}),"."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"documentClient"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"DocumentClient"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,s.jsxs)(t.td,{children:["By default, the ",(0,s.jsx)(t.code,{children:"documentClient"})," attached to the ",(0,s.jsx)(t.code,{children:"Table"})," of the first ",(0,s.jsx)(t.code,{children:"BatchGetCommand"})," is used to execute the operation.",(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"Use this option to override this behavior."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"maxAttempts"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"integer \u2265 1"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"1"})}),(0,s.jsxs)(t.td,{children:['A "meta" option provided by DynamoDB-Toolbox to retry failed requests in a single promise.',(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"Note that ",(0,s.jsx)("code",{children:"Infinity"})," is a valid (albeit dangerous) option."]})]})]})]}),"\n",(0,s.jsx)(t.h3,{id:"examples-1",children:"Examples"}),"\n",(0,s.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(o.A,{value:"tuple",label:"Tuple",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const { Response } = await execute(\n  PokeTable.build(BatchGetCommand).requests(...),\n  OtherTable.build(BatchGetCommand).requests(...),\n  ...\n)\n"})})}),(0,s.jsx)(o.A,{value:"array",label:"Array",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const commands: (\n  | BatchGetCommand<typeof PokeTable>\n  | BatchGetCommand<typeof OtherTable>\n)[] = [\n  PokeTable.build(BatchGetCommand).requests(...),\n  OtherTable.build(BatchGetCommand).requests(...)\n]\n\nconst { Response } = await execute(...commands)\n"})})}),(0,s.jsx)(o.A,{value:"capacity",label:"Capacity",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const { ConsumedCapacity } = await execute(\n  { capacity: 'TOTAL' },\n  ...batchGetCommands\n)\n"})})}),(0,s.jsx)(o.A,{value:"document-client",label:"Document client",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'\n\nconst documentClient = new DynamoDBDocumentClient(...)\n\nconst { Response } = await execute(\n  { documentClient },\n  ...batchGetCommands\n)\n"})})}),(0,s.jsx)(o.A,{value:"retries",label:"Retries",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const { Response } = await execute(\n  { maxAttempts: 3 },\n  ...batchGetCommands\n)\n"})})}),(0,s.jsx)(o.A,{value:"aborted",label:"Aborted",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const abortController = new AbortController()\nconst abortSignal = abortController.signal\n\nconst { Response } = await execute(\n  { abortSignal },\n  ...batchGetCommands\n)\n\n// \ud83d\udc47 Aborts the command\nabortController.abort()\n"})})})]})}),"\n",(0,s.jsx)(t.h3,{id:"response",children:"Response"}),"\n",(0,s.jsxs)(t.p,{children:["The data is returned using the same response syntax as the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html#API_BatchGetItem_ResponseSyntax",children:"DynamoDB BatchGetItem API"}),", except for the ",(0,s.jsx)(t.code,{children:"Responses"})," property."]}),"\n",(0,s.jsxs)(t.p,{children:["Instead of a map of arrays indexed by table name, DynamoDB-Toolbox returns an ",(0,s.jsx)(t.strong,{children:"array of arrays"}),", where each sub-array contains the items of a ",(0,s.jsx)(t.code,{children:"BatchGetCommand"}),". Both commands and items are returned in the ",(0,s.jsx)(t.strong,{children:"same order they were provided"}),", and items are formatted by their respective entities."]}),"\n",(0,s.jsxs)(t.admonition,{type:"note",children:[(0,s.jsxs)(t.p,{children:["The official documentation states that ",(0,s.jsx)(t.em,{children:'"DynamoDB does not return items in any particular order"'}),", but DynamoDB-Toolbox ",(0,s.jsx)(t.strong,{children:"handles the re-ordering for you"})," \ud83d\ude18"]}),(0,s.jsx)(t.p,{children:"This format is also better for type inference, as DynamoDB-Toolbox does not statically know your table names."})]})]})}function m(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},9365:(e,t,n)=>{n.d(t,{A:()=>o});n(6540);var s=n(8215);const a={tabItem:"tabItem_Ymn6"};var r=n(4848);function o(e){let{children:t,hidden:n,className:o}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(a.tabItem,o),hidden:n,children:t})}},1470:(e,t,n)=>{n.d(t,{A:()=>B});var s=n(6540),a=n(8215),r=n(3104),o=n(6347),l=n(205),c=n(7485),i=n(1682),d=n(679);function h(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function u(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return h(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:a}}=e;return{value:t,label:n,attributes:s,default:a}}))}(n);return function(e){const t=(0,i.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function m(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function x(e){let{queryString:t=!1,groupId:n}=e;const a=(0,o.W6)(),r=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,c.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(a.location.search);t.set(r,e),a.replace({...a.location,search:t.toString()})}),[r,a])]}function p(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,r=u(e),[o,c]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:r}))),[i,h]=x({queryString:n,groupId:a}),[p,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,r]=(0,d.Dv)(n);return[a,(0,s.useCallback)((e=>{n&&r.set(e)}),[n,r])]}({groupId:a}),j=(()=>{const e=i??p;return m({value:e,tabValues:r})?e:null})();(0,l.A)((()=>{j&&c(j)}),[j]);return{selectedValue:o,selectValue:(0,s.useCallback)((e=>{if(!m({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);c(e),h(e),b(e)}),[h,b,r]),tabValues:r}}var b=n(2303);const j={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var y=n(4848);function f(e){let{className:t,block:n,selectedValue:s,selectValue:o,tabValues:l}=e;const c=[],{blockElementScrollPositionUntilNextRender:i}=(0,r.a_)(),d=e=>{const t=e.currentTarget,n=c.indexOf(t),a=l[n].value;a!==s&&(i(t),o(a))},h=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":n},t),children:l.map((e=>{let{value:t,label:n,attributes:r}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>c.push(e),onKeyDown:h,onClick:d,...r,className:(0,a.A)("tabs__item",j.tabItem,r?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function g(e){let{lazy:t,children:n,selectedValue:r}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:(0,a.A)("margin-top--md",e.props.className)}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function v(e){const t=p(e);return(0,y.jsxs)("div",{className:(0,a.A)("tabs-container",j.tabList),children:[(0,y.jsx)(f,{...t,...e}),(0,y.jsx)(g,{...t,...e})]})}function B(e){const t=(0,b.A)();return(0,y.jsx)(v,{...e,children:h(e.children)},String(t))}},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>l});var s=n(6540);const a={},r=s.createContext(a);function o(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);