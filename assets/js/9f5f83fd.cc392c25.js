"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9634],{6356:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>r,contentTitle:()=>c,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>d});var s=n(4848),i=n(8453);const o={title:"BatchDelete",sidebar_custom_props:{sidebarActionType:"delete"}},c="BatchDeleteRequest",a={id:"entities/actions/batch-delete/index",title:"BatchDelete",description:"Builds a request to delete an entity item, to be used within BatchWriteCommands:",source:"@site/versioned_docs/version-v1/3-entities/4-actions/9-batch-delete/index.md",sourceDirName:"3-entities/4-actions/9-batch-delete",slug:"/entities/actions/batch-delete/",permalink:"/docs/v1/entities/actions/batch-delete/",draft:!1,unlisted:!1,tags:[],version:"v1",frontMatter:{title:"BatchDelete",sidebar_custom_props:{sidebarActionType:"delete"}},sidebar:"tutorialSidebar",previous:{title:"BatchPut",permalink:"/docs/v1/entities/actions/batch-put/"},next:{title:"Transactions",permalink:"/docs/v1/entities/actions/transactions/"}},r={},d=[{value:"Request",id:"request",level:2},{value:"<code>.key(...)</code>",id:"key",level:3}];function l(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"batchdeleterequest",children:"BatchDeleteRequest"})}),"\n",(0,s.jsxs)(t.p,{children:["Builds a request to delete an entity item, to be used within ",(0,s.jsx)(t.a,{href:"/docs/v1/tables/actions/batch-write/",children:(0,s.jsx)(t.code,{children:"BatchWriteCommands"})}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { BatchDeleteRequest } from 'dynamodb-toolbox/entity/actions/batchDelete'\n\nconst request = PokemonEntity.build(BatchDeleteRequest)\n\nconst params = request.params()\n"})}),"\n",(0,s.jsx)(t.h2,{id:"request",children:"Request"}),"\n",(0,s.jsx)(t.h3,{id:"key",children:(0,s.jsx)(t.code,{children:".key(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:"(required)"})}),"\n",(0,s.jsx)(t.p,{children:"The key of the item to delete (i.e. attributes that are tagged as part of the primary key):"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const request = PokemonEntity.build(BatchDeleteRequest).key(\n  { pokemonId: 'pikachu1' }\n)\n"})}),"\n",(0,s.jsxs)(t.p,{children:["You can use the ",(0,s.jsx)(t.code,{children:"KeyInputItem"})," generic type to explicitly type an object as a ",(0,s.jsx)(t.code,{children:"BatchDeleteRequest"})," key object:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import type { KeyInputItem } from 'dynamodb-toolbox/entity'\n\nconst key: KeyInputItem<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1'\n}\n\nconst request = PokemonEntity.build(BatchDeleteRequest).key(\n  key\n)\n"})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["Contrary to ",(0,s.jsx)(t.a,{href:"/docs/v1/entities/actions/delete-item/",children:(0,s.jsx)(t.code,{children:"DeleteItemCommand"})}),", batch deletes cannot be ",(0,s.jsx)(t.a,{href:"/docs/v1/entities/actions/parse-condition/",children:"conditioned"}),", nor return the values of the deleted items."]})})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>c,x:()=>a});var s=n(6540);const i={},o=s.createContext(i);function c(e){const t=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),s.createElement(o.Provider,{value:t},e.children)}}}]);