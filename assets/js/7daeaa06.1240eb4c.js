"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[91],{3905:(e,n,t)=>{t.d(n,{Zo:()=>d,kt:()=>c});var a=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var p=a.createContext({}),s=function(e){var n=a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},d=function(e){var n=s(e.components);return a.createElement(p.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),u=s(t),c=r,k=u["".concat(p,".").concat(c)]||u[c]||m[c]||o;return t?a.createElement(k,l(l({ref:n},d),{},{components:t})):a.createElement(k,l({ref:n},d))}));function c(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,l=new Array(o);l[0]=u;var i={};for(var p in n)hasOwnProperty.call(n,p)&&(i[p]=n[p]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var s=2;s<o;s++)l[s]=t[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},85162:(e,n,t)=>{t.d(n,{Z:()=>l});var a=t(67294),r=t(86010);const o="tabItem_Ymn6";function l(e){let{children:n,hidden:t,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,l),hidden:t},n)}},74866:(e,n,t)=>{t.d(n,{Z:()=>T});var a=t(87462),r=t(67294),o=t(86010),l=t(12466),i=t(76775),p=t(91980),s=t(67392),d=t(50012);function m(e){return function(e){var n;return(null==(n=r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})))?void 0:n.filter(Boolean))??[]}(e).map((e=>{let{props:{value:n,label:t,attributes:a,default:r}}=e;return{value:n,label:t,attributes:a,default:r}}))}function u(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??m(t);return function(e){const n=(0,s.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function c(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function k(e){let{queryString:n=!1,groupId:t}=e;const a=(0,i.k6)(),o=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,p._X)(o),(0,r.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(a.location.search);n.set(o,e),a.replace({...a.location,search:n.toString()})}),[o,a])]}function b(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,o=u(e),[l,i]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!c({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const a=t.find((e=>e.default))??t[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:o}))),[p,s]=k({queryString:t,groupId:a}),[m,b]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,o]=(0,d.Nk)(t);return[a,(0,r.useCallback)((e=>{t&&o.set(e)}),[t,o])]}({groupId:a}),f=(()=>{const e=p??m;return c({value:e,tabValues:o})?e:null})();(0,r.useLayoutEffect)((()=>{f&&i(f)}),[f]);return{selectedValue:l,selectValue:(0,r.useCallback)((e=>{if(!c({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);i(e),s(e),b(e)}),[s,b,o]),tabValues:o}}var f=t(72389);const N="tabList__CuJ",g="tabItem_LNqP";function y(e){let{className:n,block:t,selectedValue:i,selectValue:p,tabValues:s}=e;const d=[],{blockElementScrollPositionUntilNextRender:m}=(0,l.o5)(),u=e=>{const n=e.currentTarget,t=d.indexOf(n),a=s[t].value;a!==i&&(m(n),p(a))},c=e=>{var n;let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=d.indexOf(e.currentTarget)+1;t=d[n]??d[0];break}case"ArrowLeft":{const n=d.indexOf(e.currentTarget)-1;t=d[n]??d[d.length-1];break}}null==(n=t)||n.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":t},n)},s.map((e=>{let{value:n,label:t,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:i===n?0:-1,"aria-selected":i===n,key:n,ref:e=>d.push(e),onKeyDown:c,onClick:u},l,{className:(0,o.Z)("tabs__item",g,null==l?void 0:l.className,{"tabs__item--active":i===n})}),t??n)})))}function h(e){let{lazy:n,children:t,selectedValue:a}=e;const o=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=o.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},o.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a}))))}function v(e){const n=b(e);return r.createElement("div",{className:(0,o.Z)("tabs-container",N)},r.createElement(y,(0,a.Z)({},e,n)),r.createElement(h,(0,a.Z)({},e,n)))}function T(e){const n=(0,f.Z)();return r.createElement(v,(0,a.Z)({key:String(n)},e))}},93728:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>p,default:()=>c,frontMatter:()=>i,metadata:()=>s,toc:()=>m});var a=t(87462),r=(t(67294),t(3905)),o=t(74866),l=t(85162);const i={title:"Parse",sidebar_custom_props:{sidebarActionType:"util"}},p="Parser",s={unversionedId:"schemas/actions/parse",id:"schemas/actions/parse",title:"Parse",description:"Given an input of any type and a mode, validates that it respects the schema and applies transformations:",source:"@site/docs/4-schemas/16-actions/1-parse.md",sourceDirName:"4-schemas/16-actions",slug:"/schemas/actions/parse",permalink:"/docs/schemas/actions/parse",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Parse",sidebar_custom_props:{sidebarActionType:"util"}},sidebar:"tutorialSidebar",previous:{title:"anyOf",permalink:"/docs/schemas/anyOf/"},next:{title:"Format",permalink:"/docs/schemas/actions/format"}},d={},m=[{value:"Methods",id:"methods",level:2},{value:"<code>parse(...)</code>",id:"parse",level:3},{value:"<code>reparse(...)</code>",id:"reparse",level:3},{value:"<code>start(...)</code>",id:"start",level:3},{value:"<code>validate(...)</code>",id:"validate",level:3}],u={toc:m};function c(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"parser"},"Parser"),(0,r.kt)("p",null,"Given an input of any type and a mode, validates that ",(0,r.kt)("strong",{parentName:"p"},"it respects the schema")," and applies transformations:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Parser } from 'dynamodb-toolbox/schema/actions/parse'\n\nconst validPokemon = pokemonSchema\n  .build(Parser)\n  .parse(pokemon)\n")),(0,r.kt)("p",null,"The default mode is ",(0,r.kt)("inlineCode",{parentName:"p"},"put"),", but you can switch it to ",(0,r.kt)("inlineCode",{parentName:"p"},"update")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"key")," if needed:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const validKey = pokemonSchema.build(Parser).parse(\n  key,\n  // Additional options\n  { mode: 'key' }\n)\n")),(0,r.kt)("p",null,"In DynamoDB-Toolbox, parsing is done in ",(0,r.kt)("strong",{parentName:"p"},"4 steps"),":"),(0,r.kt)("mermaid",{value:"flowchart LR\n  classDef mmddescription fill:none,stroke:none,font-style:italic\n  classDef mmdcontainer fill:#eee4,stroke-width:1px,stroke-dasharray:3,stroke:#ccc,font-weight:bold,font-size:large\n  classDef mmdspace fill:none,stroke:none,color:#0000\n\n  input(Input)\n  input:::mmddescription\n\n  subgraph Filling\n    space1( ):::mmdspace\n\n    defaults(Applies<br/><b>defaults<b/>)\n    links(Applies<br/><b>links<b/>)\n    fillDescr(...clones the item, adds<br/><b>defaults</b> and <b>links</b><br/>):::mmddescription\n\n    defaults --\x3e links\n  end\n\n  input .-> defaults\n\n  Filling:::mmdcontainer\n\n  subgraph Parsing\n    space2( ):::mmdspace\n\n    parsing(Throws an<br/><b>error</b> if invalid)\n    parsingDescr(...<b>validates</b> the item.):::mmddescription\n\n    links --\x3e parsing\n  end\n\n\n  Parsing:::mmdcontainer\n\n  subgraph Transforming\n    space3( ):::mmdspace\n\n    transform(Last <b>transforms<b/>)\n    transformDescr(...<b>renames</b><br/>and <b>transforms</b>.):::mmddescription\n\n    parsing--\x3etransform\n  end\n\n  Transforming:::mmdcontainer\n\n  output(Output)\n  output:::mmddescription\n\n  transform .-> output\n"}),(0,r.kt)("admonition",{title:"Example",type:"note"},(0,r.kt)("p",{parentName:"admonition"},"Here are ",(0,r.kt)("strong",{parentName:"p"},"step-by-step")," parsing examples:"),(0,r.kt)("details",{className:"details-in-admonition"},(0,r.kt)("summary",null,"\u261d\ufe0f ",(0,r.kt)("b",null,"Schema")),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const now = () => new Date().toISOString()\n\nconst pokemonSchema = schema({\n  // key attributes\n  pokemonClass: string()\n    .key()\n    .transform(prefix('POKEMON'))\n    .savedAs('partitionKey'),\n  pokemonId: string().key().savedAs('sortKey'),\n\n  // timestamps\n  created: string().default(now),\n  updated: string()\n    .required('always')\n    .putDefault(now)\n    .updateDefault(now),\n\n  // other attributes\n  name: string().optional(),\n  level: number().default(1)\n}).and(prevSchema => ({\n  levelPlusOne: number().link<typeof prevSchema>(\n    ({ level }) => level + 1\n  )\n}))\n"))),(0,r.kt)("details",{className:"details-in-admonition"},(0,r.kt)("summary",null,"\ud83d\udd0e ",(0,r.kt)("b",null,(0,r.kt)("code",null,"'put'")," mode")),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"input",label:"Input",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "pikachu",\n  "pokemonId": "123",\n  "name": "Pikachu"\n}\n'))),(0,r.kt)(l.Z,{value:"defaulted",label:"Defaulted",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "pikachu",\n  "pokemonId": "123",\n+ "created": "2022-01-01T00:00:00.000Z",\n+ "modified": "2022-01-01T00:00:00.000Z",\n  "name": "Pikachu",\n+ "level": 1,\n}\n'))),(0,r.kt)(l.Z,{value:"linked",label:"Linked",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "pikachu",\n  "pokemonId": "123",\n  "created": "2022-01-01T00:00:00.000Z",\n  "modified": "2022-01-01T00:00:00.000Z",\n  "name": "Pikachu",\n  "level": 1,\n+ "levelPlusOne": 2,\n}\n'))),(0,r.kt)(l.Z,{value:"parsed",label:"Parsed",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "pikachu",\n  "pokemonId": "123",\n  "created": "2022-01-01T00:00:00.000Z",\n  "modified": "2022-01-01T00:00:00.000Z",\n  "name": "Pikachu",\n  "level": 1,\n  "levelPlusOne": 2,\n}\n+ Item is valid \u2705\n'))),(0,r.kt)(l.Z,{value:"transformed",label:"Transformed",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n- "pokemonClass": "pikachu",\n+ "partitionKey": "POKEMON#pikachu",\n- "pokemonId": "123",\n+ "sortKey": "123",\n  "created": "2022-01-01T00:00:00.000Z",\n  "modified": "2022-01-01T00:00:00.000Z",\n  "name": "Pikachu",\n  "level": 1,\n  "levelPlusOne": 2,\n}\n'))))),(0,r.kt)("details",{className:"details-in-admonition"},(0,r.kt)("summary",null,"\ud83d\udd0e ",(0,r.kt)("b",null,(0,r.kt)("code",null,"'key'")," mode")),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"input",label:"Input",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "pikachu",\n  "pokemonId": "123",\n}\n+ (Only key attributes are required)\n'))),(0,r.kt)(l.Z,{value:"defaulted",label:"Defaulted",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "pikachu",\n  "pokemonId": "123",\n}\n+ No default to apply \u2705\n'))),(0,r.kt)(l.Z,{value:"linked",label:"Linked",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "pikachu",\n  "pokemonId": "123",\n}\n+ No link to apply \u2705\n'))),(0,r.kt)(l.Z,{value:"parsed",label:"Parsed",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "pikachu",\n  "pokemonId": "123",\n}\n+ Item is valid \u2705\n'))),(0,r.kt)(l.Z,{value:"transformed",label:"Transformed",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n- "pokemonClass": "pikachu",\n+ "partitionKey": "POKEMON#pikachu",\n- "pokemonId": "123",\n+ "sortKey": "123",\n}\n'))))),(0,r.kt)("details",{className:"details-in-admonition"},(0,r.kt)("summary",null,"\ud83d\udd0e ",(0,r.kt)("b",null,(0,r.kt)("code",null,"'update'")," mode")),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"input",label:"Input",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "bulbasaur",\n  "pokemonId": "123",\n  "name": "PlantyDino",\n}\n'))),(0,r.kt)(l.Z,{value:"defaulted",label:"Defaulted",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "bulbasaur",\n  "pokemonId": "123",\n+ "modified": "2022-01-01T00:00:00.000Z",\n  "name": "PlantyDino",\n}\n'))),(0,r.kt)(l.Z,{value:"linked",label:"Linked",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "bulbasaur",\n  "pokemonId": "123",\n  "modified": "2022-01-01T00:00:00.000Z",\n  "name": "PlantyDino",\n}\n+ No updateLink to apply \u2705\n'))),(0,r.kt)(l.Z,{value:"parsed",label:"Parsed",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n  "pokemonClass": "bulbasaur",\n  "pokemonId": "123",\n  "modified": "2022-01-01T00:00:00.000Z",\n  "name": "PlantyDino",\n}\n+ Item is valid \u2705\n'))),(0,r.kt)(l.Z,{value:"transformed",label:"Transformed",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'{\n- "pokemonClass": "bulbasaur",\n+ "partitionKey": "POKEMON#bulbasaur",\n- "pokemonId": "123",\n+ "sortKey": "123",\n  "modified": "2022-01-01T00:00:00.000Z",\n  "name": "PlantyDino",\n}\n')))))),(0,r.kt)("h2",{id:"methods"},"Methods"),(0,r.kt)("h3",{id:"parse"},(0,r.kt)("inlineCode",{parentName:"h3"},"parse(...)")),(0,r.kt)("p",{style:{marginTop:"-15px"}},(0,r.kt)("i",null,(0,r.kt)("code",null,"(input: unknown, options?: ParsingOptions) => ParsedValue<SCHEMA>"))),(0,r.kt)("p",null,"Parses an input of any type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const parsedValue = pokemonSchema.build(Parser).parse(input)\n")),(0,r.kt)("p",null,"You can provide options as a second argument. Available options:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Option"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Type"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Default"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"fill")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"boolean")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"true")),(0,r.kt)("td",{parentName:"tr",align:null},"Whether to complete the input (with ",(0,r.kt)("inlineCode",{parentName:"td"},"defaults")," and ",(0,r.kt)("inlineCode",{parentName:"td"},"links"),") prior to validation or not.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"transform")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"boolean")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"true")),(0,r.kt)("td",{parentName:"tr",align:null},"Whether to transform the input (with ",(0,r.kt)("inlineCode",{parentName:"td"},"savedAs")," and ",(0,r.kt)("inlineCode",{parentName:"td"},"transform"),") after validation or not.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"mode")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"put"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"key")," or ",(0,r.kt)("inlineCode",{parentName:"td"},"update")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"put")),(0,r.kt)("td",{parentName:"tr",align:null},"The mode of the parsing: Impacts which ",(0,r.kt)("inlineCode",{parentName:"td"},"default")," and ",(0,r.kt)("inlineCode",{parentName:"td"},"link")," should be used, as well as requiredness during validation.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"parseExtension")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("em",{parentName:"td"},"(internal)")),(0,r.kt)("td",{parentName:"tr",align:"center"},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"Dependency injection required to parse extended syntax (",(0,r.kt)("inlineCode",{parentName:"td"},"$get"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"$add")," etc.) when using the ",(0,r.kt)("inlineCode",{parentName:"td"},"update")," mode (check example below).")))),(0,r.kt)("admonition",{title:"Examples",type:"note"},(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"put",label:"Put",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const pokemon = {\n  pokemonId: 'pikachu1',\n  name: 'Pikachu',\n  types: ['Electric'],\n  ...\n}\n\nconst validPokemon = pokemonSchema.build(Parser).parse(pokemon)\n"))),(0,r.kt)(l.Z,{value:"key",label:"Key",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const validKey = pokemonSchema\n  .build(Parser)\n  .parse({ pokemonId: 'pikachu1' }, { mode: 'key' })\n"))),(0,r.kt)(l.Z,{value:"update",label:"Update",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const validUpdate = pokemonSchema\n  .build(Parser)\n  .parse(\n    { pokemonId: 'bulbasaur1', customName: 'PlantyDino' },\n    { mode: 'update' }\n  )\n"))),(0,r.kt)(l.Z,{value:"update-extended",label:"Update (extended)",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import {\n  $add,\n  parseUpdateExtension\n} from 'dynamodb-toolbox/entity/actions/update'\n\nconst validUpdate = pokemonSchema.build(Parser).parse(\n  // \ud83d\udc47 `$add` is an extension, so `parseExtension`  is needed\n  { pokemonId: 'pikachu1', customName: $add(1) },\n  { mode: 'update', parseExtension: parseUpdateExtension }\n)\n"))))),(0,r.kt)("p",null,"You can use the ",(0,r.kt)("inlineCode",{parentName:"p"},"ParsedValue")," type to explicitly type an object as a parsing output object:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import type { ParsedValue } from 'dynamodb-toolbox/schema/actions/parse'\n\nconst parsedKey: ParsedValue<\n  typeof pokemonSchema,\n  // \ud83d\udc47 Optional options\n  { mode: 'key' }\n  // \u274c Throws a type error\n> = { invalid: 'input' }\n")),(0,r.kt)("h3",{id:"reparse"},(0,r.kt)("inlineCode",{parentName:"h3"},"reparse(...)")),(0,r.kt)("p",{style:{marginTop:"-15px"}},(0,r.kt)("i",null,(0,r.kt)("code",null,"(input: ParserInput<SCHEMA>, options?: ParsingOptions) => ParsedValue<SCHEMA>"))),(0,r.kt)("p",null,"Similar to ",(0,r.kt)("a",{parentName:"p",href:"#parse"},(0,r.kt)("inlineCode",{parentName:"a"},".parse")),", but with the input correctly typed (taking the mode into account) instead of ",(0,r.kt)("inlineCode",{parentName:"p"},"unknown"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"pokemonSchema\n  .build(Parser)\n  // \u274c Throws a type error\n  .reparse({ invalid: 'input' })\n")),(0,r.kt)("p",null,"You can use the ",(0,r.kt)("inlineCode",{parentName:"p"},"ParserInput")," type to explicitly type an object as a parsing input object:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import type { ParserInput } from 'dynamodb-toolbox/schema/actions/parse'\n\nconst keyInput: ParserInput<\n  typeof pokemonSchema,\n  // \ud83d\udc47 Optional options\n  { mode: 'key' }\n  // \u274c Throws a type error\n> = { invalid: 'input' }\n")),(0,r.kt)("h3",{id:"start"},(0,r.kt)("inlineCode",{parentName:"h3"},"start(...)")),(0,r.kt)("p",{style:{marginTop:"-15px"}},(0,r.kt)("i",null,(0,r.kt)("code",null,"(input: unknown, options?: ParsingOptions) => Generator<ParsedValue<SCHEMA>>"))),(0,r.kt)("p",null,"Similar to ",(0,r.kt)("a",{parentName:"p",href:"#parse"},(0,r.kt)("inlineCode",{parentName:"a"},".parse")),", but returns the underlying ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator"},"Generator")," to inspect the intermediate results of the parsing steps:"),(0,r.kt)("admonition",{title:"Examples",type:"note"},(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"complete",label:"Complete",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const parsingGenerator = pokemonSchema\n  .build(Parser)\n  .start(pokemon)\n\nconst defaultedPokemon = parsingGenerator.next().value\nconst linkedPokemon = parsingGenerator.next().value\nconst parsedPokemon = parsingGenerator.next().value\nconst transformedPokemon = parsingGenerator.next().value\n"))),(0,r.kt)(l.Z,{value:"transformed",label:"Transformed only",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const parsingGenerator = pokemonSchema\n  .build(Parser)\n  .start(pokemon, { fill: false })\n\n// \ud83d\udc47 No `fill` step\nconst parsedPokemon = parsingGenerator.next().value\nconst transformedPokemon = parsingGenerator.next().value\n"))),(0,r.kt)(l.Z,{value:"filled",label:"Filled only",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const parsingGenerator = pokemonSchema\n  .build(Parser)\n  .start(pokemon, { transform: false })\n\nconst defaultedPokemon = parsingGenerator.next().value\nconst linkedPokemon = parsingGenerator.next().value\nconst parsedPokemon = parsingGenerator.next().value\n// \ud83d\udc46 No `transform` step\n"))))),(0,r.kt)("h3",{id:"validate"},(0,r.kt)("inlineCode",{parentName:"h3"},"validate(...)")),(0,r.kt)("p",{style:{marginTop:"-15px"}},(0,r.kt)("i",null,(0,r.kt)("code",null,"(input: unknown, options?: ValidationOptions) => boolean"))),(0,r.kt)("p",null,"Runs only the ",(0,r.kt)("strong",{parentName:"p"},"parsing step")," of the parsing workflow on the provided input. Returns ",(0,r.kt)("inlineCode",{parentName:"p"},"true")," if the input is valid, catches any parsing error and returns ",(0,r.kt)("inlineCode",{parentName:"p"},"false")," otherwise:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const isValid = pokemonSchema.build(Parser).validate(input)\n")),(0,r.kt)("p",null,"Note that ",(0,r.kt)("inlineCode",{parentName:"p"},".validate(...)")," acts as a ",(0,r.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/advanced-types.html"},"typeguard"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"if (pokemonSchema.build(Parser).validate(input)) {\n  // \ud83d\ude4c Typed as `Pokemon`!\n  const { level, name } = input\n  ...\n}\n")),(0,r.kt)("p",null,"Available options:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Option"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Type"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Default"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"mode")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"put"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"key")," or ",(0,r.kt)("inlineCode",{parentName:"td"},"update")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"put")),(0,r.kt)("td",{parentName:"tr",align:null},"The mode of the parsing: Impacts requiredness during validation.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"parseExtension")),(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("em",{parentName:"td"},"(internal)")),(0,r.kt)("td",{parentName:"tr",align:"center"},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"Dependency injection required to parse extended syntax (",(0,r.kt)("inlineCode",{parentName:"td"},"$get"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"$add")," etc.) when using the ",(0,r.kt)("inlineCode",{parentName:"td"},"update")," mode (check example below).")))),(0,r.kt)("admonition",{title:"Examples",type:"note"},(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"put",label:"Put",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const pokemon = {\n  pokemonId: 'pikachu1',\n  name: 'Pikachu',\n  types: ['Electric'],\n  ...\n}\n\nconst isValid = pokemonSchema.build(Parser).validate(pokemon)\n"))),(0,r.kt)(l.Z,{value:"key",label:"Key",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const isValid = pokemonSchema\n  .build(Parser)\n  .validate({ pokemonId: 'pikachu1' }, { mode: 'key' })\n"))),(0,r.kt)(l.Z,{value:"update",label:"Update",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const isValid = pokemonSchema\n  .build(Parser)\n  .validate(\n    { pokemonId: 'bulbasaur1', customName: 'PlantyDino' },\n    { mode: 'update' }\n  )\n"))),(0,r.kt)(l.Z,{value:"update-extended",label:"Update (extended)",mdxType:"TabItem"},(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import {\n  $add,\n  parseUpdateExtension\n} from 'dynamodb-toolbox/entity/actions/update'\n\nconst isValid = pokemonSchema.build(Parser).validate(\n  // \ud83d\udc47 `$add` is an extension, so `parseExtension`  is needed\n  { pokemonId: 'pikachu1', customName: $add(1) },\n  { mode: 'update', parseExtension: parseUpdateExtension }\n)\n"))))))}c.isMDXComponent=!0}}]);