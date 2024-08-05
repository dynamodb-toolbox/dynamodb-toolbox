"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5250],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>u});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=p(n),u=r,k=c["".concat(s,".").concat(u)]||c[u]||m[u]||o;return n?a.createElement(k,i(i({ref:t},d),{},{components:n})):a.createElement(k,i({ref:t},d))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},85162:(e,t,n)=>{n.d(t,{Z:()=>i});var a=n(67294),r=n(86010);const o="tabItem_Ymn6";function i(e){let{children:t,hidden:n,className:i}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,i),hidden:n},t)}},74866:(e,t,n)=>{n.d(t,{Z:()=>v});var a=n(87462),r=n(67294),o=n(86010),i=n(12466),l=n(76775),s=n(91980),p=n(67392),d=n(50012);function m(e){return function(e){var t;return(null==(t=r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})))?void 0:t.filter(Boolean))??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}function c(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??m(n);return function(e){const t=(0,p.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function u(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function k(e){let{queryString:t=!1,groupId:n}=e;const a=(0,l.k6)(),o=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,s._X)(o),(0,r.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(a.location.search);t.set(o,e),a.replace({...a.location,search:t.toString()})}),[o,a])]}function N(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,o=c(e),[i,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!u({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:o}))),[s,p]=k({queryString:n,groupId:a}),[m,N]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,o]=(0,d.Nk)(n);return[a,(0,r.useCallback)((e=>{n&&o.set(e)}),[n,o])]}({groupId:a}),g=(()=>{const e=s??m;return u({value:e,tabValues:o})?e:null})();(0,r.useLayoutEffect)((()=>{g&&l(g)}),[g]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!u({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),p(e),N(e)}),[p,N,o]),tabValues:o}}var g=n(72389);const b="tabList__CuJ",h="tabItem_LNqP";function y(e){let{className:t,block:n,selectedValue:l,selectValue:s,tabValues:p}=e;const d=[],{blockElementScrollPositionUntilNextRender:m}=(0,i.o5)(),c=e=>{const t=e.currentTarget,n=d.indexOf(t),a=p[n].value;a!==l&&(m(t),s(a))},u=e=>{var t;let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=d.indexOf(e.currentTarget)+1;n=d[t]??d[0];break}case"ArrowLeft":{const t=d.indexOf(e.currentTarget)-1;n=d[t]??d[d.length-1];break}}null==(t=n)||t.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":n},t)},p.map((e=>{let{value:t,label:n,attributes:i}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:l===t?0:-1,"aria-selected":l===t,key:t,ref:e=>d.push(e),onKeyDown:u,onClick:c},i,{className:(0,o.Z)("tabs__item",h,null==i?void 0:i.className,{"tabs__item--active":l===t})}),n??t)})))}function C(e){let{lazy:t,children:n,selectedValue:a}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},o.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function f(e){const t=N(e);return r.createElement("div",{className:(0,o.Z)("tabs-container",b)},r.createElement(y,(0,a.Z)({},e,t)),r.createElement(C,(0,a.Z)({},e,t)))}function v(e){const t=(0,g.Z)();return r.createElement(f,(0,a.Z)({key:String(t)},e))}},18:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>s,default:()=>u,frontMatter:()=>l,metadata:()=>p,toc:()=>m});var a=n(87462),r=(n(67294),n(3905)),o=n(74866),i=n(85162);const l={title:"ParseCondition",sidebar_custom_props:{sidebarActionType:"util"}},s="ConditionParser",p={unversionedId:"entities/actions/parse-condition/index",id:"entities/actions/parse-condition/index",title:"ParseCondition",description:"Builds a Condition Expression that can be used to condition write operations, or filter the results of a Query or a Scan:",source:"@site/docs/3-entities/3-actions/17-parse-condition/index.md",sourceDirName:"3-entities/3-actions/17-parse-condition",slug:"/entities/actions/parse-condition/",permalink:"/docs/entities/actions/parse-condition/",draft:!1,tags:[],version:"current",frontMatter:{title:"ParseCondition",sidebar_custom_props:{sidebarActionType:"util"}},sidebar:"tutorialSidebar",previous:{title:"Parse",permalink:"/docs/entities/actions/parse/"},next:{title:"ParsePaths",permalink:"/docs/entities/actions/parse-paths/"}},d={},m=[{value:"Methods",id:"methods",level:2},{value:"<code>parse(...)</code>",id:"parse",level:3},{value:"<code>toCommandOptions()</code>",id:"tocommandoptions",level:3},{value:"<code>setId(...)</code>",id:"setid",level:3},{value:"Building Conditions",id:"building-conditions",level:2},{value:"Paths",id:"paths",level:3},{value:"Value conditions",id:"value-conditions",level:3},{value:"Range conditions",id:"range-conditions",level:3},{value:"Combining Conditions",id:"combining-conditions",level:2},{value:"Comparing Attributes",id:"comparing-attributes",level:2}],c={toc:m};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"conditionparser"},"ConditionParser"),(0,r.kt)("p",null,"Builds a ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html"},"Condition Expression")," that can be used to condition write operations, or filter the results of a ",(0,r.kt)("a",{parentName:"p",href:"/docs/tables/actions/query/"},"Query")," or a ",(0,r.kt)("a",{parentName:"p",href:"/docs/tables/actions/scan/"},"Scan"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { ConditionParser } from 'dynamodb-toolbox/entity/actions/parseCondition'\n\n// \ud83d\udc47 To be used in DynamoDB commands\nconst {\n  ConditionExpression,\n  ExpressionAttributeNames,\n  ExpressionAttributeValues\n} = PokemonEntity.build(ConditionParser)\n  .parse({\n    // Pokemons with levels \u2265 50\n    attr: 'level',\n    gte: 50\n  })\n  .toCommandOptions()\n")),(0,r.kt)("h2",{id:"methods"},"Methods"),(0,r.kt)("h3",{id:"parse"},(0,r.kt)("inlineCode",{parentName:"h3"},"parse(...)")),(0,r.kt)("p",{style:{marginTop:"-15px"}},(0,r.kt)("i",null,(0,r.kt)("code",null,"(condition: Condition<ENTITY>) => ConditionParser"))),(0,r.kt)("p",null,"Parses a condition. Throws an ",(0,r.kt)("inlineCode",{parentName:"p"},"invalidCondition")," error if the condition is invalid:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"PokemonEntity.build(ConditionParser).parse({\n  attr: 'level',\n  gte: 50\n})\n")),(0,r.kt)("p",null,"Note that the ",(0,r.kt)("inlineCode",{parentName:"p"},"parse")," method should only be used once per instance (for now). See ",(0,r.kt)("a",{parentName:"p",href:"#building-conditions"},"Building Conditions")," for more details on how to write conditions."),(0,r.kt)("h3",{id:"tocommandoptions"},(0,r.kt)("inlineCode",{parentName:"h3"},"toCommandOptions()")),(0,r.kt)("p",{style:{marginTop:"-15px"}},(0,r.kt)("i",null,(0,r.kt)("code",null,"() => CommandOptions"))),(0,r.kt)("p",null,"Collapses the ",(0,r.kt)("inlineCode",{parentName:"p"},"ConditionParser")," state to a set of options that can be used in a DynamoDB command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const {\n  ConditionExpression,\n  ExpressionAttributeNames,\n  ExpressionAttributeValues\n} = PokemonEntity.build(ConditionParser)\n  .parse({ attr: 'level', gte: 50 })\n  .toCommandOptions()\n")),(0,r.kt)("h3",{id:"setid"},(0,r.kt)("inlineCode",{parentName:"h3"},"setId(...)")),(0,r.kt)("p",{style:{marginTop:"-15px"}},(0,r.kt)("i",null,(0,r.kt)("code",null,"(id: string) => ConditionParser"))),(0,r.kt)("p",null,"Adds a prefix to expression attribute keys. Useful to avoid conflicts when using several expressions in a single command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"PokemonEntity.build(ConditionParser)\n  .parse({ attr: 'level', gte: 50 })\n  .toCommandOptions()\n// => {\n//   ConditionExpression: '#c_1 >= :c_1',\n//   ExpressionAttributeNames: { '#c_1': 'sk' },\n//   ExpressionAttributeValues: { ':c_1': 50 }\n// }\n\nPokemonEntity.build(ConditionParser)\n  .setId('0')\n  .parse({ attr: 'level', gte: 50 })\n  .toCommandOptions()\n// => {\n//   ConditionExpression: '#c0_1 >= :c0_1',\n//   ExpressionAttributeNames: { '#c0_1': 'sk' },\n//   ExpressionAttributeValues: { ':c0_1': 50 }\n// }\n")),(0,r.kt)("h2",{id:"building-conditions"},"Building Conditions"),(0,r.kt)("p",null,"The condition syntax from DynamoDB-Toolbox follows the ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html"},"DynamoDB specifications"),", while making it ",(0,r.kt)("strong",{parentName:"p"},"type-safe")," and much ",(0,r.kt)("strong",{parentName:"p"},"simpler"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import type { Condition } from 'dynamodb-toolbox/entity/actions/parseCondition'\n\nconst condition: Condition<typeof PokemonEntity> = {\n  attr: 'level',\n  gte: 50\n}\n")),(0,r.kt)("p",null,"Each condition contains ",(0,r.kt)("strong",{parentName:"p"},"an attribute path")," and an ",(0,r.kt)("strong",{parentName:"p"},"operator"),"."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"You can only specify one operator per condition. To combine multiple conditions, use ",(0,r.kt)("a",{parentName:"p",href:"#combining-conditions"},"Logical Combinations"),".")),(0,r.kt)("h3",{id:"paths"},"Paths"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"attr")," contains the path of the attribute value to check (potentially nested). You can also specify ",(0,r.kt)("inlineCode",{parentName:"p"},"size")," instead of ",(0,r.kt)("inlineCode",{parentName:"p"},"attr")," if you want to check the ",(0,r.kt)("strong",{parentName:"p"},"size")," of an attribute (in which case the attribute type becomes ",(0,r.kt)("inlineCode",{parentName:"p"},"number"),"):"),(0,r.kt)("admonition",{title:"Examples",type:"note"},(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(i.Z,{value:"root",label:"Root",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const nameCheck: Condition<typeof PokemonEntity> = {\n  attr: 'name',\n  eq: 'Pikachu'\n}\n"))),(0,r.kt)(i.Z,{value:"nested-map",label:"Nested (Map)",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const nameCheck: Condition<typeof PokemonEntity> = {\n  attr: 'name.firstName',\n  eq: 'Pikachu'\n}\n"))),(0,r.kt)(i.Z,{value:"nested-list",label:"Nested (List)",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const nameCheck: Condition<typeof PokemonEntity> = {\n  attr: 'names[0]',\n  eq: 'Pikachu'\n}\n"))),(0,r.kt)(i.Z,{value:"size",label:"Size",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const imgLte64KB: Condition<typeof PokemonEntity> = {\n  size: 'image',\n  lte: 64_000\n}\n"))))),(0,r.kt)("h3",{id:"value-conditions"},"Value conditions"),(0,r.kt)("p",null,"Value conditions evaluate against the ",(0,r.kt)("strong",{parentName:"p"},"value")," of an attribute:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"center"},"Key"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Value"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Attribute Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"eq")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"scalar")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"scalar"),"*"),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is ",(0,r.kt)("strong",{parentName:"td"},"equal")," to the specified value")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"ne")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"scalar")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"scalar")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is ",(0,r.kt)("strong",{parentName:"td"},"different")," than the specified value")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"in")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"scalar[]")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"scalar")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is in a ",(0,r.kt)("strong",{parentName:"td"},"finite range of values")," (100 values max)")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"contains")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"scalar")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"string"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"sets")," or ",(0,r.kt)("inlineCode",{parentName:"td"},"lists")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is one of the following:",(0,r.kt)("ul",null,(0,r.kt)("li",null,"A ",(0,r.kt)("code",null,"string")," that contains a ",(0,r.kt)("strong",{parentName:"td"},"particular substring")),(0,r.kt)("li",null,"A ",(0,r.kt)("code",null,"set")," that contains a ",(0,r.kt)("strong",{parentName:"td"},"particular element")),(0,r.kt)("li",null,"A ",(0,r.kt)("code",null,"list")," that contains a ",(0,r.kt)("strong",{parentName:"td"},"particular element"))))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"exists")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"boolean")),(0,r.kt)("td",{parentName:"tr",align:"center"},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is ",(0,r.kt)("strong",{parentName:"td"},"present in the item")," (or not)")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"type")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:"center"},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is of a ",(0,r.kt)("strong",{parentName:"td"},"particular data type"),":",(0,r.kt)("ul",null,(0,r.kt)("li",null,(0,r.kt)("inlineCode",{parentName:"td"},'"NULL"')," = ",(0,r.kt)("inlineCode",{parentName:"td"},"null")),(0,r.kt)("li",null,(0,r.kt)("inlineCode",{parentName:"td"},'"BOOL"')," = ",(0,r.kt)("inlineCode",{parentName:"td"},"boolean")),(0,r.kt)("li",null,(0,r.kt)("inlineCode",{parentName:"td"},'"N"')," = ",(0,r.kt)("inlineCode",{parentName:"td"},"number")),(0,r.kt)("li",null,(0,r.kt)("inlineCode",{parentName:"td"},'"S"')," = ",(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("li",null,(0,r.kt)("inlineCode",{parentName:"td"},'"B"')," = ",(0,r.kt)("inlineCode",{parentName:"td"},"binary")),(0,r.kt)("li",null,(0,r.kt)("code",null,'"NS',"|","SS","|",'BS"')," = ",(0,r.kt)("inlineCode",{parentName:"td"},"set")," of ",(0,r.kt)("inlineCode",{parentName:"td"},"number"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"string")," or ",(0,r.kt)("inlineCode",{parentName:"td"},"binary")),(0,r.kt)("li",null,(0,r.kt)("inlineCode",{parentName:"td"},'"L"')," = ",(0,r.kt)("inlineCode",{parentName:"td"},"list")),(0,r.kt)("li",null,(0,r.kt)("inlineCode",{parentName:"td"},'"M"')," = ",(0,r.kt)("inlineCode",{parentName:"td"},"map"))))))),(0,r.kt)("sup",null,(0,r.kt)("i",null,"*",(0,r.kt)("a",{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"Scalar")," = ",(0,r.kt)("code",null,"boolean"),", ",(0,r.kt)("code",null,"number"),", ",(0,r.kt)("code",null,"string")," or ",(0,r.kt)("code",null,"binary"))),(0,r.kt)("admonition",{title:"Examples",type:"note"},(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(i.Z,{value:"eq",label:"Equal",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const nameCheck: Condition<typeof PokemonEntity> = {\n  attr: 'name',\n  eq: 'Pikachu'\n}\n"))),(0,r.kt)(i.Z,{value:"neq",label:"Not equal",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const nameCheck: Condition<typeof PokemonEntity> = {\n  attr: 'name',\n  ne: 'Pikachu'\n}\n"))),(0,r.kt)(i.Z,{value:"in",label:"In",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const nameCheck: Condition<typeof PokemonEntity> = {\n  attr: 'name',\n  in: ['Pikachu', 'Charizard', 'MewTwo']\n}\n"))),(0,r.kt)(i.Z,{value:"contains-set-list",label:"Contains",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const pokeTypeCheck: Condition<typeof PokemonEntity> = {\n  // \ud83d\udc47 `pokeTypes` = list/set of strings\n  attr: 'pokeTypes',\n  contains: 'fire'\n}\n"))),(0,r.kt)(i.Z,{value:"contains-string",label:"Contains (string)",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const nameCheck: Condition<typeof PokemonEntity> = {\n  // \ud83d\udc47 string\n  attr: 'name',\n  contains: 'Pika'\n}\n"))),(0,r.kt)(i.Z,{value:"exists",label:"Exists",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const customNameCheck: Condition<typeof PokemonEntity> = {\n  attr: 'customName',\n  exists: true\n}\n"))),(0,r.kt)(i.Z,{value:"type",label:"Type",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const pokeTypeCheck: Condition<typeof PokemonEntity> = {\n  // \ud83d\udc47 Checks that `pokeTypes` is a list\n  attr: 'pokeTypes',\n  type: 'L'\n}\n"))))),(0,r.kt)("h3",{id:"range-conditions"},"Range conditions"),(0,r.kt)("p",null,"Range conditions evaluate whether an attribute of sortable type (i.e. ",(0,r.kt)("a",{parentName:"p",href:"/docs/schemas/number/"},"number"),", ",(0,r.kt)("a",{parentName:"p",href:"/docs/schemas/string/"},"string")," or ",(0,r.kt)("a",{parentName:"p",href:"/docs/schemas/binary/"},"binary"),") is ",(0,r.kt)("strong",{parentName:"p"},"within a certain range"),"."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"Range conditions are the only conditions accepted in ",(0,r.kt)("a",{parentName:"p",href:"/docs/tables/actions/query/#query"},(0,r.kt)("inlineCode",{parentName:"a"},"Query")," ranges"),".")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"center"},"Key"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Value"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Attribute Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"gte")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is ",(0,r.kt)("strong",{parentName:"td"},"greater than or equal to")," the specified value")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"gt")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable"),"*"),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is ",(0,r.kt)("strong",{parentName:"td"},"strictly greater")," than the specified value")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"lte")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is ",(0,r.kt)("strong",{parentName:"td"},"lower than or equal to")," the specified value")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"lt")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is ",(0,r.kt)("strong",{parentName:"td"},"strictly lower than")," the specified value")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"between")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"[sortable, sortable]")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"sortable")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the attribute is ",(0,r.kt)("strong",{parentName:"td"},"between")," two values (inclusive)")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"beginsWith")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"[string, string]")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that the ",(0,r.kt)("inlineCode",{parentName:"td"},"string")," attribute specified ",(0,r.kt)("strong",{parentName:"td"},"begins with a particular substring"))))),(0,r.kt)("sup",null,(0,r.kt)("i",null,"* Sortable = ",(0,r.kt)("code",null,"number"),", ",(0,r.kt)("code",null,"string")," or ",(0,r.kt)("code",null,"binary"))),(0,r.kt)("admonition",{title:"Examples",type:"note"},(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(i.Z,{value:"greater-than",label:"\u2265",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const levelGte50: Condition<typeof PokemonEntity> = {\n  attr: 'level',\n  gte: 50\n}\n"))),(0,r.kt)(i.Z,{value:"greater-than-strict",label:">",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const levelAbove50: Condition<typeof PokemonEntity> = {\n  attr: 'level',\n  gt: 50\n}\n"))),(0,r.kt)(i.Z,{value:"lower-than",label:"\u2264",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const levelLte50: Condition<typeof PokemonEntity> = {\n  attr: 'level',\n  lte: 50\n}\n"))),(0,r.kt)(i.Z,{value:"lower-than-strict",label:"<",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const levelBelow50: Condition<typeof PokemonEntity> = {\n  attr: 'level',\n  lt: 50\n}\n"))),(0,r.kt)(i.Z,{value:"between",label:"Between",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const levelFrom50To70: Condition<typeof PokemonEntity> = {\n  attr: 'level',\n  between: [50, 70]\n}\n"))),(0,r.kt)(i.Z,{value:"begins-with",label:"Begins with",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const capturedIn2024: Condition<typeof PokemonEntity> = {\n  attr: 'captureDate',\n  beginsWith: '2024'\n}\n"))))),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"Again, only one operator can be applied per condition: Using ",(0,r.kt)("inlineCode",{parentName:"p"},"gte")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"lte")," simultaneously does ",(0,r.kt)("strong",{parentName:"p"},"not")," result in a ",(0,r.kt)("inlineCode",{parentName:"p"},"between"),".")),(0,r.kt)("h2",{id:"combining-conditions"},"Combining Conditions"),(0,r.kt)("p",null,"You can ",(0,r.kt)("strong",{parentName:"p"},"combine conditions logically")," with the ",(0,r.kt)("inlineCode",{parentName:"p"},"or"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"and")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"not")," operators:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"center"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Value"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Attribute Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"or")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"Condition<ENTITY>[]")),(0,r.kt)("td",{parentName:"tr",align:"center"},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that ",(0,r.kt)("strong",{parentName:"td"},"one of")," the child conditions evaluate to ",(0,r.kt)("inlineCode",{parentName:"td"},"true"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"and")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"Condition<ENTITY>[]")),(0,r.kt)("td",{parentName:"tr",align:"center"},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"Checks that ",(0,r.kt)("strong",{parentName:"td"},"all of")," the child conditions evaluate to ",(0,r.kt)("inlineCode",{parentName:"td"},"true"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"not")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"Condition<ENTITY>")),(0,r.kt)("td",{parentName:"tr",align:"center"},"-"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("strong",{parentName:"td"},"Negates")," the evaluation of the condition")))),(0,r.kt)("admonition",{title:"Examples",type:"note"},(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(i.Z,{value:"or",label:"Or",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const lvlGte50OrElec: Condition<typeof PokemonEntity> = {\n  or: [\n    { attr: 'level', gte: 50 },\n    { attr: 'pokeType', eq: 'electric' }\n  ]\n}\n"))),(0,r.kt)(i.Z,{value:"and",label:"And",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const lvlGte50AndElec: Condition<typeof PokemonEntity> = {\n  and: [\n    { attr: 'level', gte: 50 },\n    { attr: 'pokeType', eq: 'electric' }\n  ]\n}\n"))),(0,r.kt)(i.Z,{value:"not",label:"Not",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const notElectric: Condition<typeof PokemonEntity> = {\n  not: {\n    attr: 'pokeType',\n    eq: 'electric'\n  }\n}\n"))),(0,r.kt)(i.Z,{value:"nested",label:"Nested",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const nestedCondition: Condition<typeof PokemonEntity> = {\n  and: [\n    {\n      // Level \u2265 50 or \u2264 20...\n      or: [\n        { attr: 'level', gte: 50 },\n        { not: { attr: 'level', gt: 20 } }\n      ]\n    },\n    // ...and pokeType not 'electric'\n    { not: { attr: 'pokeType', eq: 'electric' } }\n  ]\n}\n"))))),(0,r.kt)("h2",{id:"comparing-attributes"},"Comparing Attributes"),(0,r.kt)("p",null,"Instead of directly providing values, you can ",(0,r.kt)("strong",{parentName:"p"},"compare attributes to other attributes")," by providing objects with an ",(0,r.kt)("inlineCode",{parentName:"p"},"attr")," key to the operators:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const atMaxLevel: Condition<typeof PokemonEntity> = {\n  attr: 'level',\n  eq: { attr: 'maxLevel' }\n}\n")),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"Note that the compared attribute path is type-checked and validated, but whether its type CAN be compared is ",(0,r.kt)("strong",{parentName:"p"},"not")," for the moment, so be extra-careful:"),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const invalidCondition: Condition<typeof PokemonEntity> = {\n  attr: 'level',\n  // \u274c Reaches DynamoDB and fail\n  gte: { attr: 'name' }\n}\n"))))}u.isMDXComponent=!0}}]);