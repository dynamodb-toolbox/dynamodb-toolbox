"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9386],{15680:(e,t,a)=>{a.d(t,{xA:()=>u,yg:()=>y});var n=a(96540);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),c=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},m="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=c(a),d=r,y=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return a?n.createElement(y,i(i({ref:t},u),{},{components:a})):n.createElement(y,i({ref:t},u))}));function y(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:r,i[1]=l;for(var c=2;c<o;c++)i[c]=a[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},19365:(e,t,a)=>{a.d(t,{A:()=>i});var n=a(96540),r=a(20053);const o={tabItem:"tabItem_Ymn6"};function i(e){let{children:t,hidden:a,className:i}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.A)(o.tabItem,i),hidden:a},t)}},11470:(e,t,a)=>{a.d(t,{A:()=>C});var n=a(58168),r=a(96540),o=a(20053),i=a(23104),l=a(56347),s=a(57485),c=a(31682),u=a(89466);function m(e){return function(e){return r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:a,attributes:n,default:r}}=e;return{value:t,label:a,attributes:n,default:r}}))}function p(e){const{values:t,children:a}=e;return(0,r.useMemo)((()=>{const e=t??m(a);return function(e){const t=(0,c.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function d(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function y(e){let{queryString:t=!1,groupId:a}=e;const n=(0,l.W6)(),o=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,s.aZ)(o),(0,r.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(n.location.search);t.set(o,e),n.replace({...n.location,search:t.toString()})}),[o,n])]}function g(e){const{defaultValue:t,queryString:a=!1,groupId:n}=e,o=p(e),[i,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!d({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=a.find((e=>e.default))??a[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:o}))),[s,c]=y({queryString:a,groupId:n}),[m,g]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,o]=(0,u.Dv)(a);return[n,(0,r.useCallback)((e=>{a&&o.set(e)}),[a,o])]}({groupId:n}),b=(()=>{const e=s??m;return d({value:e,tabValues:o})?e:null})();(0,r.useLayoutEffect)((()=>{b&&l(b)}),[b]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!d({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),c(e),g(e)}),[c,g,o]),tabValues:o}}var b=a(92303);const h={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function f(e){let{className:t,block:a,selectedValue:l,selectValue:s,tabValues:c}=e;const u=[],{blockElementScrollPositionUntilNextRender:m}=(0,i.a_)(),p=e=>{const t=e.currentTarget,a=u.indexOf(t),n=c[a].value;n!==l&&(m(t),s(n))},d=e=>{let t=null;switch(e.key){case"Enter":p(e);break;case"ArrowRight":{const a=u.indexOf(e.currentTarget)+1;t=u[a]??u[0];break}case"ArrowLeft":{const a=u.indexOf(e.currentTarget)-1;t=u[a]??u[u.length-1];break}}t?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":a},t)},c.map((e=>{let{value:t,label:a,attributes:i}=e;return r.createElement("li",(0,n.A)({role:"tab",tabIndex:l===t?0:-1,"aria-selected":l===t,key:t,ref:e=>u.push(e),onKeyDown:d,onClick:p},i,{className:(0,o.A)("tabs__item",h.tabItem,i?.className,{"tabs__item--active":l===t})}),a??t)})))}function N(e){let{lazy:t,children:a,selectedValue:n}=e;const o=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===n));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},o.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==n}))))}function v(e){const t=g(e);return r.createElement("div",{className:(0,o.A)("tabs-container",h.tabList)},r.createElement(f,(0,n.A)({},e,t)),r.createElement(N,(0,n.A)({},e,t)))}function C(e){const t=(0,b.A)();return r.createElement(v,(0,n.A)({key:String(t)},e))}},65639:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>y,frontMatter:()=>l,metadata:()=>c,toc:()=>m});var n=a(58168),r=(a(96540),a(15680)),o=a(11470),i=a(19365);const l={title:"BatchWrite",sidebar_custom_props:{sidebarActionType:"write"}},s="BatchWriteCommand",c={unversionedId:"tables/actions/batch-write/index",id:"tables/actions/batch-write/index",title:"BatchWrite",description:"Groups one or several BatchPutRequest and BatchDeleteRequest from the Table entities to execute a BatchWriteItem operation.",source:"@site/docs/2-tables/2-actions/5-batch-write/index.md",sourceDirName:"2-tables/2-actions/5-batch-write",slug:"/tables/actions/batch-write/",permalink:"/docs/tables/actions/batch-write/",draft:!1,tags:[],version:"current",frontMatter:{title:"BatchWrite",sidebar_custom_props:{sidebarActionType:"write"}},sidebar:"tutorialSidebar",previous:{title:"BatchGet",permalink:"/docs/tables/actions/batch-get/"},next:{title:"Utilities",permalink:"/docs/tables/actions/utilities/"}},u={},m=[{value:"Request",id:"request",level:2},{value:"<code>.requests(...)</code>",id:"requests",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Execution",id:"execution",level:2},{value:"Options",id:"options-1",level:3},{value:"Response",id:"response",level:3}],p={toc:m},d="wrapper";function y(e){let{components:t,...a}=e;return(0,r.yg)(d,(0,n.A)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"batchwritecommand"},"BatchWriteCommand"),(0,r.yg)("p",null,"Groups one or several ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/batch-put/"},(0,r.yg)("inlineCode",{parentName:"a"},"BatchPutRequest"))," and ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/batch-delete/"},(0,r.yg)("inlineCode",{parentName:"a"},"BatchDeleteRequest"))," from the ",(0,r.yg)("inlineCode",{parentName:"p"},"Table")," entities to execute a ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html"},"BatchWriteItem")," operation."),(0,r.yg)("p",null,"BatchWriteItem operations can affect ",(0,r.yg)("strong",{parentName:"p"},"multiple tables"),", so ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchWriteCommands")," do not have a ",(0,r.yg)("inlineCode",{parentName:"p"},".send(...)")," method. Instead, they should be performed via the dedicated ",(0,r.yg)("inlineCode",{parentName:"p"},"execute")," function:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  BatchWriteCommand,\n  execute\n} from 'dynamodb-toolbox/table/actions/batchWrite'\nimport { BatchPutRequest } from 'dynamodb-toolbox/entity/actions/batchPut'\nimport { BatchDeleteRequest } from 'dynamodb-toolbox/entity/actions/batchDelete'\n\nconst pokeCmd = PokeTable.build(BatchWriteCommand).requests(\n  PokemonEntity.build(BatchPutRequest).item(pikachu),\n  PokemonEntity.build(BatchPutRequest).item(charizard)\n)\n\nconst params = pokeCmd.params()\n\nconst ashCmd = OtherTable.build(BatchWriteCommand).requests(\n  TrainerEntity.build(BatchDeleteRequest).key(ashKey)\n)\n\nawait execute(pokeCmd, ashCmd)\n")),(0,r.yg)("admonition",{type:"note"},(0,r.yg)("p",{parentName:"admonition"},"Note that batch operations are more efficient than running their equivalent commands in parallel, but ",(0,r.yg)("strong",{parentName:"p"},"do not reduce costs"),".")),(0,r.yg)("h2",{id:"request"},"Request"),(0,r.yg)("h3",{id:"requests"},(0,r.yg)("inlineCode",{parentName:"h3"},".requests(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,"(required)")),(0,r.yg)("p",null,"The ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/batch-put/"},(0,r.yg)("inlineCode",{parentName:"a"},"BatchPutRequests"))," and ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/batch-delete/"},(0,r.yg)("inlineCode",{parentName:"a"},"BatchDeleteRequests"))," to execute."),(0,r.yg)("h3",{id:"options"},(0,r.yg)("inlineCode",{parentName:"h3"},".options(...)")),(0,r.yg)("p",null,"Provides additional ",(0,r.yg)("strong",{parentName:"p"},"table-level")," options:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const command = PokeTable.build(BatchWriteCommand).options({\n  ...\n})\n")),(0,r.yg)("p",null,"You can use the ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchWriteCommandOptions")," type to explicitly type an object as a ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchWriteCommand")," options object:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import type { BatchWriteCommandOptions } from 'dynamodb-toolbox/table/actions/batchWrite'\n\nconst batchWriteOptions: BatchWriteCommandOptions= {\n  ...\n}\n\nconst command = PokeTable.build(BatchWriteCommand)\n  .requests(...)\n  .options(batchWriteOptions)\n")),(0,r.yg)("p",null,"Available options:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Option"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"tableName")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"string")),(0,r.yg)("td",{parentName:"tr",align:"center"},"-"),(0,r.yg)("td",{parentName:"tr",align:null},"Overrides the ",(0,r.yg)("inlineCode",{parentName:"td"},"Table")," name. Mostly useful for ",(0,r.yg)("a",{parentName:"td",href:"https://en.wikipedia.org/wiki/Multitenancy"},"multitenancy"),".")))),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const command = PokeTable.build(BatchWriteCommand)\n  .requests(...)\n  .options({\n    tableName: `tenant-${tenantId}-pokemons`\n  })\n"))),(0,r.yg)("h2",{id:"execution"},"Execution"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { execute } from 'dynamodb-toolbox/table/actions/batchWrite'\n\nawait execute(...batchWriteCommands)\n")),(0,r.yg)("admonition",{type:"caution"},(0,r.yg)("p",{parentName:"admonition"},"Only one ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchWriteCommand")," per Table is supported.")),(0,r.yg)("h3",{id:"options-1"},"Options"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"execute")," function accepts an additional object as a first argument for ",(0,r.yg)("strong",{parentName:"p"},"operation-level")," options:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"await execute(options, ...batchWriteCommands)\n")),(0,r.yg)("p",null,"Available options (see the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html#API_BatchWriteItem_RequestParameters"},"DynamoDB documentation")," for more details):"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Option"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"capacity")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"CapacityOption")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},'"NONE"')),(0,r.yg)("td",{parentName:"tr",align:null},"Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.",(0,r.yg)("br",null),(0,r.yg)("br",null),"Possible values are ",(0,r.yg)("inlineCode",{parentName:"td"},'"NONE"'),", ",(0,r.yg)("inlineCode",{parentName:"td"},'"TOTAL"')," and ",(0,r.yg)("inlineCode",{parentName:"td"},'"INDEXES"'),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"metrics")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"MetricsOption")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},'"NONE"')),(0,r.yg)("td",{parentName:"tr",align:null},"Determines whether item collection metrics are returned.",(0,r.yg)("br",null),(0,r.yg)("br",null),"Possible values are ",(0,r.yg)("inlineCode",{parentName:"td"},'"NONE"')," and ",(0,r.yg)("inlineCode",{parentName:"td"},'"SIZE"'),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"documentClient")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"DocumentClient")),(0,r.yg)("td",{parentName:"tr",align:"center"},"-"),(0,r.yg)("td",{parentName:"tr",align:null},"By default, the ",(0,r.yg)("inlineCode",{parentName:"td"},"documentClient")," attached to the ",(0,r.yg)("inlineCode",{parentName:"td"},"Table")," of the first ",(0,r.yg)("inlineCode",{parentName:"td"},"BatchWriteCommand")," is used to execute the operation.",(0,r.yg)("br",null),(0,r.yg)("br",null),"Use this option to override this behavior.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"maxAttempts")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"integer \u2265 1")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"1")),(0,r.yg)("td",{parentName:"tr",align:null},'A "meta" option provided by DynamoDB-Toolbox to retry failed requests in a single promise.',(0,r.yg)("br",null),(0,r.yg)("br",null),"Note that ",(0,r.yg)("code",null,"Infinity")," is a valid (albeit dangerous) option.")))),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(o.A,{mdxType:"Tabs"},(0,r.yg)(i.A,{value:"capacity",label:"Capacity",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { ConsumedCapacity } = await execute(\n  { capacity: 'TOTAL' },\n  ...batchWriteCommands\n)\n"))),(0,r.yg)(i.A,{value:"metrics",label:"Metrics",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { ItemCollectionMetrics } = await execute(\n  { metrics: 'SIZE' },\n  ...batchWriteCommands\n)\n"))),(0,r.yg)(i.A,{value:"document-client",label:"Document client",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'\n\nconst documentClient = new DynamoDBDocumentClient(...)\n\nawait execute(\n  { documentClient },\n  ...batchWriteCommands\n)\n"))),(0,r.yg)(i.A,{value:"retries",label:"Retries",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { Response } = await execute(\n  { maxAttempts: 3 },\n  ...batchGetCommands\n)\n"))))),(0,r.yg)("h3",{id:"response"},"Response"),(0,r.yg)("p",null,"The data is returned using the same response syntax as the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html#API_BatchWriteItem_ResponseSyntax"},"DynamoDB BatchWriteItem API"),"."))}y.isMDXComponent=!0}}]);