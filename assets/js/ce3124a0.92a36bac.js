"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[6698],{7639:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>u});var r=t(4848),s=t(8453),a=t(1470),i=t(9365);const l={title:"string",sidebar_custom_props:{code:!0}},o="String",c={id:"schemas/string/index",title:"string",description:"Defines a string attribute:",source:"@site/docs/4-schemas/9-string/index.md",sourceDirName:"4-schemas/9-string",slug:"/schemas/string/",permalink:"/docs/schemas/string/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"string",sidebar_custom_props:{code:!0}},sidebar:"tutorialSidebar",previous:{title:"number",permalink:"/docs/schemas/number/"},next:{title:"binary",permalink:"/docs/schemas/binary/"}},d={},u=[{value:"Options",id:"options",level:2},{value:"<code>.required()</code>",id:"required",level:3},{value:"<code>.hidden()</code>",id:"hidden",level:3},{value:"<code>.key()</code>",id:"key",level:3},{value:"<code>.savedAs(...)</code>",id:"savedas",level:3},{value:"<code>.enum(...)</code>",id:"enum",level:3},{value:"<code>.transform(...)</code>",id:"transform",level:3},{value:"<code>.default(...)</code>",id:"default",level:3},{value:"<code>.link&lt;Schema&gt;(...)</code>",id:"linkschema",level:3},{value:"<code>.validate(...)</code>",id:"validate",level:3}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"string",children:"String"})}),"\n",(0,r.jsxs)(n.p,{children:["Defines a ",(0,r.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes",children:(0,r.jsx)(n.strong,{children:"string attribute"})}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { string } from 'dynamodb-toolbox/attributes/string';\n\nconst pokemonSchema = schema({\n  ...\n  name: string(),\n});\n\ntype FormattedPokemon = FormattedItem<typeof PokemonEntity>;\n// => {\n//   ...\n//   name: string\n// }\n"})}),"\n",(0,r.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,r.jsx)(n.h3,{id:"required",children:(0,r.jsx)(n.code,{children:".required()"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"string | undefined"})})}),"\n",(0,r.jsxs)(n.p,{children:["Tags the attribute as ",(0,r.jsx)(n.strong,{children:"required"})," (at root level or within ",(0,r.jsx)(n.a,{href:"/docs/schemas/map/",children:"Maps"}),"). Possible values are:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsxs)("code",{children:["'atLeastOnce' ",(0,r.jsx)("i",{children:"(default)"})]}),": Required (starting value)"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"'always'"}),": Always required (including updates)"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"'never'"}),": Optional"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"// Equivalent\nconst nameSchema = string()\nconst nameSchema = string().required()\nconst nameSchema = string({ required: 'atLeastOnce' })\n\n// shorthand for `.required('never')`\nconst nameSchema = string().optional()\nconst nameSchema = string({ required: 'never' })\n"})}),"\n",(0,r.jsx)(n.h3,{id:"hidden",children:(0,r.jsx)(n.code,{children:".hidden()"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,r.jsx)(n.p,{children:"Skips the attribute when formatting items:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const nameSchema = string().hidden()\nconst nameSchema = string({ hidden: true })\n"})}),"\n",(0,r.jsx)(n.h3,{id:"key",children:(0,r.jsx)(n.code,{children:".key()"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,r.jsx)(n.p,{children:"Tags the attribute as a primary key attribute or linked to a primary attribute:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"// Note: The method also sets the `required` property to 'always'\n// (it is often the case in practice, you can still use `.optional()` if needed)\nconst nameSchema = string().key()\nconst nameSchema = string({\n  key: true,\n  required: 'always'\n})\n"})}),"\n",(0,r.jsx)(n.h3,{id:"savedas",children:(0,r.jsx)(n.code,{children:".savedAs(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"string"})})}),"\n",(0,r.jsxs)(n.p,{children:["Renames the attribute during the ",(0,r.jsx)(n.a,{href:"/docs/schemas/actions/parse",children:"transformation step"})," (at root level or within ",(0,r.jsx)(n.a,{href:"/docs/schemas/map/",children:"Maps"}),"):"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const nameSchema = string().savedAs('n')\nconst nameSchema = string({ savedAs: 'n' })\n"})}),"\n",(0,r.jsx)(n.h3,{id:"enum",children:(0,r.jsx)(n.code,{children:".enum(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"string[]"})})}),"\n",(0,r.jsx)(n.p,{children:"Provides a finite range of possible values:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const pokeTypeSchema = string().enum('fire', 'water', ...)\n\n// \ud83d\udc47 Equivalent to `.enum('fire').default('fire')`\nconst pokeTypeSchema = string().const('fire')\n"})}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["For type inference reasons, the ",(0,r.jsx)(n.code,{children:"enum"})," option is only available as a method and not as a constructor property."]})}),"\n",(0,r.jsx)(n.h3,{id:"transform",children:(0,r.jsx)(n.code,{children:".transform(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"Transformer<string>"})})}),"\n",(0,r.jsxs)(n.p,{children:["Allows modifying the attribute values during the ",(0,r.jsx)(n.a,{href:"/docs/schemas/actions/parse",children:"transformation step"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const PREFIX = 'PREFIX#'\n\nconst prefix = {\n  parse: (input: string) => [PREFIX, input].join(''),\n  format: (saved: string) => saved.slice(PREFIX.length)\n}\n\n// Prefixes the value\nconst prefixedStrSchema = string().transform(prefix)\nconst prefixedStrSchema = string({ transform: prefix })\n"})}),"\n",(0,r.jsxs)(n.p,{children:["DynamoDB-Toolbox exposes ",(0,r.jsx)(n.a,{href:"/docs/schemas/transformers/usage",children:"on-the-shelf transformers"})," (including ",(0,r.jsx)(n.a,{href:"/docs/schemas/transformers/prefix",children:(0,r.jsx)(n.code,{children:"prefix"})}),"), so feel free to use them!"]}),"\n",(0,r.jsx)(n.h3,{id:"default",children:(0,r.jsx)(n.code,{children:".default(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"ValueOrGetter<string>"})})}),"\n",(0,r.jsxs)(n.p,{children:["Specifies default values for the attribute. See ",(0,r.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,r.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,r.jsxs)(a.A,{children:[(0,r.jsx)(i.A,{value:"put",label:"Put",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const nameSchema = string().default('Pikachu')\n// \ud83d\udc47 Similar to\nconst nameSchema = string().putDefault('Pikachu')\n// \ud83d\udc47 ...or\nconst nameSchema = string({\n  defaults: {\n    key: undefined,\n    put: 'Pikachu',\n    update: undefined\n  }\n})\n\n// \ud83d\ude4c Getters also work!\nconst nameSchema = string().default(() => 'Pikachu')\n"})})}),(0,r.jsx)(i.A,{value:"key",label:"Key",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const nameSchema = string().key().default('Pikachu')\n// \ud83d\udc47 Similar to\nconst nameSchema = string().key().keyDefault('Pikachu')\n// \ud83d\udc47 ...or\nconst nameSchema = string({\n  defaults: {\n    key: 'Pikachu',\n    // put & update defaults are not useful in `key` attributes\n    put: undefined,\n    update: undefined\n  },\n  key: true,\n  required: 'always'\n})\n"})})}),(0,r.jsx)(i.A,{value:"update",label:"Update",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"// \ud83d\udc47 Records the date at each update\nconst lastUpdatedSchema = string().updateDefault(() =>\n  new Date().toISOString()\n)\n// \ud83d\udc47 Similar to\nconst lastUpdatedSchema = string({\n  defaults: {\n    key: undefined,\n    put: undefined,\n    update: () => new Date().toISOString()\n  }\n})\n"})})})]})}),"\n",(0,r.jsx)(n.h3,{id:"linkschema",children:(0,r.jsx)(n.code,{children:".link<Schema>(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"Link<SCHEMA, string>"})})}),"\n",(0,r.jsxs)(n.p,{children:["Similar to ",(0,r.jsx)(n.a,{href:"#default",children:(0,r.jsx)(n.code,{children:".default(...)"})})," but allows deriving the default value from other attributes. See ",(0,r.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const pokemonSchema = schema({\n  level: string()\n}).and(prevSchema => ({\n  captureLevel: string().link<typeof prevSchema>(\n    // \ud83d\ude4c Correctly typed!\n    item => item.level\n  )\n}))\n"})}),"\n",(0,r.jsx)(n.h3,{id:"validate",children:(0,r.jsx)(n.code,{children:".validate(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:(0,r.jsx)("code",{children:"Validator<string>"})})}),"\n",(0,r.jsxs)(n.p,{children:["Adds custom validation to the attribute. See ",(0,r.jsx)(n.a,{href:"/docs/schemas/custom-validation/",children:"Custom Validation"})," for more details:"]}),"\n",(0,r.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const longStrSchema = string().validate(\n  input => input.length > 3\n)\n// \ud83d\udc47 Similar to\nconst longStrSchema = string().putValidate(\n  input => input.length > 3\n)\n// \ud83d\udc47 ...or\nconst longStrSchema = string({\n  validators: {\n    key: undefined,\n    put: input => input.length > 3,\n    update: undefined\n  }\n})\n"})})})]})}function m(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},9365:(e,n,t)=>{t.d(n,{A:()=>i});t(6540);var r=t(8215);const s={tabItem:"tabItem_Ymn6"};var a=t(4848);function i(e){let{children:n,hidden:t,className:i}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,r.A)(s.tabItem,i),hidden:t,children:n})}},1470:(e,n,t)=>{t.d(n,{A:()=>S});var r=t(6540),s=t(8215),a=t(3104),i=t(6347),l=t(205),o=t(7485),c=t(1682),d=t(679);function u(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:r,default:s}}=e;return{value:n,label:t,attributes:r,default:s}}))}(t);return function(e){const n=(0,c.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function m(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:t}=e;const s=(0,i.W6)(),a=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,o.aZ)(a),(0,r.useCallback)((e=>{if(!a)return;const n=new URLSearchParams(s.location.search);n.set(a,e),s.replace({...s.location,search:n.toString()})}),[a,s])]}function f(e){const{defaultValue:n,queryString:t=!1,groupId:s}=e,a=h(e),[i,o]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const r=t.find((e=>e.default))??t[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:n,tabValues:a}))),[c,u]=p({queryString:t,groupId:s}),[f,x]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[s,a]=(0,d.Dv)(t);return[s,(0,r.useCallback)((e=>{t&&a.set(e)}),[t,a])]}({groupId:s}),g=(()=>{const e=c??f;return m({value:e,tabValues:a})?e:null})();(0,l.A)((()=>{g&&o(g)}),[g]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!m({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),x(e)}),[u,x,a]),tabValues:a}}var x=t(2303);const g={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=t(4848);function v(e){let{className:n,block:t,selectedValue:r,selectValue:i,tabValues:l}=e;const o=[],{blockElementScrollPositionUntilNextRender:c}=(0,a.a_)(),d=e=>{const n=e.currentTarget,t=o.indexOf(n),s=l[t].value;s!==r&&(c(n),i(s))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=o.indexOf(e.currentTarget)+1;n=o[t]??o[0];break}case"ArrowLeft":{const t=o.indexOf(e.currentTarget)-1;n=o[t]??o[o.length-1];break}}n?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.A)("tabs",{"tabs--block":t},n),children:l.map((e=>{let{value:n,label:t,attributes:a}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:e=>o.push(e),onKeyDown:u,onClick:d,...a,className:(0,s.A)("tabs__item",g.tabItem,a?.className,{"tabs__item--active":r===n}),children:t??n},n)}))})}function b(e){let{lazy:n,children:t,selectedValue:a}=e;const i=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:(0,s.A)("margin-top--md",e.props.className)}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a})))})}function y(e){const n=f(e);return(0,j.jsxs)("div",{className:(0,s.A)("tabs-container",g.tabList),children:[(0,j.jsx)(v,{...n,...e}),(0,j.jsx)(b,{...n,...e})]})}function S(e){const n=(0,x.A)();return(0,j.jsx)(y,{...e,children:u(e.children)},String(n))}},8453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>l});var r=t(6540);const s={},a=r.createContext(s);function i(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);