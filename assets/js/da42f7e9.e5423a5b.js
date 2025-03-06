"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[779],{7027:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>r,contentTitle:()=>o,default:()=>u,frontMatter:()=>c,metadata:()=>a,toc:()=>d});var s=n(4848),i=n(8453);const c={title:"BatchGet",sidebar_custom_props:{sidebarActionType:"read"}},o="BatchGetRequest",a={id:"entities/actions/batch-get/index",title:"BatchGet",description:"Builds a request to get an entity item, to be used within BatchGetCommands:",source:"@site/versioned_docs/version-v1/3-entities/4-actions/7-batch-get/index.md",sourceDirName:"3-entities/4-actions/7-batch-get",slug:"/entities/actions/batch-get/",permalink:"/docs/v1/entities/actions/batch-get/",draft:!1,unlisted:!1,tags:[],version:"v1",frontMatter:{title:"BatchGet",sidebar_custom_props:{sidebarActionType:"read"}},sidebar:"tutorialSidebar",previous:{title:"Batching",permalink:"/docs/v1/entities/actions/batching/"},next:{title:"BatchPut",permalink:"/docs/v1/entities/actions/batch-put/"}},r={},d=[{value:"Request",id:"request",level:2},{value:"<code>.key(...)</code>",id:"key",level:3}];function h(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"batchgetrequest",children:"BatchGetRequest"})}),"\n",(0,s.jsxs)(t.p,{children:["Builds a request to get an entity item, to be used within ",(0,s.jsx)(t.a,{href:"/docs/v1/tables/actions/batch-get/",children:(0,s.jsx)(t.code,{children:"BatchGetCommands"})}),":"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { BatchGetRequest } from 'dynamodb-toolbox/entity/actions/batchGet'\n\nconst request = PokemonEntity.build(BatchGetRequest)\n\nconst params = request.params()\n"})}),"\n",(0,s.jsx)(t.h2,{id:"request",children:"Request"}),"\n",(0,s.jsx)(t.h3,{id:"key",children:(0,s.jsx)(t.code,{children:".key(...)"})}),"\n",(0,s.jsx)("p",{style:{marginTop:"-15px"},children:(0,s.jsx)("i",{children:"(required)"})}),"\n",(0,s.jsx)(t.p,{children:"The key of the item to get (i.e. attributes that are tagged as part of the primary key):"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const request = PokemonEntity.build(BatchGetRequest).key({\n  pokemonId: 'pikachu1'\n})\n"})}),"\n",(0,s.jsxs)(t.p,{children:["You can use the ",(0,s.jsx)(t.code,{children:"KeyInputItem"})," generic type to explicitly type an object as a ",(0,s.jsx)(t.code,{children:"BatchGetRequest"})," key object:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import type { KeyInputItem } from 'dynamodb-toolbox/entity'\n\nconst key: KeyInputItem<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1'\n}\n\nconst request =\n  PokemonEntity.build(BatchGetRequest).key(key)\n"})})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>a});var s=n(6540);const i={},c=s.createContext(i);function o(e){const t=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(c.Provider,{value:t},e.children)}}}]);