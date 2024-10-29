"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[4565],{15680:(e,n,t)=>{t.d(n,{xA:()=>u,yg:()=>y});var a=t(96540);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),p=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},u=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=p(t),d=r,y=m["".concat(s,".").concat(d)]||m[d]||c[d]||o;return t?a.createElement(y,l(l({ref:n},u),{},{components:t})):a.createElement(y,l({ref:n},u))}));function y(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,l=new Array(o);l[0]=d;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i[m]="string"==typeof e?e:r,l[1]=i;for(var p=2;p<o;p++)l[p]=t[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},19365:(e,n,t)=>{t.d(n,{A:()=>l});var a=t(96540),r=t(20053);const o={tabItem:"tabItem_Ymn6"};function l(e){let{children:n,hidden:t,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.A)(o.tabItem,l),hidden:t},n)}},11470:(e,n,t)=>{t.d(n,{A:()=>T});var a=t(58168),r=t(96540),o=t(20053),l=t(23104),i=t(56347),s=t(57485),p=t(31682),u=t(89466);function m(e){return function(e){return r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:n,label:t,attributes:a,default:r}}=e;return{value:n,label:t,attributes:a,default:r}}))}function c(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??m(t);return function(e){const n=(0,p.X)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function d(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function y(e){let{queryString:n=!1,groupId:t}=e;const a=(0,i.W6)(),o=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,s.aZ)(o),(0,r.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(a.location.search);n.set(o,e),a.replace({...a.location,search:n.toString()})}),[o,a])]}function g(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,o=c(e),[l,i]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!d({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const a=t.find((e=>e.default))??t[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:o}))),[s,p]=y({queryString:t,groupId:a}),[m,g]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,o]=(0,u.Dv)(t);return[a,(0,r.useCallback)((e=>{t&&o.set(e)}),[t,o])]}({groupId:a}),b=(()=>{const e=s??m;return d({value:e,tabValues:o})?e:null})();(0,r.useLayoutEffect)((()=>{b&&i(b)}),[b]);return{selectedValue:l,selectValue:(0,r.useCallback)((e=>{if(!d({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);i(e),p(e),g(e)}),[p,g,o]),tabValues:o}}var b=t(92303);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function h(e){let{className:n,block:t,selectedValue:i,selectValue:s,tabValues:p}=e;const u=[],{blockElementScrollPositionUntilNextRender:m}=(0,l.a_)(),c=e=>{const n=e.currentTarget,t=u.indexOf(n),a=p[t].value;a!==i&&(m(n),s(a))},d=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=u.indexOf(e.currentTarget)+1;n=u[t]??u[0];break}case"ArrowLeft":{const t=u.indexOf(e.currentTarget)-1;n=u[t]??u[u.length-1];break}}n?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":t},n)},p.map((e=>{let{value:n,label:t,attributes:l}=e;return r.createElement("li",(0,a.A)({role:"tab",tabIndex:i===n?0:-1,"aria-selected":i===n,key:n,ref:e=>u.push(e),onKeyDown:d,onClick:c},l,{className:(0,o.A)("tabs__item",f.tabItem,l?.className,{"tabs__item--active":i===n})}),t??n)})))}function v(e){let{lazy:n,children:t,selectedValue:a}=e;const o=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=o.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},o.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a}))))}function N(e){const n=g(e);return r.createElement("div",{className:(0,o.A)("tabs-container",f.tabList)},r.createElement(h,(0,a.A)({},e,n)),r.createElement(v,(0,a.A)({},e,n)))}function T(e){const n=(0,b.A)();return r.createElement(N,(0,a.A)({key:String(n)},e))}},5:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>s,default:()=>y,frontMatter:()=>i,metadata:()=>p,toc:()=>m});var a=t(58168),r=(t(96540),t(15680)),o=t(11470),l=t(19365);const i={title:"Usage"},s="Table",p={unversionedId:"tables/usage/index",id:"tables/usage/index",title:"Usage",description:"Each Table instance describes the configuration of a deployed DynamoDB Table: Its name, primary key, secondary indexes, and more.",source:"@site/docs/2-tables/1-usage/index.md",sourceDirName:"2-tables/1-usage",slug:"/tables/usage/",permalink:"/docs/tables/usage/",draft:!1,tags:[],version:"current",frontMatter:{title:"Usage"},sidebar:"tutorialSidebar",previous:{title:"Usage",permalink:"/docs/getting-started/usage/"},next:{title:"Scan",permalink:"/docs/tables/actions/scan/"}},u={},m=[{value:"Constructor",id:"constructor",level:2},{value:"<code>documentClient</code>",id:"documentclient",level:3},{value:"<code>name</code>",id:"name",level:3},{value:"<code>partitionKey</code>",id:"partitionkey",level:3},{value:"<code>sortKey</code>",id:"sortkey",level:3},{value:"<code>indexes</code>",id:"indexes",level:3},{value:"<code>entityAttributeSavedAs</code>",id:"entityattributesavedas",level:3}],c={toc:m},d="wrapper";function y(e){let{components:n,...t}=e;return(0,r.yg)(d,(0,a.A)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"table"},"Table"),(0,r.yg)("p",null,"Each ",(0,r.yg)("strong",{parentName:"p"},"Table")," instance describes the configuration of a deployed DynamoDB Table: Its ",(0,r.yg)("strong",{parentName:"p"},"name"),", ",(0,r.yg)("strong",{parentName:"p"},"primary key"),", ",(0,r.yg)("strong",{parentName:"p"},"secondary indexes"),", and more."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-typescript"},"import { Table } from 'dynamodb-toolbox/table'\n\nconst PokeTable = new Table({\n  ...\n})\n")),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"The configuration provided to the ",(0,r.yg)("inlineCode",{parentName:"p"},"Table")," constructor must match your resources. But DynamoDB-Toolbox does NOT hold the responsibility of actually deploying them. This should be done by other means, like the ",(0,r.yg)("a",{parentName:"p",href:"https://aws.amazon.com/cli/"},"AWS CLI"),", ",(0,r.yg)("a",{parentName:"p",href:"https://www.terraform.io/"},"Terraform")," or ",(0,r.yg)("a",{parentName:"p",href:"https://aws.amazon.com/cloudformation/"},"Cloudformation"),".")),(0,r.yg)("h2",{id:"constructor"},"Constructor"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"Table")," takes a single parameter of type ",(0,r.yg)("inlineCode",{parentName:"p"},"object")," and accepts the following properties:"),(0,r.yg)("h3",{id:"documentclient"},(0,r.yg)("inlineCode",{parentName:"h3"},"documentClient")),(0,r.yg)("p",null,"As mentioned in the ",(0,r.yg)("a",{parentName:"p",href:"/docs/getting-started/overview/"},"Getting Started section"),", DynamoDB-Tooblox is an ",(0,r.yg)("strong",{parentName:"p"},"abstraction layer over the Document Client"),", but it does not replace it. A ",(0,r.yg)("inlineCode",{parentName:"p"},"DocumentClient")," instance is explicitly needed for commands to interact with DynamoDB."),(0,r.yg)("p",null,"You can provide it in the ",(0,r.yg)("inlineCode",{parentName:"p"},"Table")," constructor:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-typescript"},"// From peer dependencies\nimport { DynamoDBClient } from '@aws-sdk/client-dynamodb'\nimport { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'\n\nconst dynamoDBClient = new DynamoDBClient()\n\nconst documentClient = DynamoDBDocumentClient.from(\n  dynamoDBClient,\n  {\n    marshallOptions: {\n      // Specify your client options as usual\n      removeUndefinedValues: true,\n      convertEmptyValues: false\n      ...\n    }\n  }\n)\n\nconst PokeTable = new Table({\n  documentClient,\n  ...\n})\n")),(0,r.yg)("p",null,"You can also set it later in the code (but beware that commands fail if no client has been provided):"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-typescript"},"const PokeTable = new Table(...)\n\n// Later in the code\nconst documentClient = ...\nPokeTable.documentClient = documentClient\n")),(0,r.yg)("h3",{id:"name"},(0,r.yg)("inlineCode",{parentName:"h3"},"name")),(0,r.yg)("p",null,"A ",(0,r.yg)("inlineCode",{parentName:"p"},"string")," (or function returning a ",(0,r.yg)("inlineCode",{parentName:"p"},"string"),") that matches the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.Basics.html#WorkingWithTables.Basics.CreateTable"},"name")," of your DynamoDB table:"),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(o.A,{mdxType:"Tabs"},(0,r.yg)(l.A,{value:"fixed",label:"Fixed",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},'const PokeTable = new Table({\n  name: "poke-table",\n  ...\n});\n'))),(0,r.yg)(l.A,{value:"env",label:"From env",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokeTable = new Table({\n  name: process.env.POKE_TABLE_NAME,\n  ...\n});\n"))),(0,r.yg)(l.A,{value:"getter",label:"Getter",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokeTable = new Table({\n  // \ud83d\udc47 Only executed at command execution\n  name: () => process.env.POKE_TABLE_NAME,\n  ...\n});\n"))))),(0,r.yg)("p",null,"You can also provide it through ",(0,r.yg)("strong",{parentName:"p"},"command options")," \u2013 which is useful for ",(0,r.yg)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Multitenancy"},"multitenant apps")," \u2013 but beware that commands fail if no table name has been provided:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokeTable = new Table({\n  // Omit `name` property\n  documentClient,\n  ...\n})\n\n// Scan tenant table\nconst { Items } = await PokeTable.build(ScanCommand)\n  .options({ tableName: tenantTableName })\n  .send()\n")),(0,r.yg)("h3",{id:"partitionkey"},(0,r.yg)("inlineCode",{parentName:"h3"},"partitionKey")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,"(required)")),(0,r.yg)("p",null,"The ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey"},"partition key")," attribute name and type of your DynamoDB table:"),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(o.A,{mdxType:"Tabs"},(0,r.yg)(l.A,{value:"string",label:"String",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},'const MyTable = new Table({\n  ...,\n  partitionKey: {\n    name: "pokemonId",\n    type: "string",\n  }\n})\n'))),(0,r.yg)(l.A,{value:"number",label:"Number",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},'const MyTable = new Table({\n  ...,\n  partitionKey: {\n    name: "pokemonId",\n    type: "number",\n  }\n})\n'))),(0,r.yg)(l.A,{value:"binary",label:"Binary",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},'const MyTable = new Table({\n  ...,\n  partitionKey: {\n    name: "pokemonId",\n    type: "binary",\n  }\n})\n'))))),(0,r.yg)("h3",{id:"sortkey"},(0,r.yg)("inlineCode",{parentName:"h3"},"sortKey")),(0,r.yg)("p",null,"If present, the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey"},"sort key")," attribute name and type of your DynamoDB table:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},'const MyTable = new Table({\n  ...,\n  sortKey: {\n    name: "level",\n    type: "number",\n  }\n})\n')),(0,r.yg)("h3",{id:"indexes"},(0,r.yg)("inlineCode",{parentName:"h3"},"indexes")),(0,r.yg)("p",null,"An object that lists the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.SecondaryIndexes"},"secondary indexes")," of your DynamoDB Table."),(0,r.yg)("p",null,"Secondary indexes are represented as key-value pairs, keys being the index names, and values containing:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"The ",(0,r.yg)("inlineCode",{parentName:"li"},"type")," of the secondary index (",(0,r.yg)("inlineCode",{parentName:"li"},'"local"')," or ",(0,r.yg)("inlineCode",{parentName:"li"},'"global"'),")"),(0,r.yg)("li",{parentName:"ul"},"For global secondary indexes, the ",(0,r.yg)("inlineCode",{parentName:"li"},"partitionKey")," of the index (similar to the main ",(0,r.yg)("a",{parentName:"li",href:"#partitionkey"},(0,r.yg)("inlineCode",{parentName:"a"},"partitionKey")),")"),(0,r.yg)("li",{parentName:"ul"},"The ",(0,r.yg)("inlineCode",{parentName:"li"},"sortKey")," of the index (similar to the main ",(0,r.yg)("a",{parentName:"li",href:"#sortKey"},(0,r.yg)("inlineCode",{parentName:"a"},"sortKey")),")")),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(o.A,{mdxType:"Tabs"},(0,r.yg)(l.A,{value:"gsi",label:"Global Index",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const MyTable = new Table({\n  ...,\n  indexes: {\n    byTrainerId: {\n      type: 'global',\n      partitionKey: { name: 'trainerId', type: 'string' }\n    }\n  }\n})\n"))),(0,r.yg)(l.A,{value:"gsi-sort-key",label:"Global Index (+ sort key)",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const MyTable = new Table({\n  ...,\n  indexes: {\n    byTrainerId: {\n      type: 'global',\n      partitionKey: { name: 'trainerId', type: 'string' },\n      sortKey: { name: 'level', type: 'number' }\n    }\n  }\n})\n"))),(0,r.yg)(l.A,{value:"lsi",label:"Local Index",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const MyTable = new Table({\n  ...,\n  indexes: {\n    byLevel: {\n      type: 'local',\n      sortKey: { name: 'level', type: 'number' }\n    }\n  }\n})\n"))))),(0,r.yg)("admonition",{type:"caution"},(0,r.yg)("p",{parentName:"admonition"},"When whitelisted, the projected attributes of a secondary index MUST include the ",(0,r.yg)("inlineCode",{parentName:"p"},"Table"),"'s ",(0,r.yg)("a",{parentName:"p",href:"#entityattributesavedas"},"entity attribute")," for automatic parsing of the returned data.")),(0,r.yg)("h3",{id:"entityattributesavedas"},(0,r.yg)("inlineCode",{parentName:"h3"},"entityAttributeSavedAs")),(0,r.yg)("p",null,"DynamoDB-Toolbox tags your data via an internal and hidden ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/internal-attributes/#entity"},(0,r.yg)("inlineCode",{parentName:"a"},"entity"))," attribute. Any write command automatically sets its value to the corresponding ",(0,r.yg)("inlineCode",{parentName:"p"},"Entity")," name."),(0,r.yg)("p",null,"To allow for appropriate formatting when fetching multiple items of the same ",(0,r.yg)("inlineCode",{parentName:"p"},"Table")," in a single operation (like ",(0,r.yg)("a",{parentName:"p",href:"/docs/tables/actions/query/"},"Queries")," or ",(0,r.yg)("a",{parentName:"p",href:"/docs/tables/actions/scan/"},"Scans"),"), ",(0,r.yg)("strong",{parentName:"p"},"the key of this attribute must be the same accross all of its items"),", so it must be set at the ",(0,r.yg)("inlineCode",{parentName:"p"},"Table")," level."),(0,r.yg)("p",null,"Its default value is ",(0,r.yg)("inlineCode",{parentName:"p"},"_et"),", but it can be renamed through the ",(0,r.yg)("inlineCode",{parentName:"p"},"entityAttributeSavedAs")," argument:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const MyTable = new Table({\n  ...\n  // \ud83d\udc47 defaults to '_et'\n  entityAttributeSavedAs: '__entity__',\n});\n")),(0,r.yg)("admonition",{type:"caution"},(0,r.yg)("p",{parentName:"admonition"},"\u261d\ufe0f This property ",(0,r.yg)("strong",{parentName:"p"},"cannot be updated")," once your Table has its first item (at least not without a data migration first), so choose wisely!")))}y.isMDXComponent=!0}}]);