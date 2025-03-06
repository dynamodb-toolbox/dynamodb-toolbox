"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[6284],{7847:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>c,default:()=>p,frontMatter:()=>l,metadata:()=>o,toc:()=>u});var t=s(4848),a=s(8453),r=s(1470),i=s(9365);const l={title:"set",sidebar_custom_props:{code:!0}},c="Set",o={id:"schemas/set/index",title:"set",description:"Describes set values. Sets can contain numbers, strings, or binaries:",source:"@site/docs/4-schemas/11-set/index.md",sourceDirName:"4-schemas/11-set",slug:"/schemas/set/",permalink:"/docs/schemas/set/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"set",sidebar_custom_props:{code:!0}},sidebar:"tutorialSidebar",previous:{title:"binary",permalink:"/docs/schemas/binary/"},next:{title:"list",permalink:"/docs/schemas/list/"}},d={},u=[{value:"Options",id:"options",level:2},{value:"<code>.required()</code>",id:"required",level:3},{value:"<code>.hidden()</code>",id:"hidden",level:3},{value:"<code>.key()</code>",id:"key",level:3},{value:"<code>.savedAs(...)</code>",id:"savedas",level:3},{value:"<code>.default(...)</code>",id:"default",level:3},{value:"<code>.link&lt;Schema&gt;(...)</code>",id:"linkschema",level:3},{value:"<code>.validate(...)</code>",id:"validate",level:3}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"set",children:"Set"})}),"\n",(0,t.jsxs)(n.p,{children:["Describes ",(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes",children:(0,t.jsx)(n.strong,{children:"set values"})}),". Sets can contain ",(0,t.jsx)(n.a,{href:"/docs/schemas/number/",children:(0,t.jsx)(n.code,{children:"numbers"})}),", ",(0,t.jsx)(n.a,{href:"/docs/schemas/string/",children:(0,t.jsx)(n.code,{children:"strings"})}),", or ",(0,t.jsx)(n.a,{href:"/docs/schemas/binary/",children:(0,t.jsx)(n.code,{children:"binaries"})}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import { set } from 'dynamodb-toolbox/schema/set';\nimport { string } from 'dynamodb-toolbox/schema/string';\n\nconst pokeTypeSchema = string().enum('fire', ...)\nconst pokemonTypesSchema = set(pokeTypeSchema)\n\ntype PokemonType = FormattedValue<typeof pokemonTypesSchema>;\n// => Set<'fire' | ...>\n"})}),"\n",(0,t.jsx)(n.p,{children:"Set elements must respect some constraints:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["They cannot be ",(0,t.jsx)(n.code,{children:"optional"})," or always required"]}),"\n",(0,t.jsxs)(n.li,{children:["They cannot be ",(0,t.jsx)(n.code,{children:"hidden"})," or ",(0,t.jsx)(n.code,{children:"key"})," (tagging the ",(0,t.jsx)(n.code,{children:"set"})," itself as ",(0,t.jsx)(n.code,{children:"key"})," is enough)"]}),"\n",(0,t.jsxs)(n.li,{children:["They cannot have ",(0,t.jsx)(n.code,{children:"default"})," or ",(0,t.jsx)(n.code,{children:"links"})]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"// \u274c Raises a type AND a run-time error\nconst strSet = set(string().optional())\nconst strSet = set(string().hidden())\nconst strSet = set(string().key())\nconst strSet = set(string().default('foo'))\n"})}),"\n",(0,t.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,t.jsx)(n.h3,{id:"required",children:(0,t.jsx)(n.code,{children:".required()"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"string | undefined"})})}),"\n",(0,t.jsxs)(n.p,{children:["Tags schema values as ",(0,t.jsx)(n.strong,{children:"required"})," (within ",(0,t.jsx)(n.a,{href:"/docs/schemas/item/",children:(0,t.jsx)(n.code,{children:"items"})})," or ",(0,t.jsx)(n.a,{href:"/docs/schemas/map/",children:(0,t.jsx)(n.code,{children:"maps"})}),"). Possible values are:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsxs)("code",{children:["'atLeastOnce' ",(0,t.jsx)("i",{children:"(default)"})]}),": Required (starting value)"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"'always'"}),": Always required (including updates)"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"'never'"}),": Optional"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"// Equivalent\nconst pokeTypesSchema = set(pokeTypeSchema)\nconst pokeTypesSchema = set(pokeTypeSchema).required()\nconst pokeTypesSchema = set(\n  pokeTypeSchema,\n  // Options can be provided as 2nd argument\n  { required: 'atLeastOnce' }\n)\n\n// shorthand for `.required('never')`\nconst pokeTypesSchema = set(pokeTypeSchema).optional()\nconst pokeTypesSchema = set(..., { required: 'never' })\n"})}),"\n",(0,t.jsx)(n.h3,{id:"hidden",children:(0,t.jsx)(n.code,{children:".hidden()"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,t.jsxs)(n.p,{children:["Omits schema values during ",(0,t.jsx)(n.a,{href:"/docs/schemas/actions/format",children:"formatting"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const pokeTypesSchema = set(pokeTypeSchema).hidden()\nconst pokeTypesSchema = set(..., { hidden: true })\n"})}),"\n",(0,t.jsx)(n.h3,{id:"key",children:(0,t.jsx)(n.code,{children:".key()"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,t.jsx)(n.p,{children:"Tags schema values as a primary key attribute or linked to a primary key attribute:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"// Note: The method also sets the `required` property to 'always'\n// (it is often the case in practice, you can still use `.optional()` if needed)\nconst pokeTypesSchema = set(pokeTypeSchema).key()\nconst pokeTypesSchema = set(..., {\n  key: true,\n  required: 'always'\n})\n"})}),"\n",(0,t.jsx)(n.h3,{id:"savedas",children:(0,t.jsx)(n.code,{children:".savedAs(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"string"})})}),"\n",(0,t.jsxs)(n.p,{children:["Renames schema values during the ",(0,t.jsx)(n.a,{href:"/docs/schemas/actions/parse",children:"transformation step"})," (within ",(0,t.jsx)(n.a,{href:"/docs/schemas/item/",children:(0,t.jsx)(n.code,{children:"items"})})," or ",(0,t.jsx)(n.a,{href:"/docs/schemas/map/",children:(0,t.jsx)(n.code,{children:"maps"})}),"):"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const pokeTypesSchema = set(pokeTypeSchema).savedAs('pt')\nconst pokeTypesSchema = set(..., { savedAs: 'pt' })\n"})}),"\n",(0,t.jsx)(n.h3,{id:"default",children:(0,t.jsx)(n.code,{children:".default(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"ValueOrGetter<Set<ELEMENTS>>"})})}),"\n",(0,t.jsxs)(n.p,{children:["Specifies default values. See ",(0,t.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,t.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,t.jsxs)(r.A,{children:[(0,t.jsx)(i.A,{value:"put-update",label:"Put/Update",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const now = () => new Date().toISOString()\n\nconst timestampsSchema = set(string())\n  .default(() => new Set([now()]))\n  .updateDefault(() => $add(now()))\n// \ud83d\udc47 Similar to\nconst timestampsSchema = set(string())\n  .putDefault(() => new Set([now()]))\n  .updateDefault(() => $add(now()))\n// \ud83d\udc47 ...or\nconst timestampsSchema = set({\n  putDefault: () => new Set([now()])\n})\n"})})}),(0,t.jsx)(i.A,{value:"key",label:"Key",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const defaultSpecifiers = new Set(['POKEMON'])\n\nconst specifiersSchema = set(string())\n  .key()\n  .default(defaultSpecifiers)\n// \ud83d\udc47 Similar to\nconst specifiersSchema = set(string())\n  .key()\n  .keyDefault(defaultSpecifiers)\n// \ud83d\udc47 ...or\nconst specifiersSchema = set({\n  key: true,\n  required: 'always',\n  keyDefault: defaultSpecifiers\n})\n"})})})]})}),"\n",(0,t.jsx)(n.h3,{id:"linkschema",children:(0,t.jsx)(n.code,{children:".link<Schema>(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"Link<SCHEMA, Set<ELEMENTS>>"})})}),"\n",(0,t.jsxs)(n.p,{children:["Similar to ",(0,t.jsx)(n.a,{href:"#default",children:(0,t.jsx)(n.code,{children:".default(...)"})})," but allows deriving the default value from other attributes. See ",(0,t.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const pokemonSchema = item({\n  pokeTypeList: list(pokeTypeSchema)\n}).and(prevSchema => ({\n  pokeTypeSet: set(pokeTypeSchema).link<typeof prevSchema>(\n    // \ud83d\ude4c Correctly typed!\n    item => new Set(item.pokeTypeList)\n  )\n}))\n"})}),"\n",(0,t.jsx)(n.h3,{id:"validate",children:(0,t.jsx)(n.code,{children:".validate(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"Validator<Set<ELEMENTS>>"})})}),"\n",(0,t.jsxs)(n.p,{children:["Adds custom validation. See ",(0,t.jsx)(n.a,{href:"/docs/schemas/custom-validation/",children:"Custom Validation"})," for more details:"]}),"\n",(0,t.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const nonEmptySetSchema = set(string()).validate(\n  input => input.size > 0\n)\n// \ud83d\udc47 Similar to\nconst nonEmptySetSchema = set(string()).putValidate(\n  input => input.size > 0\n)\n// \ud83d\udc47 ...or\nconst nonEmptySetSchema = set(string(), {\n  putValidator: input => input.size > 0\n})\n"})})})]})}function p(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},9365:(e,n,s)=>{s.d(n,{A:()=>i});s(6540);var t=s(8215);const a={tabItem:"tabItem_Ymn6"};var r=s(4848);function i(e){let{children:n,hidden:s,className:i}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,t.A)(a.tabItem,i),hidden:s,children:n})}},1470:(e,n,s)=>{s.d(n,{A:()=>S});var t=s(6540),a=s(8215),r=s(3104),i=s(6347),l=s(205),c=s(7485),o=s(1682),d=s(679);function u(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:s}=e;return(0,t.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:s,attributes:t,default:a}}=e;return{value:n,label:s,attributes:t,default:a}}))}(s);return function(e){const n=(0,o.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,s])}function p(e){let{value:n,tabValues:s}=e;return s.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:s}=e;const a=(0,i.W6)(),r=function(e){let{queryString:n=!1,groupId:s}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!s)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return s??null}({queryString:n,groupId:s});return[(0,c.aZ)(r),(0,t.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(a.location.search);n.set(r,e),a.replace({...a.location,search:n.toString()})}),[r,a])]}function x(e){const{defaultValue:n,queryString:s=!1,groupId:a}=e,r=h(e),[i,c]=(0,t.useState)((()=>function(e){let{defaultValue:n,tabValues:s}=e;if(0===s.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:s}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${s.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=s.find((e=>e.default))??s[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:r}))),[o,u]=m({queryString:s,groupId:a}),[x,f]=function(e){let{groupId:n}=e;const s=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,r]=(0,d.Dv)(s);return[a,(0,t.useCallback)((e=>{s&&r.set(e)}),[s,r])]}({groupId:a}),j=(()=>{const e=o??x;return p({value:e,tabValues:r})?e:null})();(0,l.A)((()=>{j&&c(j)}),[j]);return{selectedValue:i,selectValue:(0,t.useCallback)((e=>{if(!p({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);c(e),u(e),f(e)}),[u,f,r]),tabValues:r}}var f=s(2303);const j={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var y=s(4848);function g(e){let{className:n,block:s,selectedValue:t,selectValue:i,tabValues:l}=e;const c=[],{blockElementScrollPositionUntilNextRender:o}=(0,r.a_)(),d=e=>{const n=e.currentTarget,s=c.indexOf(n),a=l[s].value;a!==t&&(o(n),i(a))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const s=c.indexOf(e.currentTarget)+1;n=c[s]??c[0];break}case"ArrowLeft":{const s=c.indexOf(e.currentTarget)-1;n=c[s]??c[c.length-1];break}}n?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":s},n),children:l.map((e=>{let{value:n,label:s,attributes:r}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:t===n?0:-1,"aria-selected":t===n,ref:e=>c.push(e),onKeyDown:u,onClick:d,...r,className:(0,a.A)("tabs__item",j.tabItem,r?.className,{"tabs__item--active":t===n}),children:s??n},n)}))})}function v(e){let{lazy:n,children:s,selectedValue:r}=e;const i=(Array.isArray(s)?s:[s]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===r));return e?(0,t.cloneElement)(e,{className:(0,a.A)("margin-top--md",e.props.className)}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,t.cloneElement)(e,{key:n,hidden:e.props.value!==r})))})}function b(e){const n=x(e);return(0,y.jsxs)("div",{className:(0,a.A)("tabs-container",j.tabList),children:[(0,y.jsx)(g,{...n,...e}),(0,y.jsx)(v,{...n,...e})]})}function S(e){const n=(0,f.A)();return(0,y.jsx)(b,{...e,children:u(e.children)},String(n))}},8453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>l});var t=s(6540);const a={},r=t.createContext(a);function i(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);