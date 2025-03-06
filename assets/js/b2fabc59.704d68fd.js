"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2791],{4240:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>c,metadata:()=>d,toc:()=>u});var s=r(4848),a=r(8453),t=r(1470),i=r(9365);const c={title:"record",sidebar_custom_props:{code:!0}},o="Record",d={id:"schemas/record/index",title:"record",description:"Describes a different kind of map attribute. Records differ from maps as they can have a non-explicit (and potentially infinite) range of keys, but have a single value type:",source:"@site/docs/4-schemas/15-record/index.md",sourceDirName:"4-schemas/15-record",slug:"/schemas/record/",permalink:"/docs/schemas/record/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"record",sidebar_custom_props:{code:!0}},sidebar:"tutorialSidebar",previous:{title:"map",permalink:"/docs/schemas/map/"},next:{title:"anyOf",permalink:"/docs/schemas/anyOf/"}},l={},u=[{value:"Options",id:"options",level:2},{value:"<code>.required()</code>",id:"required",level:3},{value:"<code>.hidden()</code>",id:"hidden",level:3},{value:"<code>.key()</code>",id:"key",level:3},{value:"<code>.savedAs(...)</code>",id:"savedas",level:3},{value:"<code>.partial()</code>",id:"partial",level:3},{value:"<code>.default(...)</code>",id:"default",level:3},{value:"<code>.link&lt;Schema&gt;(...)</code>",id:"linkschema",level:3},{value:"<code>.validate(...)</code>",id:"validate",level:3}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"record",children:"Record"})}),"\n",(0,s.jsxs)(n.p,{children:["Describes a different kind of ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes",children:(0,s.jsx)(n.strong,{children:"map attribute"})}),". Records differ from ",(0,s.jsx)(n.a,{href:"/docs/schemas/map/",children:(0,s.jsx)(n.code,{children:"maps"})})," as they can have a non-explicit (and potentially infinite) range of keys, but have a single value type:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { record } from 'dynamodb-toolbox/schema/record'\n\nconst pokeTypeSchema = string().enum('fire', ...)\nconst weaknessesSchema = record(pokeTypeSchema, number())\n\ntype Weaknesses = FormattedValue<typeof weaknessesSchema>\n// => Record<PokeType, number>\n"})}),"\n",(0,s.jsx)(n.p,{children:"Record elements can have any type. However, they must respect some constraints:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["They cannot be ",(0,s.jsx)(n.code,{children:"optional"})," or always required"]}),"\n",(0,s.jsxs)(n.li,{children:["They cannot be ",(0,s.jsx)(n.code,{children:"hidden"})," or ",(0,s.jsx)(n.code,{children:"key"})," (tagging the ",(0,s.jsx)(n.code,{children:"record"})," itself as ",(0,s.jsx)(n.code,{children:"key"})," is enough)"]}),"\n",(0,s.jsxs)(n.li,{children:["They cannot have ",(0,s.jsx)(n.code,{children:"default"})," or ",(0,s.jsx)(n.code,{children:"links"})]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// \u274c Raises a type AND a run-time error\nconst strRecord = record(string(), string().optional())\nconst strRecord = record(string(), string().hidden())\nconst strRecord = record(string(), string().key())\nconst strRecord = record(string(), string().default('foo'))\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Record keys share the same constraints and must be of type ",(0,s.jsx)(n.a,{href:"/docs/schemas/string/",children:(0,s.jsx)(n.code,{children:"string"})}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,s.jsx)(n.h3,{id:"required",children:(0,s.jsx)(n.code,{children:".required()"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"string | undefined"})})}),"\n",(0,s.jsxs)(n.p,{children:["Tags schema values as ",(0,s.jsx)(n.strong,{children:"required"})," (within ",(0,s.jsx)(n.a,{href:"/docs/schemas/item/",children:(0,s.jsx)(n.code,{children:"items"})})," or ",(0,s.jsx)(n.a,{href:"/docs/schemas/map/",children:(0,s.jsx)(n.code,{children:"maps"})}),"). Possible values are:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsxs)("code",{children:["'atLeastOnce' ",(0,s.jsx)("i",{children:"(default)"})]}),": Required (starting value)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"'always'"}),": Always required (including updates)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"'never'"}),": Optional"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Equivalent\nconst weaknessesSchema = record(\n  string().enum('fire', ...),\n  number()\n)\nconst weaknessesSchema = record(\n  string().enum('fire', ...),\n  number()\n).required()\nconst weaknessesSchema = record(\n  string().enum('fire', ...),\n  number(),\n  // Options can be provided as 3rd argument\n  { required: 'atLeastOnce' }\n)\n\n// shorthand for `.required('never')`\nconst weaknessesSchema = record(...).optional()\nconst weaknessesSchema = record(..., { required: 'never' })\n"})}),"\n",(0,s.jsx)(n.h3,{id:"hidden",children:(0,s.jsx)(n.code,{children:".hidden()"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,s.jsxs)(n.p,{children:["Omits schema values during ",(0,s.jsx)(n.a,{href:"/docs/schemas/actions/format",children:"formatting"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const weaknessesSchema = record(\n  string().enum('fire', ...),\n  number()\n).hidden()\nconst weaknessesSchema = record(..., { hidden: true })\n"})}),"\n",(0,s.jsx)(n.h3,{id:"key",children:(0,s.jsx)(n.code,{children:".key()"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,s.jsx)(n.p,{children:"Tags schema values as a primary key attribute or linked to a primary key attribute:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Note: The method also sets the `required` property to 'always'\n// (it is often the case in practice, you can still use `.optional()` if needed)\nconst idsSchema = record(string(), string()).key()\nconst idsSchema = record(..., {\n  key: true,\n  required: 'always'\n})\n"})}),"\n",(0,s.jsx)(n.h3,{id:"savedas",children:(0,s.jsx)(n.code,{children:".savedAs(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"string"})})}),"\n",(0,s.jsxs)(n.p,{children:["Renames schema values during the ",(0,s.jsx)(n.a,{href:"/docs/schemas/actions/parse",children:"transformation step"})," (within ",(0,s.jsx)(n.a,{href:"/docs/schemas/item/",children:(0,s.jsx)(n.code,{children:"items"})})," or ",(0,s.jsx)(n.a,{href:"/docs/schemas/map/",children:(0,s.jsx)(n.code,{children:"maps"})}),"):"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const weaknessesSchema = record(\n  string().enum('fire', ...),\n  number()\n).savedAs('w')\nconst weaknessesSchema = record(..., { savedAs: 'w' })\n"})}),"\n",(0,s.jsx)(n.h3,{id:"partial",children:(0,s.jsx)(n.code,{children:".partial()"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,s.jsxs)(n.p,{children:["Turns the record into a ",(0,s.jsx)(n.strong,{children:"partial"})," record:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const weaknessesSchema = record(\n  string().enum('fire', ...),\n  number()\n).partial()\nconst weaknessesSchema = record(..., { partial: true })\n\ntype Weaknesses = FormattedValue<typeof weaknessesSchema>\n// => Partial<Record<PokeType, number>>\n"})}),"\n",(0,s.jsx)(n.h3,{id:"default",children:(0,s.jsx)(n.code,{children:".default(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"ValueOrGetter<ATTRIBUTES>"})})}),"\n",(0,s.jsxs)(n.p,{children:["Specifies default values. See ",(0,s.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,s.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(t.A,{children:[(0,s.jsx)(i.A,{value:"put-update",label:"Put/Update",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const now = () => new Date().toISOString()\n\nconst timestampsSchema = record(string(), string())\n  .default(() => ({ created: now() }))\n  .updateDefault(() => ({ updated: now() }))\n// \ud83d\udc47 Similar to\nconst timestampsSchema = record(...)\n  .putDefault(() => ({ created: now() }))\n  .updateDefault(() => ({ updated: now() }))\n// \ud83d\udc47 ...or\nconst timestampsSchema = record(..., {\n  putDefault: () => ({ created: now() }),\n  updateDefault: () => ({ updated: now() })\n})\n"})})}),(0,s.jsx)(i.A,{value:"key",label:"Key",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const idsSchema = record(string(), string())\n  .key()\n  .default({ abc: '123' })\n// \ud83d\udc47 Similar to\nconst idsSchema = record(...)\n  .key()\n  .keyDefault({ abc: '123' })\n// \ud83d\udc47 ...or\nconst idsSchema = record(..., {\n  key: true,\n  required: 'always',\n  keyDefault: { abc: '123' }\n})\n"})})})]})}),"\n",(0,s.jsx)(n.h3,{id:"linkschema",children:(0,s.jsx)(n.code,{children:".link<Schema>(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"Link<SCHEMA, ATTRIBUTES>"})})}),"\n",(0,s.jsxs)(n.p,{children:["Similar to ",(0,s.jsx)(n.a,{href:"#default",children:(0,s.jsx)(n.code,{children:".default(...)"})})," but allows deriving the default value from other attributes. See ",(0,s.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const pokemonSchema = item({\n  name: string()\n}).and(prevSchema => ({\n  parsedName: record(string(), string()).link<\n    typeof prevSchema\n  >(\n    // \ud83d\ude4c Correctly typed!\n    ({ name }) => {\n      const [firstName, lastName] = name.split(' ')\n      return { firstName, lastName }\n    }\n  )\n}))\n"})}),"\n",(0,s.jsx)(n.h3,{id:"validate",children:(0,s.jsx)(n.code,{children:".validate(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"Validator<ATTRIBUTES>"})})}),"\n",(0,s.jsxs)(n.p,{children:["Adds custom validation. See ",(0,s.jsx)(n.a,{href:"/docs/schemas/custom-validation/",children:"Custom Validation"})," for more details:"]}),"\n",(0,s.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const nonEmptyRecordSchema = record(\n  string(),\n  string()\n).validate(input => Object.keys(input).length > 0)\n// \ud83d\udc47 Similar to\nconst nonEmptyRecordSchema = record(\n  string(),\n  string()\n).putValidate(input => Object.keys(input).length > 0)\n// \ud83d\udc47 ...or\nconst nonEmptyRecordSchema = record(string(), string(), {\n  putValidator: input => Object.keys(input).length > 0\n})\n"})})})]})}function m(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},9365:(e,n,r)=>{r.d(n,{A:()=>i});r(6540);var s=r(8215);const a={tabItem:"tabItem_Ymn6"};var t=r(4848);function i(e){let{children:n,hidden:r,className:i}=e;return(0,t.jsx)("div",{role:"tabpanel",className:(0,s.A)(a.tabItem,i),hidden:r,children:n})}},1470:(e,n,r)=>{r.d(n,{A:()=>k});var s=r(6540),a=r(8215),t=r(3104),i=r(6347),c=r(205),o=r(7485),d=r(1682),l=r(679);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:r}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:r,attributes:s,default:a}}=e;return{value:n,label:r,attributes:s,default:a}}))}(r);return function(e){const n=(0,d.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,r])}function m(e){let{value:n,tabValues:r}=e;return r.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:r}=e;const a=(0,i.W6)(),t=function(e){let{queryString:n=!1,groupId:r}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:n,groupId:r});return[(0,o.aZ)(t),(0,s.useCallback)((e=>{if(!t)return;const n=new URLSearchParams(a.location.search);n.set(t,e),a.replace({...a.location,search:n.toString()})}),[t,a])]}function x(e){const{defaultValue:n,queryString:r=!1,groupId:a}=e,t=h(e),[i,o]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=r.find((e=>e.default))??r[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:t}))),[d,u]=p({queryString:r,groupId:a}),[x,f]=function(e){let{groupId:n}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,t]=(0,l.Dv)(r);return[a,(0,s.useCallback)((e=>{r&&t.set(e)}),[r,t])]}({groupId:a}),j=(()=>{const e=d??x;return m({value:e,tabValues:t})?e:null})();(0,c.A)((()=>{j&&o(j)}),[j]);return{selectedValue:i,selectValue:(0,s.useCallback)((e=>{if(!m({value:e,tabValues:t}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),f(e)}),[u,f,t]),tabValues:t}}var f=r(2303);const j={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var g=r(4848);function b(e){let{className:n,block:r,selectedValue:s,selectValue:i,tabValues:c}=e;const o=[],{blockElementScrollPositionUntilNextRender:d}=(0,t.a_)(),l=e=>{const n=e.currentTarget,r=o.indexOf(n),a=c[r].value;a!==s&&(d(n),i(a))},u=e=>{let n=null;switch(e.key){case"Enter":l(e);break;case"ArrowRight":{const r=o.indexOf(e.currentTarget)+1;n=o[r]??o[0];break}case"ArrowLeft":{const r=o.indexOf(e.currentTarget)-1;n=o[r]??o[o.length-1];break}}n?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":r},n),children:c.map((e=>{let{value:n,label:r,attributes:t}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>o.push(e),onKeyDown:u,onClick:l,...t,className:(0,a.A)("tabs__item",j.tabItem,t?.className,{"tabs__item--active":s===n}),children:r??n},n)}))})}function v(e){let{lazy:n,children:r,selectedValue:t}=e;const i=(Array.isArray(r)?r:[r]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===t));return e?(0,s.cloneElement)(e,{className:(0,a.A)("margin-top--md",e.props.className)}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==t})))})}function y(e){const n=x(e);return(0,g.jsxs)("div",{className:(0,a.A)("tabs-container",j.tabList),children:[(0,g.jsx)(b,{...n,...e}),(0,g.jsx)(v,{...n,...e})]})}function k(e){const n=(0,f.A)();return(0,g.jsx)(y,{...e,children:u(e.children)},String(n))}},8453:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>c});var s=r(6540);const a={},t=s.createContext(a);function i(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);