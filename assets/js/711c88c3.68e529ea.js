"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3977],{15680:(e,n,a)=>{a.d(n,{xA:()=>c,yg:()=>y});var t=a(96540);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function i(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function l(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?i(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function o(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},i=Object.keys(e);for(t=0;t<i.length;t++)a=i[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)a=i[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=t.createContext({}),u=function(e){var n=t.useContext(s),a=n;return e&&(a="function"==typeof e?e(n):l(l({},n),e)),a},c=function(e){var n=u(e.components);return t.createElement(s.Provider,{value:n},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),d=u(a),m=r,y=d["".concat(s,".").concat(m)]||d[m]||p[m]||i;return a?t.createElement(y,l(l({ref:n},c),{},{components:a})):t.createElement(y,l({ref:n},c))}));function y(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=m;var o={};for(var s in n)hasOwnProperty.call(n,s)&&(o[s]=n[s]);o.originalType=e,o[d]="string"==typeof e?e:r,l[1]=o;for(var u=2;u<i;u++)l[u]=a[u];return t.createElement.apply(null,l)}return t.createElement.apply(null,a)}m.displayName="MDXCreateElement"},19365:(e,n,a)=>{a.d(n,{A:()=>l});var t=a(96540),r=a(20053);const i={tabItem:"tabItem_Ymn6"};function l(e){let{children:n,hidden:a,className:l}=e;return t.createElement("div",{role:"tabpanel",className:(0,r.A)(i.tabItem,l),hidden:a},n)}},11470:(e,n,a)=>{a.d(n,{A:()=>S});var t=a(58168),r=a(96540),i=a(20053),l=a(23104),o=a(56347),s=a(57485),u=a(31682),c=a(89466);function d(e){return function(e){return r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:n,label:a,attributes:t,default:r}}=e;return{value:n,label:a,attributes:t,default:r}}))}function p(e){const{values:n,children:a}=e;return(0,r.useMemo)((()=>{const e=n??d(a);return function(e){const n=(0,u.X)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,a])}function m(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function y(e){let{queryString:n=!1,groupId:a}=e;const t=(0,o.W6)(),i=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:n,groupId:a});return[(0,s.aZ)(i),(0,r.useCallback)((e=>{if(!i)return;const n=new URLSearchParams(t.location.search);n.set(i,e),t.replace({...t.location,search:n.toString()})}),[i,t])]}function h(e){const{defaultValue:n,queryString:a=!1,groupId:t}=e,i=p(e),[l,o]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=a.find((e=>e.default))??a[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:i}))),[s,u]=y({queryString:a,groupId:t}),[d,h]=function(e){let{groupId:n}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(n),[t,i]=(0,c.Dv)(a);return[t,(0,r.useCallback)((e=>{a&&i.set(e)}),[a,i])]}({groupId:t}),g=(()=>{const e=s??d;return m({value:e,tabValues:i})?e:null})();(0,r.useLayoutEffect)((()=>{g&&o(g)}),[g]);return{selectedValue:l,selectValue:(0,r.useCallback)((e=>{if(!m({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),h(e)}),[u,h,i]),tabValues:i}}var g=a(92303);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function b(e){let{className:n,block:a,selectedValue:o,selectValue:s,tabValues:u}=e;const c=[],{blockElementScrollPositionUntilNextRender:d}=(0,l.a_)(),p=e=>{const n=e.currentTarget,a=c.indexOf(n),t=u[a].value;t!==o&&(d(n),s(t))},m=e=>{let n=null;switch(e.key){case"Enter":p(e);break;case"ArrowRight":{const a=c.indexOf(e.currentTarget)+1;n=c[a]??c[0];break}case"ArrowLeft":{const a=c.indexOf(e.currentTarget)-1;n=c[a]??c[c.length-1];break}}n?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.A)("tabs",{"tabs--block":a},n)},u.map((e=>{let{value:n,label:a,attributes:l}=e;return r.createElement("li",(0,t.A)({role:"tab",tabIndex:o===n?0:-1,"aria-selected":o===n,key:n,ref:e=>c.push(e),onKeyDown:m,onClick:p},l,{className:(0,i.A)("tabs__item",f.tabItem,l?.className,{"tabs__item--active":o===n})}),a??n)})))}function v(e){let{lazy:n,children:a,selectedValue:t}=e;const i=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===t));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},i.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==t}))))}function N(e){const n=h(e);return r.createElement("div",{className:(0,i.A)("tabs-container",f.tabList)},r.createElement(b,(0,t.A)({},e,n)),r.createElement(v,(0,t.A)({},e,n)))}function S(e){const n=(0,g.A)();return r.createElement(N,(0,t.A)({key:String(n)},e))}},58370:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>y,frontMatter:()=>o,metadata:()=>u,toc:()=>d});var t=a(58168),r=(a(96540),a(15680)),i=a(11470),l=a(19365);const o={title:"binary",sidebar_custom_props:{code:!0}},s="Binary",u={unversionedId:"schemas/binary/index",id:"schemas/binary/index",title:"binary",description:"Defines a binary attribute:",source:"@site/docs/4-schemas/10-binary/index.md",sourceDirName:"4-schemas/10-binary",slug:"/schemas/binary/",permalink:"/docs/schemas/binary/",draft:!1,tags:[],version:"current",frontMatter:{title:"binary",sidebar_custom_props:{code:!0}},sidebar:"tutorialSidebar",previous:{title:"string",permalink:"/docs/schemas/string/"},next:{title:"set",permalink:"/docs/schemas/set/"}},c={},d=[{value:"Options",id:"options",level:2},{value:"<code>.required()</code>",id:"required",level:3},{value:"<code>.hidden()</code>",id:"hidden",level:3},{value:"<code>.key()</code>",id:"key",level:3},{value:"<code>.savedAs(...)</code>",id:"savedas",level:3},{value:"<code>.enum(...)</code>",id:"enum",level:3},{value:"<code>.transform(...)</code>",id:"transform",level:3},{value:"<code>.default(...)</code>",id:"default",level:3},{value:"<code>.link&lt;Schema&gt;(...)</code>",id:"linkschema",level:3},{value:"<code>.validate(...)</code>",id:"validate",level:3}],p={toc:d},m="wrapper";function y(e){let{components:n,...a}=e;return(0,r.yg)(m,(0,t.A)({},p,a,{components:n,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"binary"},"Binary"),(0,r.yg)("p",null,"Defines a ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},(0,r.yg)("strong",{parentName:"a"},"binary attribute")),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { binary } from 'dynamodb-toolbox/attributes/binary';\n\nconst pokemonSchema = schema({\n  ...\n  hash: binary(),\n});\n\ntype FormattedPokemon = FormattedItem<typeof PokemonEntity>;\n// => {\n//   ...\n//   hash: Uint8Array\n// }\n")),(0,r.yg)("h2",{id:"options"},"Options"),(0,r.yg)("h3",{id:"required"},(0,r.yg)("inlineCode",{parentName:"h3"},".required()")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"string | undefined"))),(0,r.yg)("p",null,"Tags the attribute as ",(0,r.yg)("strong",{parentName:"p"},"required")," (at root level or within ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/map/"},"Maps"),"). Possible values are:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("code",null,"'atLeastOnce' ",(0,r.yg)("i",null,"(default)")),": Required (starting value)"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"'always'"),": Always required (including updates)"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"'never'"),": Optional")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"// Equivalent\nconst hashSchema = binary()\nconst hashSchema = binary().required()\nconst hashSchema = binary({ required: 'atLeastOnce' })\n\n// shorthand for `.required('never')`\nconst hashSchema = binary().optional()\nconst hashSchema = binary({ required: 'never' })\n")),(0,r.yg)("h3",{id:"hidden"},(0,r.yg)("inlineCode",{parentName:"h3"},".hidden()")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"boolean | undefined"))),(0,r.yg)("p",null,"Skips the attribute when formatting items:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const hashSchema = binary().hidden()\nconst hashSchema = binary({ hidden: true })\n")),(0,r.yg)("h3",{id:"key"},(0,r.yg)("inlineCode",{parentName:"h3"},".key()")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"boolean | undefined"))),(0,r.yg)("p",null,"Tags the attribute as needed to compute the primary key:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"// Note: The method also sets the `required` property to 'always'\n// (it is often the case in practice, you can still use `.optional()` if needed)\nconst hashSchema = binary().key()\nconst hashSchema = binary({\n  key: true,\n  required: 'always'\n})\n")),(0,r.yg)("h3",{id:"savedas"},(0,r.yg)("inlineCode",{parentName:"h3"},".savedAs(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"string"))),(0,r.yg)("p",null,"Renames the attribute during the ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/actions/parse"},"transformation step")," (at root level or within ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/map/"},"Maps"),"):"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const hashSchema = binary().savedAs('h')\nconst hashSchema = binary({ savedAs: 'h' })\n")),(0,r.yg)("h3",{id:"enum"},(0,r.yg)("inlineCode",{parentName:"h3"},".enum(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"Uint8Array[]"))),(0,r.yg)("p",null,"Provides a finite range of possible values:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const binA = new Uint8Array([1, 2, 3])\nconst binB = new Uint8Array([4, 5, 6])\n\nconst hashSchema = binary().enum(binA, binB, ...)\n\n// \ud83d\udc47 Equivalent to `.enum(binA).default(binA)`\nconst hashSchema = binary().const(binA)\n")),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"For type inference reasons, the ",(0,r.yg)("inlineCode",{parentName:"p"},"enum")," option is only available as a method and not as a constructor property.")),(0,r.yg)("h3",{id:"transform"},(0,r.yg)("inlineCode",{parentName:"h3"},".transform(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"Transformer<Uint8Array>"))),(0,r.yg)("p",null,"Allows modifying the attribute values during the ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/actions/parse"},"transformation step"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PREFIX = new Uint8Array([1, 2, 3])\n\nconst prefix = {\n  parse: (input: Uint8Array) => {\n    const concat = new Uint8Array(\n      PREFIX.length + input.length\n    )\n    concat.set(PREFIX)\n    concat.set(input, PREFIX.length)\n\n    return concat\n  },\n  format: (saved: Uint8Array) => saved.slice(PREFIX.length)\n}\n\n// Prefixes the value\nconst hashSchema = binary().transform(prefix)\nconst hashSchema = binary({ transform: prefix })\n")),(0,r.yg)("p",null,"DynamoDB-Toolbox exposes ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/transformers/usage"},"on-the-shelf transformers"),", so feel free to use them!"),(0,r.yg)("h3",{id:"default"},(0,r.yg)("inlineCode",{parentName:"h3"},".default(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"ValueOrGetter<Uint8Array>"))),(0,r.yg)("p",null,"Specifies default values for the attribute. See ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/defaults-and-links/"},"Defaults and Links")," for more details:"),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(i.A,{mdxType:"Tabs"},(0,r.yg)(l.A,{value:"put",label:"Put",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const bin = new Uint8Array([1, 2, 3])\n\nconst hashSchema = binary().default(bin)\n// \ud83d\udc47 Similar to\nconst hashSchema = binary().putDefault(bin)\n// \ud83d\udc47 ...or\nconst hashSchema = binary({\n  defaults: {\n    key: undefined,\n    put: bin,\n    update: undefined\n  }\n})\n\n// \ud83d\ude4c Getters also work!\nconst hashSchema = binary().default(() => bin)\n"))),(0,r.yg)(l.A,{value:"key",label:"Key",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const bin = new Uint8Array([1, 2, 3])\n\nconst hashSchema = binary().key().default(bin)\n// \ud83d\udc47 Similar to\nconst hashSchema = binary().key().keyDefault(bin)\n// \ud83d\udc47 ...or\nconst hashSchema = binary({\n  defaults: {\n    key: bin,\n    // put & update defaults are not useful in `key` attributes\n    put: undefined,\n    update: undefined\n  },\n  key: true,\n  required: 'always'\n})\n"))),(0,r.yg)(l.A,{value:"update",label:"Update",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const bin = new Uint8Array([1, 2, 3])\n\nconst hashSchema = binary().updateDefault(bin)\n// \ud83d\udc47 Similar to\nconst hashSchema = binary({\n  defaults: {\n    key: undefined,\n    put: undefined,\n    update: bin\n  }\n})\n"))))),(0,r.yg)("h3",{id:"linkschema"},(0,r.yg)("inlineCode",{parentName:"h3"},".link<Schema>(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"Link<SCHEMA, Uint8Array>"))),(0,r.yg)("p",null,"Similar to ",(0,r.yg)("a",{parentName:"p",href:"#default"},(0,r.yg)("inlineCode",{parentName:"a"},".default(...)"))," but allows deriving the default value from other attributes. See ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/defaults-and-links/"},"Defaults and Links")," for more details:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const encoder = new TextEncoder()\n\nconst pokemonSchema = schema({\n  name: string()\n}).and(prevSchema => ({\n  nameHash: binary().link<typeof prevSchema>(\n    // \ud83d\ude4c Correctly typed!\n    item => encoder.encode(item.name)\n  )\n}))\n")),(0,r.yg)("h3",{id:"validate"},(0,r.yg)("inlineCode",{parentName:"h3"},".validate(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,(0,r.yg)("code",null,"Validator<Uint8Array>"))),(0,r.yg)("p",null,"Adds custom validation to the attribute. See ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/custom-validation/"},"Custom Validation")," for more details:"),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const longBinSchema = binary().validate(\n  input => input.length > 3\n)\n// \ud83d\udc47 Similar to\nconst longBinSchema = binary().putValidate(\n  input => input.length > 3\n)\n// \ud83d\udc47 ...or\nconst longBinSchema = binary({\n  validators: {\n    key: undefined,\n    put: input => input.length > 3,\n    update: undefined\n  }\n})\n"))))}y.isMDXComponent=!0}}]);