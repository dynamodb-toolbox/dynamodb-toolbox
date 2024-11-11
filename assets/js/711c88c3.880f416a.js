"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3977],{8569:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>u});var t=a(4848),r=a(8453),s=a(1470),i=a(9365);const l={title:"binary",sidebar_custom_props:{code:!0}},o="Binary",c={id:"schemas/binary/index",title:"binary",description:"Defines a binary attribute:",source:"@site/docs/4-schemas/10-binary/index.md",sourceDirName:"4-schemas/10-binary",slug:"/schemas/binary/",permalink:"/docs/schemas/binary/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"binary",sidebar_custom_props:{code:!0}},sidebar:"tutorialSidebar",previous:{title:"string",permalink:"/docs/schemas/string/"},next:{title:"set",permalink:"/docs/schemas/set/"}},d={},u=[{value:"Options",id:"options",level:2},{value:"<code>.required()</code>",id:"required",level:3},{value:"<code>.hidden()</code>",id:"hidden",level:3},{value:"<code>.key()</code>",id:"key",level:3},{value:"<code>.savedAs(...)</code>",id:"savedas",level:3},{value:"<code>.enum(...)</code>",id:"enum",level:3},{value:"<code>.transform(...)</code>",id:"transform",level:3},{value:"<code>.default(...)</code>",id:"default",level:3},{value:"<code>.link&lt;Schema&gt;(...)</code>",id:"linkschema",level:3},{value:"<code>.validate(...)</code>",id:"validate",level:3}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"binary",children:"Binary"})}),"\n",(0,t.jsxs)(n.p,{children:["Defines a ",(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes",children:(0,t.jsx)(n.strong,{children:"binary attribute"})}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"import { binary } from 'dynamodb-toolbox/attributes/binary';\n\nconst pokemonSchema = schema({\n  ...\n  hash: binary(),\n});\n\ntype FormattedPokemon = FormattedItem<typeof PokemonEntity>;\n// => {\n//   ...\n//   hash: Uint8Array\n// }\n"})}),"\n",(0,t.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,t.jsx)(n.h3,{id:"required",children:(0,t.jsx)(n.code,{children:".required()"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"string | undefined"})})}),"\n",(0,t.jsxs)(n.p,{children:["Tags the attribute as ",(0,t.jsx)(n.strong,{children:"required"})," (at root level or within ",(0,t.jsx)(n.a,{href:"/docs/schemas/map/",children:"Maps"}),"). Possible values are:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsxs)("code",{children:["'atLeastOnce' ",(0,t.jsx)("i",{children:"(default)"})]}),": Required (starting value)"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"'always'"}),": Always required (including updates)"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"'never'"}),": Optional"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"// Equivalent\nconst hashSchema = binary()\nconst hashSchema = binary().required()\nconst hashSchema = binary({ required: 'atLeastOnce' })\n\n// shorthand for `.required('never')`\nconst hashSchema = binary().optional()\nconst hashSchema = binary({ required: 'never' })\n"})}),"\n",(0,t.jsx)(n.h3,{id:"hidden",children:(0,t.jsx)(n.code,{children:".hidden()"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,t.jsx)(n.p,{children:"Skips the attribute when formatting items:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const hashSchema = binary().hidden()\nconst hashSchema = binary({ hidden: true })\n"})}),"\n",(0,t.jsx)(n.h3,{id:"key",children:(0,t.jsx)(n.code,{children:".key()"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,t.jsx)(n.p,{children:"Tags the attribute as needed to compute the primary key:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"// Note: The method also sets the `required` property to 'always'\n// (it is often the case in practice, you can still use `.optional()` if needed)\nconst hashSchema = binary().key()\nconst hashSchema = binary({\n  key: true,\n  required: 'always'\n})\n"})}),"\n",(0,t.jsx)(n.h3,{id:"savedas",children:(0,t.jsx)(n.code,{children:".savedAs(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"string"})})}),"\n",(0,t.jsxs)(n.p,{children:["Renames the attribute during the ",(0,t.jsx)(n.a,{href:"/docs/schemas/actions/parse",children:"transformation step"})," (at root level or within ",(0,t.jsx)(n.a,{href:"/docs/schemas/map/",children:"Maps"}),"):"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const hashSchema = binary().savedAs('h')\nconst hashSchema = binary({ savedAs: 'h' })\n"})}),"\n",(0,t.jsx)(n.h3,{id:"enum",children:(0,t.jsx)(n.code,{children:".enum(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"Uint8Array[]"})})}),"\n",(0,t.jsx)(n.p,{children:"Provides a finite range of possible values:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const binA = new Uint8Array([1, 2, 3])\nconst binB = new Uint8Array([4, 5, 6])\n\nconst hashSchema = binary().enum(binA, binB, ...)\n\n// \ud83d\udc47 Equivalent to `.enum(binA).default(binA)`\nconst hashSchema = binary().const(binA)\n"})}),"\n",(0,t.jsx)(n.admonition,{type:"info",children:(0,t.jsxs)(n.p,{children:["For type inference reasons, the ",(0,t.jsx)(n.code,{children:"enum"})," option is only available as a method and not as a constructor property."]})}),"\n",(0,t.jsx)(n.h3,{id:"transform",children:(0,t.jsx)(n.code,{children:".transform(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"Transformer<Uint8Array>"})})}),"\n",(0,t.jsxs)(n.p,{children:["Allows modifying the attribute values during the ",(0,t.jsx)(n.a,{href:"/docs/schemas/actions/parse",children:"transformation step"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const PREFIX = new Uint8Array([1, 2, 3])\n\nconst prefix = {\n  parse: (input: Uint8Array) => {\n    const concat = new Uint8Array(\n      PREFIX.length + input.length\n    )\n    concat.set(PREFIX)\n    concat.set(input, PREFIX.length)\n\n    return concat\n  },\n  format: (saved: Uint8Array) => saved.slice(PREFIX.length)\n}\n\n// Prefixes the value\nconst hashSchema = binary().transform(prefix)\nconst hashSchema = binary({ transform: prefix })\n"})}),"\n",(0,t.jsxs)(n.p,{children:["DynamoDB-Toolbox exposes ",(0,t.jsx)(n.a,{href:"/docs/schemas/transformers/usage",children:"on-the-shelf transformers"}),", so feel free to use them!"]}),"\n",(0,t.jsx)(n.h3,{id:"default",children:(0,t.jsx)(n.code,{children:".default(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"ValueOrGetter<Uint8Array>"})})}),"\n",(0,t.jsxs)(n.p,{children:["Specifies default values for the attribute. See ",(0,t.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,t.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,t.jsxs)(s.A,{children:[(0,t.jsx)(i.A,{value:"put",label:"Put",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const bin = new Uint8Array([1, 2, 3])\n\nconst hashSchema = binary().default(bin)\n// \ud83d\udc47 Similar to\nconst hashSchema = binary().putDefault(bin)\n// \ud83d\udc47 ...or\nconst hashSchema = binary({\n  defaults: {\n    key: undefined,\n    put: bin,\n    update: undefined\n  }\n})\n\n// \ud83d\ude4c Getters also work!\nconst hashSchema = binary().default(() => bin)\n"})})}),(0,t.jsx)(i.A,{value:"key",label:"Key",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const bin = new Uint8Array([1, 2, 3])\n\nconst hashSchema = binary().key().default(bin)\n// \ud83d\udc47 Similar to\nconst hashSchema = binary().key().keyDefault(bin)\n// \ud83d\udc47 ...or\nconst hashSchema = binary({\n  defaults: {\n    key: bin,\n    // put & update defaults are not useful in `key` attributes\n    put: undefined,\n    update: undefined\n  },\n  key: true,\n  required: 'always'\n})\n"})})}),(0,t.jsx)(i.A,{value:"update",label:"Update",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const bin = new Uint8Array([1, 2, 3])\n\nconst hashSchema = binary().updateDefault(bin)\n// \ud83d\udc47 Similar to\nconst hashSchema = binary({\n  defaults: {\n    key: undefined,\n    put: undefined,\n    update: bin\n  }\n})\n"})})})]})}),"\n",(0,t.jsx)(n.h3,{id:"linkschema",children:(0,t.jsx)(n.code,{children:".link<Schema>(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"Link<SCHEMA, Uint8Array>"})})}),"\n",(0,t.jsxs)(n.p,{children:["Similar to ",(0,t.jsx)(n.a,{href:"#default",children:(0,t.jsx)(n.code,{children:".default(...)"})})," but allows deriving the default value from other attributes. See ",(0,t.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const encoder = new TextEncoder()\n\nconst pokemonSchema = schema({\n  name: string()\n}).and(prevSchema => ({\n  nameHash: binary().link<typeof prevSchema>(\n    // \ud83d\ude4c Correctly typed!\n    item => encoder.encode(item.name)\n  )\n}))\n"})}),"\n",(0,t.jsx)(n.h3,{id:"validate",children:(0,t.jsx)(n.code,{children:".validate(...)"})}),"\n",(0,t.jsx)("p",{style:{marginTop:"-15px"},children:(0,t.jsx)("i",{children:(0,t.jsx)("code",{children:"Validator<Uint8Array>"})})}),"\n",(0,t.jsxs)(n.p,{children:["Adds custom validation to the attribute. See ",(0,t.jsx)(n.a,{href:"/docs/schemas/custom-validation/",children:"Custom Validation"})," for more details:"]}),"\n",(0,t.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const longBinSchema = binary().validate(\n  input => input.length > 3\n)\n// \ud83d\udc47 Similar to\nconst longBinSchema = binary().putValidate(\n  input => input.length > 3\n)\n// \ud83d\udc47 ...or\nconst longBinSchema = binary({\n  validators: {\n    key: undefined,\n    put: input => input.length > 3,\n    update: undefined\n  }\n})\n"})})})]})}function m(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},9365:(e,n,a)=>{a.d(n,{A:()=>i});a(6540);var t=a(8215);const r={tabItem:"tabItem_Ymn6"};var s=a(4848);function i(e){let{children:n,hidden:a,className:i}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,t.A)(r.tabItem,i),hidden:a,children:n})}},1470:(e,n,a)=>{a.d(n,{A:()=>S});var t=a(6540),r=a(8215),s=a(3104),i=a(6347),l=a(205),o=a(7485),c=a(1682),d=a(679);function u(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:a}=e;return(0,t.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:a,attributes:t,default:r}}=e;return{value:n,label:a,attributes:t,default:r}}))}(a);return function(e){const n=(0,c.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,a])}function m(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:a}=e;const r=(0,i.W6)(),s=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:n,groupId:a});return[(0,o.aZ)(s),(0,t.useCallback)((e=>{if(!s)return;const n=new URLSearchParams(r.location.search);n.set(s,e),r.replace({...r.location,search:n.toString()})}),[s,r])]}function f(e){const{defaultValue:n,queryString:a=!1,groupId:r}=e,s=h(e),[i,o]=(0,t.useState)((()=>function(e){let{defaultValue:n,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=a.find((e=>e.default))??a[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:s}))),[c,u]=p({queryString:a,groupId:r}),[f,x]=function(e){let{groupId:n}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(n),[r,s]=(0,d.Dv)(a);return[r,(0,t.useCallback)((e=>{a&&s.set(e)}),[a,s])]}({groupId:r}),b=(()=>{const e=c??f;return m({value:e,tabValues:s})?e:null})();(0,l.A)((()=>{b&&o(b)}),[b]);return{selectedValue:i,selectValue:(0,t.useCallback)((e=>{if(!m({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),x(e)}),[u,x,s]),tabValues:s}}var x=a(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var y=a(4848);function j(e){let{className:n,block:a,selectedValue:t,selectValue:i,tabValues:l}=e;const o=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.a_)(),d=e=>{const n=e.currentTarget,a=o.indexOf(n),r=l[a].value;r!==t&&(c(n),i(r))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const a=o.indexOf(e.currentTarget)+1;n=o[a]??o[0];break}case"ArrowLeft":{const a=o.indexOf(e.currentTarget)-1;n=o[a]??o[o.length-1];break}}n?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":a},n),children:l.map((e=>{let{value:n,label:a,attributes:s}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:t===n?0:-1,"aria-selected":t===n,ref:e=>o.push(e),onKeyDown:u,onClick:d,...s,className:(0,r.A)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":t===n}),children:a??n},n)}))})}function v(e){let{lazy:n,children:a,selectedValue:s}=e;const i=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===s));return e?(0,t.cloneElement)(e,{className:(0,r.A)("margin-top--md",e.props.className)}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,t.cloneElement)(e,{key:n,hidden:e.props.value!==s})))})}function g(e){const n=f(e);return(0,y.jsxs)("div",{className:(0,r.A)("tabs-container",b.tabList),children:[(0,y.jsx)(j,{...n,...e}),(0,y.jsx)(v,{...n,...e})]})}function S(e){const n=(0,x.A)();return(0,y.jsx)(g,{...e,children:u(e.children)},String(n))}},8453:(e,n,a)=>{a.d(n,{R:()=>i,x:()=>l});var t=a(6540);const r={},s=t.createContext(r);function i(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);