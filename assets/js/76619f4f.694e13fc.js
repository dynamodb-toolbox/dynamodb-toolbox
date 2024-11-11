"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7924],{1228:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>d,toc:()=>u});var s=a(4848),t=a(8453),r=a(1470),o=a(9365);const l={title:"boolean",sidebar_custom_props:{code:!0}},i="Boolean",d={id:"schemas/boolean/index",title:"boolean",description:"Defines a boolean attribute:",source:"@site/docs/4-schemas/7-boolean/index.md",sourceDirName:"4-schemas/7-boolean",slug:"/schemas/boolean/",permalink:"/docs/schemas/boolean/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"boolean",sidebar_custom_props:{code:!0}},sidebar:"tutorialSidebar",previous:{title:"nul",permalink:"/docs/schemas/null/"},next:{title:"number",permalink:"/docs/schemas/number/"}},c={},u=[{value:"Options",id:"options",level:2},{value:"<code>.required()</code>",id:"required",level:3},{value:"<code>.hidden()</code>",id:"hidden",level:3},{value:"<code>.key()</code>",id:"key",level:3},{value:"<code>.savedAs(...)</code>",id:"savedas",level:3},{value:"<code>.enum(...)</code>",id:"enum",level:3},{value:"<code>.transform(...)</code>",id:"transform",level:3},{value:"<code>.default(...)</code>",id:"default",level:3},{value:"<code>.link&lt;Schema&gt;(...)</code>",id:"linkschema",level:3},{value:"<code>.validate(...)</code>",id:"validate",level:3}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"boolean",children:"Boolean"})}),"\n",(0,s.jsxs)(n.p,{children:["Defines a ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes",children:(0,s.jsx)(n.strong,{children:"boolean attribute"})}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { boolean } from 'dynamodb-toolbox/attributes/boolean';\n\nconst pokemonSchema = schema({\n  ...\n  isLegendary: boolean(),\n});\n\ntype FormattedPokemon = FormattedItem<typeof PokemonEntity>;\n// => {\n//   ...\n//   isLegendary: boolean\n// }\n"})}),"\n",(0,s.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,s.jsx)(n.h3,{id:"required",children:(0,s.jsx)(n.code,{children:".required()"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"string | undefined"})})}),"\n",(0,s.jsxs)(n.p,{children:["Tags the attribute as ",(0,s.jsx)(n.strong,{children:"required"})," (at root level or within ",(0,s.jsx)(n.a,{href:"/docs/schemas/map/",children:"Maps"}),"). Possible values are:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsxs)("code",{children:["'atLeastOnce' ",(0,s.jsx)("i",{children:"(default)"})]}),": Required (starting value)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"'always'"}),": Always required (including updates)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"'never'"}),": Optional"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Equivalent\nconst isLegendarySchema = boolean()\nconst isLegendarySchema = boolean().required()\nconst isLegendarySchema = boolean({\n  required: 'atLeastOnce'\n})\n\n// shorthand for `.required('never')`\nconst isLegendarySchema = boolean().optional()\nconst isLegendarySchema = boolean({ required: 'never' })\n"})}),"\n",(0,s.jsx)(n.h3,{id:"hidden",children:(0,s.jsx)(n.code,{children:".hidden()"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,s.jsx)(n.p,{children:"Skips the attribute when formatting items:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const isLegendarySchema = boolean().hidden()\nconst isLegendarySchema = boolean({ hidden: true })\n"})}),"\n",(0,s.jsx)(n.h3,{id:"key",children:(0,s.jsx)(n.code,{children:".key()"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"boolean | undefined"})})}),"\n",(0,s.jsx)(n.p,{children:"Tags the attribute as needed to compute the primary key:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Note: The method also sets the `required` property to 'always'\n// (it is often the case in practice, you can still use `.optional()` if needed)\nconst isLegendarySchema = boolean().key()\nconst isLegendarySchema = boolean({\n  key: true,\n  required: 'always'\n})\n"})}),"\n",(0,s.jsx)(n.h3,{id:"savedas",children:(0,s.jsx)(n.code,{children:".savedAs(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"string"})})}),"\n",(0,s.jsxs)(n.p,{children:["Renames the attribute during the ",(0,s.jsx)(n.a,{href:"/docs/schemas/actions/parse",children:"transformation step"})," (at root level or within ",(0,s.jsx)(n.a,{href:"/docs/schemas/map/",children:"Maps"}),"):"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const isLegendarySchema = boolean().savedAs('isLeg')\nconst isLegendarySchema = boolean({ savedAs: 'isLeg' })\n"})}),"\n",(0,s.jsx)(n.h3,{id:"enum",children:(0,s.jsx)(n.code,{children:".enum(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"boolean[]"})})}),"\n",(0,s.jsx)(n.p,{children:"Provides a finite range of possible values:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const isLegendarySchema = boolean().enum(true, false)\n\n// \ud83d\udc47 Equivalent to `.enum(false).default(false)`\nconst isLegendarySchema = boolean().const(false)\n"})}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["For type inference reasons, the ",(0,s.jsx)(n.code,{children:"enum"})," option is only available as a method and not as a constructor property."]})}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["Although it is not very useful, ",(0,s.jsx)(n.code,{children:"boolean"})," is a primitive, and as such inherits from the ",(0,s.jsx)(n.code,{children:".enum"})," and ",(0,s.jsx)(n.code,{children:".const"})," options."]})}),"\n",(0,s.jsx)(n.h3,{id:"transform",children:(0,s.jsx)(n.code,{children:".transform(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"Transformer<boolean>"})})}),"\n",(0,s.jsxs)(n.p,{children:["Allows modifying the attribute values during the ",(0,s.jsx)(n.a,{href:"/docs/schemas/actions/parse",children:"transformation step"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const negate = {\n  parse: (input: boolean) => !input,\n  format: (saved: boolean) => !saved\n}\n\n// Saves the negated value\nconst isLegendarySchema = boolean().transform(negate)\nconst isLegendarySchema = boolean({ transform: negate })\n"})}),"\n",(0,s.jsxs)(n.p,{children:["DynamoDB-Toolbox exposes ",(0,s.jsx)(n.a,{href:"/docs/schemas/transformers/usage",children:"on-the-shelf transformers"}),", so feel free to use them!"]}),"\n",(0,s.jsx)(n.h3,{id:"default",children:(0,s.jsx)(n.code,{children:".default(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"ValueOrGetter<boolean>"})})}),"\n",(0,s.jsxs)(n.p,{children:["Specifies default values for the attribute. See ",(0,s.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,s.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(o.A,{value:"put",label:"Put",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const isLegendarySchema = boolean().default(false)\n// \ud83d\udc47 Similar to\nconst isLegendarySchema = boolean().putDefault(false)\n// \ud83d\udc47 ...or\nconst isLegendarySchema = boolean({\n  defaults: {\n    key: undefined,\n    put: false,\n    update: undefined\n  }\n})\n\n// \ud83d\ude4c Getters also work!\nconst isLegendarySchema = boolean().default(() => false)\n"})})}),(0,s.jsx)(o.A,{value:"key",label:"Key",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const isLegendarySchema = boolean().key().default(false)\n// \ud83d\udc47 Similar to\nconst isLegendarySchema = boolean().key().keyDefault(false)\n// \ud83d\udc47 ...or\nconst isLegendarySchema = boolean({\n  defaults: {\n    key: false,\n    // put & update defaults are not useful in `key` attributes\n    put: undefined,\n    update: undefined\n  },\n  key: true,\n  required: 'always'\n})\n"})})}),(0,s.jsx)(o.A,{value:"update",label:"Update",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const isUpdatedSchema = boolean().updateDefault(true)\n// \ud83d\udc47 Similar to\nconst isUpdatedSchema = boolean({\n  defaults: {\n    key: undefined,\n    put: undefined,\n    update: true\n  }\n})\n"})})})]})}),"\n",(0,s.jsx)(n.h3,{id:"linkschema",children:(0,s.jsx)(n.code,{children:".link<Schema>(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"Link<SCHEMA, boolean>"})})}),"\n",(0,s.jsxs)(n.p,{children:["Similar to ",(0,s.jsx)(n.a,{href:"#default",children:(0,s.jsx)(n.code,{children:".default(...)"})})," but allows deriving the default value from other attributes. See ",(0,s.jsx)(n.a,{href:"/docs/schemas/defaults-and-links/",children:"Defaults and Links"})," for more details:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const pokemonSchema = schema({\n  customName: string().optional()\n}).and(prevSchema => ({\n  hasCustomName: boolean().link<typeof prevSchema>(\n    // \ud83d\ude4c Correctly typed!\n    ({ customName }) => customName !== undefined\n  )\n}))\n"})}),"\n",(0,s.jsx)(n.h3,{id:"validate",children:(0,s.jsx)(n.code,{children:".validate(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:(0,s.jsx)("code",{children:"Validator<boolean>"})})}),"\n",(0,s.jsxs)(n.p,{children:["Adds custom validation to the attribute. See ",(0,s.jsx)(n.a,{href:"/docs/schemas/custom-validation/",children:"Custom Validation"})," for more details:"]}),"\n",(0,s.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const trueOrUndefinedSchema = boolean()\n  .optional()\n  .validate(input => input !== false)\n// \ud83d\udc47 Similar to\nconst trueOrUndefinedSchema = boolean()\n  .optional()\n  .putValidate(input => input !== false)\n// \ud83d\udc47 ...or\nconst trueOrUndefinedSchema = boolean({\n  validators: {\n    key: undefined,\n    put: input => input !== false,\n    update: undefined\n  },\n  required: 'never'\n})\n"})})})]})}function m(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},9365:(e,n,a)=>{a.d(n,{A:()=>o});a(6540);var s=a(8215);const t={tabItem:"tabItem_Ymn6"};var r=a(4848);function o(e){let{children:n,hidden:a,className:o}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(t.tabItem,o),hidden:a,children:n})}},1470:(e,n,a)=>{a.d(n,{A:()=>S});var s=a(6540),t=a(8215),r=a(3104),o=a(6347),l=a(205),i=a(7485),d=a(1682),c=a(679);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:a}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:a,attributes:s,default:t}}=e;return{value:n,label:a,attributes:s,default:t}}))}(a);return function(e){const n=(0,d.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,a])}function m(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:a}=e;const t=(0,o.W6)(),r=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:n,groupId:a});return[(0,i.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(t.location.search);n.set(r,e),t.replace({...t.location,search:n.toString()})}),[r,t])]}function f(e){const{defaultValue:n,queryString:a=!1,groupId:t}=e,r=h(e),[o,i]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=a.find((e=>e.default))??a[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:r}))),[d,u]=p({queryString:a,groupId:t}),[f,x]=function(e){let{groupId:n}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(n),[t,r]=(0,c.Dv)(a);return[t,(0,s.useCallback)((e=>{a&&r.set(e)}),[a,r])]}({groupId:t}),b=(()=>{const e=d??f;return m({value:e,tabValues:r})?e:null})();(0,l.A)((()=>{b&&i(b)}),[b]);return{selectedValue:o,selectValue:(0,s.useCallback)((e=>{if(!m({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);i(e),u(e),x(e)}),[u,x,r]),tabValues:r}}var x=a(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=a(4848);function g(e){let{className:n,block:a,selectedValue:s,selectValue:o,tabValues:l}=e;const i=[],{blockElementScrollPositionUntilNextRender:d}=(0,r.a_)(),c=e=>{const n=e.currentTarget,a=i.indexOf(n),t=l[a].value;t!==s&&(d(n),o(t))},u=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=i.indexOf(e.currentTarget)+1;n=i[a]??i[0];break}case"ArrowLeft":{const a=i.indexOf(e.currentTarget)-1;n=i[a]??i[i.length-1];break}}n?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,t.A)("tabs",{"tabs--block":a},n),children:l.map((e=>{let{value:n,label:a,attributes:r}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>i.push(e),onKeyDown:u,onClick:c,...r,className:(0,t.A)("tabs__item",b.tabItem,r?.className,{"tabs__item--active":s===n}),children:a??n},n)}))})}function v(e){let{lazy:n,children:a,selectedValue:r}=e;const o=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=o.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:(0,t.A)("margin-top--md",e.props.className)}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:o.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==r})))})}function y(e){const n=f(e);return(0,j.jsxs)("div",{className:(0,t.A)("tabs-container",b.tabList),children:[(0,j.jsx)(g,{...n,...e}),(0,j.jsx)(v,{...n,...e})]})}function S(e){const n=(0,x.A)();return(0,j.jsx)(y,{...e,children:u(e.children)},String(n))}},8453:(e,n,a)=>{a.d(n,{R:()=>o,x:()=>l});var s=a(6540);const t={},r=s.createContext(t);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);