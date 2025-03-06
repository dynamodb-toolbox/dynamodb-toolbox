"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8157],{1283:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>c,toc:()=>u});var s=t(4848),i=t(8453),r=t(1470),a=t(9365);const o={title:"Usage"},l="Entity",c={id:"entities/usage/index",title:"Usage",description:"Entities represent a category of items in your Table.",source:"@site/docs/3-entities/1-usage/index.md",sourceDirName:"3-entities/1-usage",slug:"/entities/usage/",permalink:"/docs/entities/usage/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Usage"},sidebar:"tutorialSidebar",previous:{title:"Synchronize",permalink:"/docs/tables/actions/synchronize/"},next:{title:"Internal Attributes",permalink:"/docs/entities/internal-attributes/"}},d={},u=[{value:"Constructor",id:"constructor",level:2},{value:"<code>name</code>",id:"name",level:3},{value:"<code>schema</code>",id:"schema",level:3},{value:"<code>table</code>",id:"table",level:3},{value:"<code>computeKey</code>",id:"computekey",level:3},{value:"<code>entityAttribute</code>",id:"entityattribute",level:3},{value:"<code>timestamps</code>",id:"timestamps",level:3},{value:"Building Entity Actions",id:"building-entity-actions",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"entity",children:"Entity"})}),"\n",(0,s.jsxs)(n.p,{children:["Entities represent a ",(0,s.jsx)(n.strong,{children:"category of items"})," in your ",(0,s.jsx)(n.code,{children:"Table"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["An entity must belong to a ",(0,s.jsx)(n.code,{children:"Table"}),", but a ",(0,s.jsx)(n.code,{children:"Table"})," can ",(0,s.jsx)(n.strong,{children:"contain items from several entities"}),". DynamoDB-Toolbox is designed with ",(0,s.jsx)(n.a,{href:"https://www.alexdebrie.com/posts/dynamodb-single-table/",children:"Single Tables"})," in mind, but works just as well with multiple tables and still makes your life much easier (e.g. for ",(0,s.jsx)(n.a,{href:"/docs/entities/actions/batching/",children:"batch operations"})," or ",(0,s.jsx)(n.a,{href:"/docs/entities/actions/transactions/",children:"transactions"}),"):"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { Entity } from 'dynamodb-toolbox/entity'\nimport { item } from 'dynamodb-toolbox/schema/item'\nimport { string } from 'dynamodb-toolbox/schema/string'\n\nconst PokemonEntity = new Entity({\n  name: 'POKEMON',\n  table: PokeTable,\n  schema: item({\n    name: string(),\n    ...\n  })\n})\n"})}),"\n",(0,s.jsxs)(n.admonition,{type:"info",children:[(0,s.jsxs)(n.p,{children:["Note that you can provide a ",(0,s.jsx)(n.a,{href:"/docs/schemas/map/",children:(0,s.jsx)(n.code,{children:"map"})})," schema to the ",(0,s.jsx)(n.code,{children:"Entity"})," constructor:"]}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { Entity } from 'dynamodb-toolbox/entity'\nimport { map } from 'dynamodb-toolbox/schema/map'\nimport { string } from 'dynamodb-toolbox/schema/string'\n\nconst PokemonEntity = new Entity({\n  name: 'POKEMON',\n  table: PokeTable,\n  schema: map({\n    name: string(),\n    ...\n  })\n})\n"})}),(0,s.jsxs)(n.p,{children:["See the ",(0,s.jsx)(n.a,{href:"/docs/schemas/usage/",children:"Schema Section"})," for more details."]})]}),"\n",(0,s.jsx)(n.h2,{id:"constructor",children:"Constructor"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"Entity"})," constructor takes a single parameter of type ",(0,s.jsx)(n.code,{children:"object"})," and accepts the following properties:"]}),"\n",(0,s.jsx)(n.h3,{id:"name",children:(0,s.jsx)(n.code,{children:"name"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:"(required)"})}),"\n",(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.code,{children:"string"})," that uniquely identifies your entity:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  name: 'POKEMON',\n  ...\n})\n"})}),"\n",(0,s.jsxs)(n.admonition,{type:"warning",children:[(0,s.jsxs)(n.p,{children:["DynamoDB-Toolbox automatically tags your items with their respective entity names (see ",(0,s.jsx)(n.a,{href:"/docs/entities/internal-attributes/#entity",children:"Internal Attributes"}),"). While this can be opted out of, we strongly recommend keeping it enabled if you use Single Table Design."]}),(0,s.jsxs)(n.p,{children:["\u261d\ufe0f A consequence is that ",(0,s.jsx)(n.code,{children:"name"})," ",(0,s.jsx)(n.strong,{children:"cannot be updated"})," once your ",(0,s.jsx)(n.code,{children:"Entity"})," has its first items* (at least not without a data migration first), so choose wisely!"]})]}),"\n",(0,s.jsx)(n.h3,{id:"schema",children:(0,s.jsx)(n.code,{children:"schema"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:"(required)"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"schema"})," of the ",(0,s.jsx)(n.code,{children:"Entity"}),". See the ",(0,s.jsx)(n.a,{href:"/docs/schemas/usage/",children:"Schema Section"})," for more details on how to define schemas."]}),"\n",(0,s.jsx)(n.h3,{id:"table",children:(0,s.jsx)(n.code,{children:"table"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:"(required)"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.a,{href:"/docs/tables/usage/",children:(0,s.jsx)(n.code,{children:"Table"})})," of the ",(0,s.jsx)(n.code,{children:"Entity"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["DynamoDB-Toolbox must check that an entity ",(0,s.jsx)(n.code,{children:"schema"})," matches its ",(0,s.jsx)(n.code,{children:"Table"})," primary key somehow. In simple cases, both schemas can ",(0,s.jsx)(n.strong,{children:"simply fit"}),":"]}),"\n",(0,s.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(a.A,{value:"direct-match",label:"Direct match",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const PokeTable = new Table({\n  partitionKey: { name: 'pk', type: 'string' },\n  sortKey: { name: 'sk', type: 'number' },\n  ...\n})\n\nconst PokemonEntity = new Entity({\n  table: PokeTable,\n  schema: item({\n    pk: string().key(),\n    sk: number().key(),\n    ...\n  }),\n})\n"})})}),(0,s.jsx)(a.A,{value:"saving-as",label:"Renaming",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const PokeTable = new Table({\n  partitionKey: { name: 'pk', type: 'string' },\n  sortKey: { name: 'sk', type: 'number' },\n  ...\n})\n\nconst PokemonEntity = new Entity({\n  table: PokeTable,\n  schema: item({\n    // \ud83d\udc47 renaming works\n    pokemonId: string().savedAs('pk').key(),\n    level: number().savedAs('sk').key(),\n    ...\n  }),\n})\n"})})}),(0,s.jsxs)(a.A,{value:"prefixing",label:"Prefixing",children:[(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { prefix } from 'dynamodb-toolbox/transformers/prefix'\n\nconst PokeTable = new Table({\n  partitionKey: { name: 'pk', type: 'string' },\n  sortKey: { name: 'sk', type: 'number' },\n  ...\n})\n\nconst PokemonEntity = new Entity({\n  table: PokeTable,\n  schema: item({\n    // \ud83d\udc47 saved as `POKEMON#${pokemonId}`\n    pokemonId: string()\n      .transform(prefix('POKEMON'))\n      .savedAs('pk')\n      .key(),\n    level: number().savedAs('sk').key(),\n    ...\n  })\n})\n"})}),(0,s.jsxs)(n.p,{children:["\ud83d\udc49 See the ",(0,s.jsx)(n.a,{href:"/docs/schemas/transformers/usage",children:"transformers section"})," for more details on transformers."]})]}),(0,s.jsx)(a.A,{value:"linked",label:"Linked",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const PokeTable = new Table({\n  partitionKey: { name: 'pk', type: 'string' },\n  ...\n})\n\nconst PokemonEntity = new Entity({\n  table: PokeTable,\n  schema: item({\n    // \ud83d\udc47 linked attributes should also be tagged as `.key()`\n    pokemonId: string().key(),\n    trainerId: string().key(),\n    ...\n  }).and(prevSchema => ({\n    pk: string()\n      .key()\n      .link<typeof prevSchema>(\n        ({ trainerId, pokemonId }) =>\n          `${trainerId}#${pokemonId}`\n      )\n  }))\n})\n"})})})]})}),"\n",(0,s.jsx)(n.h3,{id:"computekey",children:(0,s.jsx)(n.code,{children:"computeKey"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsxs)("i",{children:["(potentially required, depending on ",(0,s.jsx)("code",{children:"schema"}),")"]})}),"\n",(0,s.jsxs)(n.p,{children:["...but ",(0,s.jsx)(n.strong,{children:"using schemas that don't fit is OK"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["In this case, the ",(0,s.jsx)(n.code,{children:"Entity"})," constructor requires a ",(0,s.jsx)(n.code,{children:"computeKey"})," function to derive the primary key from the ",(0,s.jsx)(n.code,{children:"Entity"})," key attributes."]}),"\n",(0,s.jsx)(n.p,{children:"This can be useful for more complex cases like mapping several attributes to the same key:"}),"\n",(0,s.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,s.jsxs)(r.A,{children:[(0,s.jsx)(a.A,{value:"renaming",label:"Renaming",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  table: PokeTable,\n  schema: item({\n    // \ud83d\udc47 linked attributes should also be tagged as `.key()`\n    pokemonId: string().key(),\n    level: number().key(),\n    ...\n  }),\n  // \ud83d\ude4c Types are correctly inferred!\n  computeKey: ({ pokemonId, level }) => ({\n    pk: pokemonId,\n    sk: level\n  })\n})\n"})})}),(0,s.jsx)(a.A,{value:"composing",label:"Composing",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  table: PokeTable,\n  schema: item({\n    // \ud83d\udc47 linked attributes should also be tagged as `.key()`\n    specifiers: list(string()).key(),\n    sk: number().key(),\n    ...\n  }),\n  computeKey: ({ specifiers, sk }) => ({\n    pk: specifiers.join('#'),\n    sk\n  })\n})\n"})})})]})}),"\n",(0,s.jsx)(n.h3,{id:"entityattribute",children:(0,s.jsx)(n.code,{children:"entityAttribute"})}),"\n",(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.code,{children:"boolean"})," or ",(0,s.jsx)(n.code,{children:"object"})," to customize the internal ",(0,s.jsx)(n.code,{children:"entity"})," attributes (see ",(0,s.jsx)(n.a,{href:"/docs/entities/internal-attributes/#entity",children:"Internal Attributes"}),")."]}),"\n",(0,s.jsx)(n.h3,{id:"timestamps",children:(0,s.jsx)(n.code,{children:"timestamps"})}),"\n",(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.code,{children:"boolean"})," or ",(0,s.jsx)(n.code,{children:"object"})," to customize the internal ",(0,s.jsx)(n.code,{children:"created"})," and ",(0,s.jsx)(n.code,{children:"modified"})," attributes (see ",(0,s.jsx)(n.a,{href:"/docs/entities/internal-attributes/#timestamp-attributes",children:"Internal Attributes"}),")."]}),"\n",(0,s.jsx)(n.h2,{id:"building-entity-actions",children:"Building Entity Actions"}),"\n",(0,s.jsxs)(n.p,{children:["To allow for ",(0,s.jsx)(n.strong,{children:"extensibility"}),", ",(0,s.jsx)(n.strong,{children:"better code-splitting"})," and ",(0,s.jsx)(n.strong,{children:"lighter bundles"}),", ",(0,s.jsx)(n.code,{children:"Entities"})," only expose a ",(0,s.jsx)(n.code,{children:".build(...)"})," method which acts as a gateway to perform Entity ",(0,s.jsx)(n.a,{href:"/docs/getting-started/usage/#how-do-actions-work",children:"Actions"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'\n\nconst { Item } = await PokemonEntity.build(GetItemCommand)\n  .key(key)\n  .send()\n"})}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["If you don't mind large bundle sizes, you can still use the ",(0,s.jsx)(n.a,{href:"/docs/entities/actions/repository/",children:(0,s.jsx)(n.code,{children:"EntityRepository"})})," actions that expose all the others as methods."]})})]})}function m(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},9365:(e,n,t)=>{t.d(n,{A:()=>a});t(6540);var s=t(8215);const i={tabItem:"tabItem_Ymn6"};var r=t(4848);function a(e){let{children:n,hidden:t,className:a}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(i.tabItem,a),hidden:t,children:n})}},1470:(e,n,t)=>{t.d(n,{A:()=>v});var s=t(6540),i=t(8215),r=t(3104),a=t(6347),o=t(205),l=t(7485),c=t(1682),d=t(679);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:s,default:i}}=e;return{value:n,label:t,attributes:s,default:i}}))}(t);return function(e){const n=(0,c.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function m(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:t}=e;const i=(0,a.W6)(),r=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,l.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(i.location.search);n.set(r,e),i.replace({...i.location,search:n.toString()})}),[r,i])]}function b(e){const{defaultValue:n,queryString:t=!1,groupId:i}=e,r=h(e),[a,l]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=t.find((e=>e.default))??t[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:r}))),[c,u]=p({queryString:t,groupId:i}),[b,x]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[i,r]=(0,d.Dv)(t);return[i,(0,s.useCallback)((e=>{t&&r.set(e)}),[t,r])]}({groupId:i}),y=(()=>{const e=c??b;return m({value:e,tabValues:r})?e:null})();(0,o.A)((()=>{y&&l(y)}),[y]);return{selectedValue:a,selectValue:(0,s.useCallback)((e=>{if(!m({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),x(e)}),[u,x,r]),tabValues:r}}var x=t(2303);const y={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=t(4848);function g(e){let{className:n,block:t,selectedValue:s,selectValue:a,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,r.a_)(),d=e=>{const n=e.currentTarget,t=l.indexOf(n),i=o[t].value;i!==s&&(c(n),a(i))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=l.indexOf(e.currentTarget)+1;n=l[t]??l[0];break}case"ArrowLeft":{const t=l.indexOf(e.currentTarget)-1;n=l[t]??l[l.length-1];break}}n?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.A)("tabs",{"tabs--block":t},n),children:o.map((e=>{let{value:n,label:t,attributes:r}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>l.push(e),onKeyDown:u,onClick:d,...r,className:(0,i.A)("tabs__item",y.tabItem,r?.className,{"tabs__item--active":s===n}),children:t??n},n)}))})}function f(e){let{lazy:n,children:t,selectedValue:r}=e;const a=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=a.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:(0,i.A)("margin-top--md",e.props.className)}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:a.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==r})))})}function k(e){const n=b(e);return(0,j.jsxs)("div",{className:(0,i.A)("tabs-container",y.tabList),children:[(0,j.jsx)(g,{...n,...e}),(0,j.jsx)(f,{...n,...e})]})}function v(e){const n=(0,x.A)();return(0,j.jsx)(k,{...e,children:u(e.children)},String(n))}},8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>o});var s=t(6540);const i={},r=s.createContext(i);function a(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);