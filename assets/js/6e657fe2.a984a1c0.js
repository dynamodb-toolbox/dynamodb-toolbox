"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3881],{9899:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>a,metadata:()=>c,toc:()=>u});var r=n(4848),s=n(8453),o=n(1470),i=n(9365);const a={title:"PutItem",sidebar_custom_props:{sidebarActionType:"write"}},l="PutItemCommand",c={id:"entities/actions/put-item/index",title:"PutItem",description:"Performs a PutItem Operation on an entity item:",source:"@site/docs/3-entities/4-actions/2-put-item/index.md",sourceDirName:"3-entities/4-actions/2-put-item",slug:"/entities/actions/put-item/",permalink:"/docs/entities/actions/put-item/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"PutItem",sidebar_custom_props:{sidebarActionType:"write"}},sidebar:"tutorialSidebar",previous:{title:"GetItem",permalink:"/docs/entities/actions/get-item/"},next:{title:"UpdateItem",permalink:"/docs/entities/actions/update-item/"}},d={},u=[{value:"Request",id:"request",level:2},{value:"<code>.item(...)</code>",id:"item",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Response",id:"response",level:2}];function m(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"putitemcommand",children:"PutItemCommand"})}),"\n",(0,r.jsxs)(t.p,{children:["Performs a ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html",children:"PutItem Operation"})," on an entity item:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put'\n\nconst putItemCommand = PokemonEntity.build(PutItemCommand)\n\nconst params = putItemCommand.params()\nawait putItemCommand.send()\n"})}),"\n",(0,r.jsx)(t.h2,{id:"request",children:"Request"}),"\n",(0,r.jsx)(t.h3,{id:"item",children:(0,r.jsx)(t.code,{children:".item(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:"(required)"})}),"\n",(0,r.jsx)(t.p,{children:"The item to write:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"await PokemonEntity.build(PutItemCommand)\n  .item({\n    pokemonId: 'pikachu1',\n    name: 'Pikachu',\n    pokeType: 'electric',\n    level: 50,\n    ...\n  })\n  .send()\n"})}),"\n",(0,r.jsxs)(t.p,{children:["You can use the ",(0,r.jsx)(t.code,{children:"PutItemInput"})," type to explicitly type an object as a ",(0,r.jsx)(t.code,{children:"PutItemCommand"})," item object:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import type { PutItemInput } from 'dynamodb-toolbox/entity/actions/put'\n\nconst item: PutItemInput<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1',\n  name: 'Pikachu',\n  ...\n}\n\nawait PokemonEntity.build(PutItemCommand).item(item).send()\n"})}),"\n",(0,r.jsx)(t.h3,{id:"options",children:(0,r.jsx)(t.code,{children:".options(...)"})}),"\n",(0,r.jsx)(t.p,{children:"Provides additional options:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"await PokemonEntity.build(PutItemCommand)\n  .item(...)\n  .options({\n    returnValues: 'ALL_OLD',\n    capacity: 'TOTAL',\n    ...\n  })\n  .send()\n"})}),"\n",(0,r.jsxs)(t.p,{children:["You can use the ",(0,r.jsx)(t.code,{children:"PutItemOptions"})," type to explicitly type an object as a ",(0,r.jsx)(t.code,{children:"PutItemCommand"})," options object:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import type { PutItemOptions } from 'dynamodb-toolbox/entity/actions/put'\n\nconst options: PutItemOptions<typeof PokemonEntity> = {\n  returnValues: 'ALL_OLD',\n  capacity: 'TOTAL',\n  ...\n}\n\nawait PokemonEntity.build(PutItemCommand)\n  .item(...)\n  .options(options)\n  .send()\n"})}),"\n",(0,r.jsxs)(t.p,{children:["Available options (see the ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_RequestParameters",children:"DynamoDB documentation"})," for more details):"]}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Option"}),(0,r.jsx)(t.th,{style:{textAlign:"center"},children:"Type"}),(0,r.jsx)(t.th,{style:{textAlign:"center"},children:"Default"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"condition"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"Condition<typeof PokemonEntity>"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,r.jsxs)(t.td,{children:["A condition that must be satisfied in order for the ",(0,r.jsx)(t.code,{children:"PutItemCommand"})," to succeed.",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"See the ",(0,r.jsx)(t.a,{href:"/docs/entities/actions/parse-condition/#building-conditions",children:(0,r.jsx)(t.code,{children:"ConditionParser"})})," action for more details on how to write conditions."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"returnValues"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"ReturnValuesOption"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:'"NONE"'})}),(0,r.jsxs)(t.td,{children:["To get the item attributes as they appeared before they were updated with the request.",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Possible values are ",(0,r.jsx)(t.code,{children:'"NONE"'})," and ",(0,r.jsx)(t.code,{children:'"ALL_OLD"'}),"."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"metrics"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"MetricsOption"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:'"NONE"'})}),(0,r.jsxs)(t.td,{children:["Determines whether item collection metrics are returned.",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Possible values are ",(0,r.jsx)(t.code,{children:'"NONE"'})," and ",(0,r.jsx)(t.code,{children:'"SIZE"'}),"."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"capacity"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"CapacityOption"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:'"NONE"'})}),(0,r.jsxs)(t.td,{children:["Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Possible values are ",(0,r.jsx)(t.code,{children:'"NONE"'}),", ",(0,r.jsx)(t.code,{children:'"TOTAL"'})," and ",(0,r.jsx)(t.code,{children:'"INDEXES"'}),"."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"tableName"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.code,{children:"string"})}),(0,r.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,r.jsxs)(t.td,{children:["Overrides the ",(0,r.jsx)(t.code,{children:"Table"})," name. Mostly useful for ",(0,r.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Multitenancy",children:"multitenancy"}),"."]})]})]})]}),"\n",(0,r.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,r.jsxs)(o.A,{children:[(0,r.jsx)(i.A,{value:"conditional",label:"Conditional write",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"await PokemonEntity.build(PutItemCommand)\n  .item({\n    pokemonId: 'pikachu1',\n    name: 'Pikachu',\n    pokeType: 'electric',\n    level: 50\n  })\n  .options({\n    // \ud83d\udc47 Checks that item didn't previously exist\n    condition: { attr: 'pokemonId', exists: false }\n  })\n  .send()\n"})})}),(0,r.jsx)(i.A,{value:"return-values",label:"Return values",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const { Attributes: prevPikachu } =\n  await PokemonEntity.build(PutItemCommand)\n    .item({\n      pokemonId: 'pikachu1',\n      name: 'Pikachu',\n      pokeType: 'electric',\n      level: 50\n    })\n    .options({\n      returnValues: 'ALL_OLD'\n    })\n    .send()\n"})})}),(0,r.jsx)(i.A,{value:"multitenant",label:"Multitenant",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"await PokemonEntity.build(PutItemCommand)\n  .item({\n    pokemonId: 'pikachu1',\n    name: 'Pikachu',\n    pokeType: 'electric',\n    level: 50\n  })\n  .options({\n    tableName: `tenant-${tenantId}-pokemons`\n  })\n  .send()\n"})})}),(0,r.jsx)(i.A,{value:"aborted",label:"Aborted",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const abortController = new AbortController()\nconst abortSignal = abortController.signal\n\nawait PokemonEntity.build(PutItemCommand)\n  .item({\n    pokemonId: 'pikachu1',\n    name: 'Pikachu',\n    pokeType: 'electric',\n    level: 50\n  })\n  .send({ abortSignal })\n\n// \ud83d\udc47 Aborts the command\nabortController.abort()\n"})})})]})}),"\n",(0,r.jsx)(t.h2,{id:"response",children:"Response"}),"\n",(0,r.jsxs)(t.p,{children:["The data is returned using the same response syntax as the ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_ResponseElements",children:"DynamoDB PutItem API"}),", with an additional ",(0,r.jsx)(t.code,{children:"ToolboxItem"})," property, which allows you to retrieve the item generated by DynamoDB-Toolbox:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const { ToolboxItem: generatedPokemon } =\n  await PokemonEntity.build(PutItemCommand)\n    .item(...)\n    .send()\n\n// \ud83d\udc47 Great for auto-generated attributes\nconst createdTimestamp = generatedPokemon.created\n"})}),"\n",(0,r.jsx)(t.p,{children:"If present, the returned item is formatted by the Entity."}),"\n",(0,r.jsxs)(t.p,{children:["You can use the ",(0,r.jsx)(t.code,{children:"PutItemResponse"})," type to explicitly type an object as a ",(0,r.jsx)(t.code,{children:"PutItemCommand"})," response object:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import type { PutItemResponse } from 'dynamodb-toolbox/entity/actions/put'\n\nconst response: PutItemResponse<\n  typeof PokemonEntity,\n  // \ud83d\udc47 Optional options\n  { returnValues: 'ALL_OLD' }\n  // \ud83d\udc47 Typed as Pokemon\xa0| undefined\n> = { Attributes: ... }\n"})})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}},9365:(e,t,n)=>{n.d(t,{A:()=>i});n(6540);var r=n(8215);const s={tabItem:"tabItem_Ymn6"};var o=n(4848);function i(e){let{children:t,hidden:n,className:i}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,r.A)(s.tabItem,i),hidden:n,children:t})}},1470:(e,t,n)=>{n.d(t,{A:()=>g});var r=n(6540),s=n(8215),o=n(3104),i=n(6347),a=n(205),l=n(7485),c=n(1682),d=n(679);function u(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:s}}=e;return{value:t,label:n,attributes:r,default:s}}))}(n);return function(e){const t=(0,c.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function h(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:n}=e;const s=(0,i.W6)(),o=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l.aZ)(o),(0,r.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(s.location.search);t.set(o,e),s.replace({...s.location,search:t.toString()})}),[o,s])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:s}=e,o=m(e),[i,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:o}))),[c,u]=p({queryString:n,groupId:s}),[x,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[s,o]=(0,d.Dv)(n);return[s,(0,r.useCallback)((e=>{n&&o.set(e)}),[n,o])]}({groupId:s}),j=(()=>{const e=c??x;return h({value:e,tabValues:o})?e:null})();(0,a.A)((()=>{j&&l(j)}),[j]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),b(e)}),[u,b,o]),tabValues:o}}var b=n(2303);const j={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var y=n(4848);function f(e){let{className:t,block:n,selectedValue:r,selectValue:i,tabValues:a}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.a_)(),d=e=>{const t=e.currentTarget,n=l.indexOf(t),s=a[n].value;s!==r&&(c(t),i(s))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=l.indexOf(e.currentTarget)+1;t=l[n]??l[0];break}case"ArrowLeft":{const n=l.indexOf(e.currentTarget)-1;t=l[n]??l[l.length-1];break}}t?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.A)("tabs",{"tabs--block":n},t),children:a.map((e=>{let{value:t,label:n,attributes:o}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>l.push(e),onKeyDown:u,onClick:d,...o,className:(0,s.A)("tabs__item",j.tabItem,o?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function I(e){let{lazy:t,children:n,selectedValue:o}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===o));return e?(0,r.cloneElement)(e,{className:(0,s.A)("margin-top--md",e.props.className)}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==o})))})}function P(e){const t=x(e);return(0,y.jsxs)("div",{className:(0,s.A)("tabs-container",j.tabList),children:[(0,y.jsx)(f,{...t,...e}),(0,y.jsx)(I,{...t,...e})]})}function g(e){const t=(0,b.A)();return(0,y.jsx)(P,{...e,children:u(e.children)},String(t))}},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>a});var r=n(6540);const s={},o=r.createContext(s);function i(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);