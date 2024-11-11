"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5516],{8725:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>u});var s=n(4848),a=n(8453),r=n(1470),i=n(9365);const o={title:"TransactGet",sidebar_custom_props:{sidebarActionType:"read"}},c="GetTransaction",l={id:"entities/actions/transact-get/index",title:"TransactGet",description:"Builds a transaction to get an entity item, to be used within TransactGetItems operations.",source:"@site/docs/3-entities/4-actions/11-transact-get/index.md",sourceDirName:"3-entities/4-actions/11-transact-get",slug:"/entities/actions/transact-get/",permalink:"/docs/entities/actions/transact-get/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"TransactGet",sidebar_custom_props:{sidebarActionType:"read"}},sidebar:"tutorialSidebar",previous:{title:"Transactions",permalink:"/docs/entities/actions/transactions/"},next:{title:"TransactPut",permalink:"/docs/entities/actions/transact-put/"}},d={},u=[{value:"Request",id:"request",level:2},{value:"<code>.key(...)</code>",id:"key",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Execution",id:"execution",level:2},{value:"Options",id:"options-1",level:3},{value:"Response",id:"response",level:3}];function h(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"gettransaction",children:"GetTransaction"})}),"\n",(0,s.jsxs)(t.p,{children:["Builds a transaction to get an entity item, to be used within ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html",children:"TransactGetItems operations"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["BatchGetItem operations can affect ",(0,s.jsx)(t.strong,{children:"multiple items"}),", so ",(0,s.jsx)(t.code,{children:"GetTransactions"})," do not have a ",(0,s.jsx)(t.code,{children:".send(...)"})," method. Instead, they should be performed via the dedicated ",(0,s.jsx)(t.code,{children:"execute"})," function:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import {\n  GetTransaction,\n  execute\n} from 'dynamodb-toolbox/entity/actions/transactGet'\n\nconst pikachuTransac =\n  PokemonEntity.build(GetTransaction).key(pikachuKey)\n\nconst params = pikachuTransac.params()\n\nconst ashTransac =\n  TrainerEntity.build(GetTransaction).key(ashKey)\n\nconst { Responses } = await execute(\n  pikachuTransac,\n  ashTransac,\n  ...otherTransacs\n)\n\n// \ud83d\ude4c Correctly typed!\nconst [{ Item: pikachu }, { Item: ash }] = Responses\n"})}),"\n",(0,s.jsx)(t.h2,{id:"request",children:"Request"}),"\n",(0,s.jsx)(t.h3,{id:"key",children:(0,s.jsx)(t.code,{children:".key(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:"(required)"})}),"\n",(0,s.jsx)(t.p,{children:"The key of the item to get (i.e. attributes that are tagged as part of the primary key):"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const request = PokemonEntity.build(GetTransaction).key({\n  pokemonId: 'pikachu1'\n})\n"})}),"\n",(0,s.jsxs)(t.p,{children:["You can use the ",(0,s.jsx)(t.code,{children:"KeyInputItem"})," generic type to explicitly type an object as a ",(0,s.jsx)(t.code,{children:"GetTransaction"})," key object:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import type { KeyInputItem } from 'dynamodb-toolbox/entity'\n\nconst key: KeyInputItem<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1'\n}\n\nconst request =\n  PokemonEntity.build(BatchGetRequest).key(key)\n"})}),"\n",(0,s.jsx)(t.h3,{id:"options",children:(0,s.jsx)(t.code,{children:".options(...)"})}),"\n",(0,s.jsx)(t.p,{children:"Provides additional options:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:'const transaction = PokemonEntity.build(GetTransaction)\n  .key(...)\n  .options({\n    attributes: ["name", "level"]\n  })\n'})}),"\n",(0,s.jsxs)(t.p,{children:["You can use the ",(0,s.jsx)(t.code,{children:"GetTransactionOptions"})," type to explicitly type an object as a ",(0,s.jsx)(t.code,{children:"GetTransaction"})," options object:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import type { GetTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactGet'\n\nconst options: GetTransactionOptions<typeof PokemonEntity> =\n  { attributes: ['name', 'level'] }\n\nconst transaction = PokemonEntity.build(GetTransaction)\n  .key(...)\n  .options(options)\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Available options (see the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html#API_TransactGetItems_RequestParameters",children:"DynamoDB documentation"})," for more details):"]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Option"}),(0,s.jsx)(t.th,{style:{textAlign:"center"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"center"},children:"Default"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"attributes"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"Path<Entity>[]"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,s.jsxs)(t.td,{children:["To specify a list of attributes to retrieve (improves performances but does not reduce costs).",(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"See the ",(0,s.jsx)(t.a,{href:"/docs/entities/actions/parse-paths/#paths",children:(0,s.jsx)(t.code,{children:"PathParser"})})," action for more details on how to write attribute paths."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"tableName"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,s.jsxs)(t.td,{children:["Overrides the ",(0,s.jsx)(t.code,{children:"Table"})," name. Mostly useful for ",(0,s.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Multitenancy",children:"multitenancy"}),"."]})]})]})]}),"\n",(0,s.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(i.A,{value:"attributes",label:"Attributes",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const transaction = PokemonEntity.build(GetTransaction)\n  .key({ pokemonId: 'pikachu1' })\n  .options({\n    attributes: ['type', 'level']\n  })\n"})})}),(0,s.jsx)(i.A,{value:"multitenant",label:"Multitenant",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const transaction = PokemonEntity.build(GetTransaction)\n  .key({ pokemonId: 'pikachu1' })\n  .options({\n    tableName: `tenant-${tenantId}-pokemons`\n  })\n"})})})]})}),"\n",(0,s.jsx)(t.h2,{id:"execution",children:"Execution"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { execute } from 'dynamodb-toolbox/entity/actions/transactGet'\n\nawait execute(...getTransactions)\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Note that the transactions can be provided as ",(0,s.jsx)(t.strong,{children:"tuples"})," or ",(0,s.jsx)(t.strong,{children:"arrays"})," (the output is typed accordingly):"]}),"\n",(0,s.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(i.A,{value:"tuple",label:"Tuple",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"await execute(\n  PokemonEntity.build(GetTransaction).key(pikachuKey),\n  TrainerEntity.build(GetTransaction).key(ashKey),\n  ...\n)\n"})})}),(0,s.jsx)(i.A,{value:"array",label:"Array",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const commands: (\n  | GetTransaction<typeof PokemonEntity>\n  | GetTransaction<typeof TrainerEntity>\n)[] = [\n  PokemonEntity.build(GetTransaction).key(pikachuKey),\n  TrainerEntity.build(GetTransaction).key(ashKey),\n  ...\n]\n\nawait execute(...commands)\n"})})})]})}),"\n",(0,s.jsx)(t.h3,{id:"options-1",children:"Options"}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.code,{children:"execute"})," function accepts an additional object as a first argument for ",(0,s.jsx)(t.strong,{children:"operation-level"})," options, as well as DocumentClient options such as ",(0,s.jsx)(t.a,{href:"https://github.com/aws/aws-sdk-js-v3?tab=readme-ov-file#abortcontroller-example",children:(0,s.jsx)(t.code,{children:"abortSignal"})}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"await execute(options, ...batchGetCommands)\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Available options (see the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html#API_TransactGetItems_RequestParameters",children:"DynamoDB documentation"})," for more details):"]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Option"}),(0,s.jsx)(t.th,{style:{textAlign:"center"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"center"},children:"Default"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"capacity"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"CapacityOption"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:'"NONE"'})}),(0,s.jsxs)(t.td,{children:["Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.",(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"Possible values are ",(0,s.jsx)(t.code,{children:'"NONE"'}),", ",(0,s.jsx)(t.code,{children:'"TOTAL"'})," and ",(0,s.jsx)(t.code,{children:'"INDEXES"'}),"."]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"documentClient"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:(0,s.jsx)(t.code,{children:"DocumentClient"})}),(0,s.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,s.jsxs)(t.td,{children:["By default, the ",(0,s.jsx)(t.code,{children:"documentClient"})," attached to the ",(0,s.jsx)(t.code,{children:"Table"})," of the first ",(0,s.jsx)(t.code,{children:"GetTransaction"})," entity is used to execute the operation.",(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),"Use this option to override this behavior."]})]})]})]}),"\n",(0,s.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(i.A,{value:"capacity",label:"Capacity",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const { ConsumedCapacity } = await execute(\n  { capacity: 'TOTAL' },\n  ...getTransactions\n)\n"})})}),(0,s.jsx)(i.A,{value:"document-client",label:"Document client",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'\n\nconst documentClient = new DynamoDBDocumentClient(...)\n\nconst { Response } = await execute(\n  { documentClient },\n  ...getTransactions\n)\n"})})}),(0,s.jsx)(i.A,{value:"aborted",label:"Aborted",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const abortController = new AbortController()\nconst abortSignal = abortController.signal\n\nconst { Response } = await execute(\n  { abortSignal },\n  ...getTransactions\n)\n\n// \ud83d\udc47 Aborts the command\nabortController.abort()\n"})})})]})}),"\n",(0,s.jsx)(t.h3,{id:"response",children:"Response"}),"\n",(0,s.jsxs)(t.p,{children:["The data is returned using the same response syntax as the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html#API_TransactGetItems_ResponseSyntax",children:"DynamoDB TransactGetItems API"}),". If present, the returned items are formatted by their respective entities."]})]})}function p(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},9365:(e,t,n)=>{n.d(t,{A:()=>i});n(6540);var s=n(8215);const a={tabItem:"tabItem_Ymn6"};var r=n(4848);function i(e){let{children:t,hidden:n,className:i}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(a.tabItem,i),hidden:n,children:t})}},1470:(e,t,n)=>{n.d(t,{A:()=>T});var s=n(6540),a=n(8215),r=n(3104),i=n(6347),o=n(205),c=n(7485),l=n(1682),d=n(679);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:a}}=e;return{value:t,label:n,attributes:s,default:a}}))}(n);return function(e){const t=(0,l.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:n}=e;const a=(0,i.W6)(),r=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,c.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(a.location.search);t.set(r,e),a.replace({...a.location,search:t.toString()})}),[r,a])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,r=h(e),[i,c]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:r}))),[l,u]=m({queryString:n,groupId:a}),[x,j]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,r]=(0,d.Dv)(n);return[a,(0,s.useCallback)((e=>{n&&r.set(e)}),[n,r])]}({groupId:a}),b=(()=>{const e=l??x;return p({value:e,tabValues:r})?e:null})();(0,o.A)((()=>{b&&c(b)}),[b]);return{selectedValue:i,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);c(e),u(e),j(e)}),[u,j,r]),tabValues:r}}var j=n(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var y=n(4848);function f(e){let{className:t,block:n,selectedValue:s,selectValue:i,tabValues:o}=e;const c=[],{blockElementScrollPositionUntilNextRender:l}=(0,r.a_)(),d=e=>{const t=e.currentTarget,n=c.indexOf(t),a=o[n].value;a!==s&&(l(t),i(a))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":n},t),children:o.map((e=>{let{value:t,label:n,attributes:r}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>c.push(e),onKeyDown:u,onClick:d,...r,className:(0,a.A)("tabs__item",b.tabItem,r?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function g(e){let{lazy:t,children:n,selectedValue:r}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:(0,a.A)("margin-top--md",e.props.className)}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function v(e){const t=x(e);return(0,y.jsxs)("div",{className:(0,a.A)("tabs-container",b.tabList),children:[(0,y.jsx)(f,{...t,...e}),(0,y.jsx)(g,{...t,...e})]})}function T(e){const t=(0,j.A)();return(0,y.jsx)(v,{...e,children:u(e.children)},String(t))}},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>o});var s=n(6540);const a={},r=s.createContext(a);function i(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);