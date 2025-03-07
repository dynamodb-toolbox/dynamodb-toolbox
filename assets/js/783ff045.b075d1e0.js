"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9682],{11470:(e,t,n)=>{n.d(t,{A:()=>v});var s=n(96540),r=n(18215),a=n(23104),o=n(56347),i=n(205),l=n(57485),c=n(31682),d=n(70679);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:r}}=e;return{value:t,label:n,attributes:s,default:r}}))}(n);return function(e){const t=(0,c.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function h(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:n}=e;const r=(0,o.W6)(),a=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l.aZ)(a),(0,s.useCallback)((e=>{if(!a)return;const t=new URLSearchParams(r.location.search);t.set(a,e),r.replace({...r.location,search:t.toString()})}),[a,r])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,a=m(e),[o,l]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:a}))),[c,u]=p({queryString:n,groupId:r}),[x,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,a]=(0,d.Dv)(n);return[r,(0,s.useCallback)((e=>{n&&a.set(e)}),[n,a])]}({groupId:r}),y=(()=>{const e=c??x;return h({value:e,tabValues:a})?e:null})();(0,i.A)((()=>{y&&l(y)}),[y]);return{selectedValue:o,selectValue:(0,s.useCallback)((e=>{if(!h({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),b(e)}),[u,b,a]),tabValues:a}}var b=n(92303);const y={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=n(74848);function f(e){let{className:t,block:n,selectedValue:s,selectValue:o,tabValues:i}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,a.a_)(),d=e=>{const t=e.currentTarget,n=l.indexOf(t),r=i[n].value;r!==s&&(c(t),o(r))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=l.indexOf(e.currentTarget)+1;t=l[n]??l[0];break}case"ArrowLeft":{const n=l.indexOf(e.currentTarget)-1;t=l[n]??l[l.length-1];break}}t?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":n},t),children:i.map((e=>{let{value:t,label:n,attributes:a}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>l.push(e),onKeyDown:u,onClick:d,...a,className:(0,r.A)("tabs__item",y.tabItem,a?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function I(e){let{lazy:t,children:n,selectedValue:a}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===a));return e?(0,s.cloneElement)(e,{className:(0,r.A)("margin-top--md",e.props.className)}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==a})))})}function g(e){const t=x(e);return(0,j.jsxs)("div",{className:(0,r.A)("tabs-container",y.tabList),children:[(0,j.jsx)(f,{...t,...e}),(0,j.jsx)(I,{...t,...e})]})}function v(e){const t=(0,b.A)();return(0,j.jsx)(g,{...e,children:u(e.children)},String(t))}},19365:(e,t,n)=>{n.d(t,{A:()=>o});n(96540);var s=n(18215);const r={tabItem:"tabItem_Ymn6"};var a=n(74848);function o(e){let{children:t,hidden:n,className:o}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,s.A)(r.tabItem,o),hidden:n,children:t})}},28195:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>h,frontMatter:()=>l,metadata:()=>s,toc:()=>u});const s=JSON.parse('{"id":"entities/actions/get-item/index","title":"GetItem","description":"Performs a GetItem Operation on an entity item:","source":"@site/docs/3-entities/4-actions/1-get-item/index.md","sourceDirName":"3-entities/4-actions/1-get-item","slug":"/entities/actions/get-item/","permalink":"/docs/entities/actions/get-item/","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"GetItem","sidebar_custom_props":{"sidebarActionType":"read"}},"sidebar":"tutorialSidebar","previous":{"title":"Type Inference","permalink":"/docs/entities/type-inference/"},"next":{"title":"PutItem","permalink":"/docs/entities/actions/put-item/"}}');var r=n(74848),a=n(28453),o=n(11470),i=n(19365);const l={title:"GetItem",sidebar_custom_props:{sidebarActionType:"read"}},c="GetItemCommand",d={},u=[{value:"Request",id:"request",level:2},{value:"<code>.key(...)</code>",id:"key",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Examples",id:"examples",level:2},{value:"Response",id:"response",level:2}];function m(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"getitemcommand",children:"GetItemCommand"})}),"\n",(0,r.jsxs)(t.p,{children:["Performs a ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html",children:"GetItem Operation"})," on an entity item:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'\n\nconst getItemCommand = PokemonEntity.build(GetItemCommand)\n\nconst params = getItemCommand.params()\nawait getItemCommand.send()\n"})}),"\n",(0,r.jsx)(t.h2,{id:"request",children:"Request"}),"\n",(0,r.jsx)(t.h3,{id:"key",children:(0,r.jsx)(t.code,{children:".key(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:"(required)"})}),"\n",(0,r.jsx)(t.p,{children:"The key of the item to get (i.e. attributes that are tagged as part of the primary key):"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .send()\n"})}),"\n",(0,r.jsxs)(t.p,{children:["You can use the ",(0,r.jsx)(t.code,{children:"KeyInputItem"})," generic type to explicitly type an object as a ",(0,r.jsx)(t.code,{children:"GetItemCommand"})," key object:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import type { KeyInputItem } from 'dynamodb-toolbox/entity'\n\nconst key: KeyInputItem<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1'\n}\n\nconst { Item } = await PokemonEntity.build(GetItemCommand)\n  .key(key)\n  .send()\n"})}),"\n",(0,r.jsx)(t.h3,{id:"options",children:(0,r.jsx)(t.code,{children:".options(...)"})}),"\n",(0,r.jsx)(t.p,{children:"Provides additional options:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key(...)\n  .options({\n    consistent: true,\n    attributes: ['type', 'level'],\n    ...\n  })\n  .send()\n"})}),"\n",(0,r.jsxs)(t.p,{children:["You can use the ",(0,r.jsx)(t.code,{children:"GetItemOptions"})," type to explicitly type an object as a ",(0,r.jsx)(t.code,{children:"GetItemCommand"})," options object:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import type { GetItemOptions } from 'dynamodb-toolbox/entity/actions/get'\n\nconst options: PutItemOptions<typeof PokemonEntity> = {\n  consistent: true,\n  attributes: ['type', 'level'],\n  ...\n}\n\nawait PokemonEntity.build(GetItemCommand)\n  .key(...)\n  .options(options)\n  .send()\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Available options (see the ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_RequestParameters",children:"DynamoDB documentation"})," for more details):"]}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Option"}),(0,r.jsx)(t.th,{style:{textAlign:"center"},children:"Type"}),(0,r.jsx)(t.th,{style:{textAlign:"center"},children:"Default"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"consistent"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"boolean"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"false"})}),(0,r.jsxs)(t.td,{children:["By default, read operations are ",(0,r.jsx)("b",{children:"eventually"})," consistent (which improves performances and reduces costs).",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Set to ",(0,r.jsx)(t.code,{children:"true"})," to use ",(0,r.jsx)("b",{children:"strongly"})," consistent reads."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"attributes"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"Path<Entity>[]"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,r.jsxs)(t.td,{children:["To specify a list of attributes to retrieve (improves performances but does not reduce costs).",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"See the ",(0,r.jsx)(t.a,{href:"/docs/entities/actions/parse-paths/#paths",children:(0,r.jsx)(t.code,{children:"PathParser"})})," action for more details on how to write attribute paths."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"capacity"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"CapacityOption"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:'"NONE"'})}),(0,r.jsxs)(t.td,{children:["Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Possible values are ",(0,r.jsx)(t.code,{children:'"NONE"'}),", ",(0,r.jsx)(t.code,{children:'"TOTAL"'})," and ",(0,r.jsx)(t.code,{children:'"INDEXES"'}),"."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"tableName"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"string"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,r.jsxs)(t.td,{children:["Overrides the ",(0,r.jsx)(t.code,{children:"Table"})," name. Mostly useful for ",(0,r.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Multitenancy",children:"multitenancy"}),"."]})]})]})]}),"\n",(0,r.jsx)(t.h2,{id:"examples",children:"Examples"}),"\n",(0,r.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,r.jsxs)(o.A,{children:[(0,r.jsx)(i.A,{value:"basic",label:"Basic",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .send()\n"})})}),(0,r.jsx)(i.A,{value:"consistent",label:"Consistent",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .options({ consistent: true })\n  .send()\n"})})}),(0,r.jsx)(i.A,{value:"attributes",label:"Attributes",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .options({ attributes: ['type', 'level'] })\n  .send()\n"})})}),(0,r.jsx)(i.A,{value:"multitenant",label:"Multitenant",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .options({ tableName: `tenant-${tenantId}-pokemons` })\n  .send()\n"})})}),(0,r.jsx)(i.A,{value:"aborted",label:"Aborted",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const abortController = new AbortController()\nconst abortSignal = abortController.signal\n\nconst { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .send({ abortSignal })\n\n// \ud83d\udc47 Aborts the command\nabortController.abort()\n"})})})]})}),"\n",(0,r.jsx)(t.h2,{id:"response",children:"Response"}),"\n",(0,r.jsxs)(t.p,{children:["The data is returned using the same response syntax as the ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_ResponseElements",children:"DynamoDB GetItem API"}),". If present, the returned item is formatted by the Entity."]}),"\n",(0,r.jsxs)(t.p,{children:["You can use the ",(0,r.jsx)(t.code,{children:"GetItemResponse"})," type to explicitly type an object as a ",(0,r.jsx)(t.code,{children:"GetItemCommand"})," response object:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import type { GetItemResponse } from 'dynamodb-toolbox/entity/actions/get'\n\nconst getItemResponse: GetItemResponse<\n  typeof PokemonEntity,\n  // \ud83d\udc47 Optional options\n  { attributes: ['type', 'level'] }\n  // \ud83d\udc47 Typed as Pick<Pokemon, 'type' |\xa0'level'>\xa0| undefined\n> = { Item: ... }\n"})})]})}function h(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>i});var s=n(96540);const r={},a=s.createContext(r);function o(e){const t=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(a.Provider,{value:t},e.children)}}}]);