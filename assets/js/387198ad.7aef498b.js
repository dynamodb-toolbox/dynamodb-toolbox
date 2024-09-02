"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7574],{15680:(e,t,a)=>{a.d(t,{xA:()=>m,yg:()=>y});var n=a(96540);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),c=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},m=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),p=c(a),d=r,y=p["".concat(s,".").concat(d)]||p[d]||u[d]||o;return a?n.createElement(y,l(l({ref:t},m),{},{components:a})):n.createElement(y,l({ref:t},m))}));function y(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,l=new Array(o);l[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[p]="string"==typeof e?e:r,l[1]=i;for(var c=2;c<o;c++)l[c]=a[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},19365:(e,t,a)=>{a.d(t,{A:()=>l});var n=a(96540),r=a(20053);const o={tabItem:"tabItem_Ymn6"};function l(e){let{children:t,hidden:a,className:l}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.A)(o.tabItem,l),hidden:a},t)}},11470:(e,t,a)=>{a.d(t,{A:()=>C});var n=a(58168),r=a(96540),o=a(20053),l=a(23104),i=a(72681),s=a(57485),c=a(31682),m=a(89466);function p(e){return function(e){var t;return(null==(t=r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})))?void 0:t.filter(Boolean))??[]}(e).map((e=>{let{props:{value:t,label:a,attributes:n,default:r}}=e;return{value:t,label:a,attributes:n,default:r}}))}function u(e){const{values:t,children:a}=e;return(0,r.useMemo)((()=>{const e=t??p(a);return function(e){const t=(0,c.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function d(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function y(e){let{queryString:t=!1,groupId:a}=e;const n=(0,i.W6)(),o=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,s.aZ)(o),(0,r.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(n.location.search);t.set(o,e),n.replace({...n.location,search:t.toString()})}),[o,n])]}function g(e){const{defaultValue:t,queryString:a=!1,groupId:n}=e,o=u(e),[l,i]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!d({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=a.find((e=>e.default))??a[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:o}))),[s,c]=y({queryString:a,groupId:n}),[p,g]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,o]=(0,m.Dv)(a);return[n,(0,r.useCallback)((e=>{a&&o.set(e)}),[a,o])]}({groupId:n}),b=(()=>{const e=s??p;return d({value:e,tabValues:o})?e:null})();(0,r.useLayoutEffect)((()=>{b&&i(b)}),[b]);return{selectedValue:l,selectValue:(0,r.useCallback)((e=>{if(!d({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);i(e),c(e),g(e)}),[c,g,o]),tabValues:o}}var b=a(92303);const h={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function f(e){let{className:t,block:a,selectedValue:i,selectValue:s,tabValues:c}=e;const m=[],{blockElementScrollPositionUntilNextRender:p}=(0,l.a_)(),u=e=>{const t=e.currentTarget,a=m.indexOf(t),n=c[a].value;n!==i&&(p(t),s(n))},d=e=>{var t;let a=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const t=m.indexOf(e.currentTarget)+1;a=m[t]??m[0];break}case"ArrowLeft":{const t=m.indexOf(e.currentTarget)-1;a=m[t]??m[m.length-1];break}}null==(t=a)||t.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":a},t)},c.map((e=>{let{value:t,label:a,attributes:l}=e;return r.createElement("li",(0,n.A)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:e=>m.push(e),onKeyDown:d,onClick:u},l,{className:(0,o.A)("tabs__item",h.tabItem,null==l?void 0:l.className,{"tabs__item--active":i===t})}),a??t)})))}function N(e){let{lazy:t,children:a,selectedValue:n}=e;const o=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===n));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},o.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==n}))))}function v(e){const t=g(e);return r.createElement("div",{className:(0,o.A)("tabs-container",h.tabList)},r.createElement(f,(0,n.A)({},e,t)),r.createElement(N,(0,n.A)({},e,t)))}function C(e){const t=(0,b.A)();return r.createElement(v,(0,n.A)({key:String(t)},e))}},94299:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>s,default:()=>y,frontMatter:()=>i,metadata:()=>c,toc:()=>p});var n=a(58168),r=(a(96540),a(15680)),o=a(11470),l=a(19365);const i={title:"BatchGet",sidebar_custom_props:{sidebarActionType:"read"}},s="BatchGetCommand",c={unversionedId:"tables/actions/batch-get/index",id:"tables/actions/batch-get/index",title:"BatchGet",description:"Groups one or several BatchGetRequest from the Table entities to execute a BatchGetItem operation.",source:"@site/docs/2-tables/2-actions/4-batch-get/index.md",sourceDirName:"2-tables/2-actions/4-batch-get",slug:"/tables/actions/batch-get/",permalink:"/docs/tables/actions/batch-get/",draft:!1,tags:[],version:"current",frontMatter:{title:"BatchGet",sidebar_custom_props:{sidebarActionType:"read"}},sidebar:"tutorialSidebar",previous:{title:"Batching",permalink:"/docs/tables/actions/batching/"},next:{title:"BatchWrite",permalink:"/docs/tables/actions/batch-write/"}},m={},p=[{value:"Request",id:"request",level:2},{value:"<code>.requests(...)</code>",id:"requests",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Execution",id:"execution",level:2},{value:"Options",id:"options-1",level:3},{value:"Response",id:"response",level:3}],u={toc:p},d="wrapper";function y(e){let{components:t,...a}=e;return(0,r.yg)(d,(0,n.A)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"batchgetcommand"},"BatchGetCommand"),(0,r.yg)("p",null,"Groups one or several ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/batch-get/"},(0,r.yg)("inlineCode",{parentName:"a"},"BatchGetRequest"))," from the ",(0,r.yg)("inlineCode",{parentName:"p"},"Table")," entities to execute a ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html"},"BatchGetItem")," operation."),(0,r.yg)("p",null,"BatchGetItem operations can affect ",(0,r.yg)("strong",{parentName:"p"},"multiple tables"),", so ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchGetCommands")," do not have a ",(0,r.yg)("inlineCode",{parentName:"p"},".send(...)")," method. Instead, they should be performed via the dedicated ",(0,r.yg)("inlineCode",{parentName:"p"},"execute")," function:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  BatchGetCommand,\n  execute\n} from 'dynamodb-toolbox/table/actions/batchGet'\nimport { BatchGetRequest } from 'dynamodb-toolbox/entity/actions/batchGet'\n\nconst pokeCmd = PokeTable.build(BatchGetCommand).requests(\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  PokemonEntity.build(BatchGetRequest).key(charizardKey)\n)\n\nconst params = pokeCmd.params()\n\nconst otherCmd = OtherTable.build(BatchGetCommand).requests(\n  TrainerEntity.build(BatchGetRequest).key(ashKey)\n)\n\nconst { Responses } = await execute(pokeCmd, otherCmd)\n\n// \ud83d\ude4c Correctly typed!\nconst [[pikachu, charizard], [ash]] = Responses\n")),(0,r.yg)("admonition",{type:"note"},(0,r.yg)("p",{parentName:"admonition"},"Note that batch operations are more efficient than running their equivalent commands in parallel, but ",(0,r.yg)("strong",{parentName:"p"},"do not reduce costs"),".")),(0,r.yg)("h2",{id:"request"},"Request"),(0,r.yg)("h3",{id:"requests"},(0,r.yg)("inlineCode",{parentName:"h3"},".requests(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,"(required)")),(0,r.yg)("p",null,"The ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/batch-get/"},(0,r.yg)("inlineCode",{parentName:"a"},"BatchGetRequests"))," to execute."),(0,r.yg)("p",null,"Note that the requests can be provided as ",(0,r.yg)("strong",{parentName:"p"},"tuples")," or ",(0,r.yg)("strong",{parentName:"p"},"arrays")," (the output is typed accordingly):"),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(o.A,{mdxType:"Tabs"},(0,r.yg)(l.A,{value:"tuple",label:"Tuple",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const command = PokeTable.build(BatchGetCommand).requests(\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  PokemonEntity.build(BatchGetRequest).key(charizardKey),\n  ...\n)\n"))),(0,r.yg)(l.A,{value:"array",label:"Array",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const requests: BatchGetRequest<typeof PokemonEntity>[] = [\n  PokemonEntity.build(BatchGetRequest).key(pikachuKey),\n  PokemonEntity.build(BatchGetRequest).key(charizardKey),\n  ...\n]\n\nconst command =\n  PokeTable.build(BatchGetCommand).requests(...requests)\n"))))),(0,r.yg)("h3",{id:"options"},(0,r.yg)("inlineCode",{parentName:"h3"},".options(...)")),(0,r.yg)("p",null,"Provides additional ",(0,r.yg)("strong",{parentName:"p"},"table-level")," options:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const command = PokeTable.build(BatchGetCommand).options({\n  consistent: true\n  ...\n})\n")),(0,r.yg)("p",null,"You can use the ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchGetCommandOptions")," type to explicitly type an object as a ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchGetCommand")," options object:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import type { BatchGetCommandOptions } from 'dynamodb-toolbox/table/actions/batchGet'\n\nconst batchGetOptions: BatchGetCommandOptions<\n  // \ud83d\udc47 Optional entities\n  [typeof PokemonEntity, typeof TrainerEntity]\n> = {\n  consistent: true,\n  ...\n}\n\nconst command = PokeTable.build(BatchGetCommand)\n  .requests(...)\n  .options(batchGetOptions)\n")),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"It is advised to provide ",(0,r.yg)("inlineCode",{parentName:"p"},"requests")," first as they constrain the ",(0,r.yg)("inlineCode",{parentName:"p"},"options")," type.")),(0,r.yg)("p",null,"Available options (see the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html#API_BatchGetItem_RequestParameters"},"DynamoDB documentation")," for more details):"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Option"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"consistent")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"boolean")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"false")),(0,r.yg)("td",{parentName:"tr",align:null},"By default, read operations are ",(0,r.yg)("b",null,"eventually")," consistent (which improves performances and reduces costs).",(0,r.yg)("br",null),(0,r.yg)("br",null),"Set to ",(0,r.yg)("inlineCode",{parentName:"td"},"true")," to use ",(0,r.yg)("b",null,"strongly")," consistent reads.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"attributes")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"string[]")),(0,r.yg)("td",{parentName:"tr",align:"center"},"-"),(0,r.yg)("td",{parentName:"tr",align:null},"To specify a list of attributes to retrieve (improves performances but does not reduce costs).",(0,r.yg)("br",null),(0,r.yg)("br",null),"Requires ",(0,r.yg)("a",{parentName:"td",href:"#requests"},"requests"),". Paths must be common to all requested entities.",(0,r.yg)("br",null),(0,r.yg)("br",null),"See the ",(0,r.yg)("a",{parentName:"td",href:"/docs/entities/actions/parse-paths/#paths"},"PathParser")," action for more details on how to write attribute paths.")))),(0,r.yg)("h2",{id:"execution"},"Execution"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { execute } from 'dynamodb-toolbox/table/actions/batchGet'\n\nawait execute(...batchGetCommands)\n")),(0,r.yg)("admonition",{type:"caution"},(0,r.yg)("p",{parentName:"admonition"},"Only one ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchGetCommand")," per Table is supported.")),(0,r.yg)("p",null,"Note that the commands can be provided as ",(0,r.yg)("strong",{parentName:"p"},"tuples")," or ",(0,r.yg)("strong",{parentName:"p"},"arrays")," (the output is typed accordingly):"),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(o.A,{mdxType:"Tabs"},(0,r.yg)(l.A,{value:"tuple",label:"Tuple",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"await execute(\n  PokeTable.build(BatchGetCommand).requests(...),\n  OtherTable.build(BatchGetCommand).requests(...),\n  ...\n)\n"))),(0,r.yg)(l.A,{value:"array",label:"Array",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const commands: (\n  | BatchGetCommand<typeof PokeTable>\n  | BatchGetCommand<typeof OtherTable>\n)[] = [\n  PokeTable.build(BatchGetCommand).requests(...),\n  OtherTable.build(BatchGetCommand).requests(...)\n]\n\nawait execute(...commands)\n"))))),(0,r.yg)("h3",{id:"options-1"},"Options"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"execute")," function accepts an additional object as a first argument for ",(0,r.yg)("strong",{parentName:"p"},"operation-level")," options:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"await execute(options, ...batchGetCommands)\n")),(0,r.yg)("p",null,"Available options (see the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html#API_BatchGetItem_RequestParameters"},"DynamoDB documentation")," for more details):"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Option"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"capacity")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"CapacityOption")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},'"NONE"')),(0,r.yg)("td",{parentName:"tr",align:null},"Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.",(0,r.yg)("br",null),(0,r.yg)("br",null),"Possible values are ",(0,r.yg)("inlineCode",{parentName:"td"},'"NONE"'),", ",(0,r.yg)("inlineCode",{parentName:"td"},'"TOTAL"')," and ",(0,r.yg)("inlineCode",{parentName:"td"},'"INDEXES"'),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"documentClient")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"DocumentClient")),(0,r.yg)("td",{parentName:"tr",align:"center"},"-"),(0,r.yg)("td",{parentName:"tr",align:null},"By default, the ",(0,r.yg)("inlineCode",{parentName:"td"},"documentClient")," attached to the ",(0,r.yg)("inlineCode",{parentName:"td"},"Table")," of the first ",(0,r.yg)("inlineCode",{parentName:"td"},"BatchGetCommand")," is used to execute the operation.",(0,r.yg)("br",null),(0,r.yg)("br",null),"Use this option to override this behavior.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"maxAttempts")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"integer \u2265 1")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"1")),(0,r.yg)("td",{parentName:"tr",align:null},'A "meta" option provided by DynamoDB-Toolbox to retry failed requests in a single promise.',(0,r.yg)("br",null),(0,r.yg)("br",null),"Note that ",(0,r.yg)("code",null,"Infinity")," is a valid (albeit dangerous) option.")))),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(o.A,{mdxType:"Tabs"},(0,r.yg)(l.A,{value:"capacity",label:"Capacity",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { ConsumedCapacity } = await execute(\n  { capacity: 'TOTAL' },\n  ...batchGetCommands\n)\n"))),(0,r.yg)(l.A,{value:"document-client",label:"Document client",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'\n\nconst documentClient = new DynamoDBDocumentClient(...)\n\nconst { Response } = await execute(\n  { documentClient },\n  ...batchGetCommands\n)\n"))),(0,r.yg)(l.A,{value:"retries",label:"Retries",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { Response } = await execute(\n  { maxAttempts: 3 },\n  ...batchGetCommands\n)\n"))))),(0,r.yg)("h3",{id:"response"},"Response"),(0,r.yg)("p",null,"The data is returned with the same response syntax as from the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html#API_BatchGetItem_ResponseSyntax"},"DynamoDB BatchGetItem API"),", except for the ",(0,r.yg)("inlineCode",{parentName:"p"},"Responses")," property."),(0,r.yg)("p",null,"Instead of a map of arrays indexed by table name, DynamoDB-Toolbox returns an ",(0,r.yg)("strong",{parentName:"p"},"array of arrays"),", where each sub-array contains the items of a ",(0,r.yg)("inlineCode",{parentName:"p"},"BatchGetCommand"),". Both commands and items are returned in the ",(0,r.yg)("strong",{parentName:"p"},"same order they were provided"),", and items are formatted by their respective entities."),(0,r.yg)("admonition",{type:"note"},(0,r.yg)("p",{parentName:"admonition"},"The official documentation states that ",(0,r.yg)("em",{parentName:"p"},'"DynamoDB does not return items in any particular order"'),", but DynamoDB-Toolbox ",(0,r.yg)("strong",{parentName:"p"},"handles the re-ordering for you")," \ud83d\ude18"),(0,r.yg)("p",{parentName:"admonition"},"This format is also better for type inference, as DynamoDB-Toolbox does not statically know your table names.")))}y.isMDXComponent=!0}}]);