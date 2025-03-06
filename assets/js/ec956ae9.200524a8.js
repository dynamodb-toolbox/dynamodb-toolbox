"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3624],{7720:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>p,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var o=n(4848),s=n(8453);const r={title:"DTO",sidebar_custom_props:{sidebarActionType:"util"}},a="TableDTO",i={id:"tables/actions/dto/index",title:"DTO",description:"Builds a Data Transfer Object of the Table.",source:"@site/docs/2-tables/2-actions/11-dto/index.md",sourceDirName:"2-tables/2-actions/11-dto",slug:"/tables/actions/dto/",permalink:"/docs/tables/actions/dto/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"DTO",sidebar_custom_props:{sidebarActionType:"util"}},sidebar:"tutorialSidebar",previous:{title:"TableRepository",permalink:"/docs/tables/actions/repository/"},next:{title:"Synchronize",permalink:"/docs/tables/actions/synchronize/"}},c={},l=[];function d(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",header:"header",p:"p",pre:"pre",strong:"strong",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsx)(t.h1,{id:"tabledto",children:"TableDTO"})}),"\n",(0,o.jsxs)(t.p,{children:["Builds a ",(0,o.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Data_transfer_object",children:"Data Transfer Object"})," of the ",(0,o.jsx)(t.code,{children:"Table"}),"."]}),"\n",(0,o.jsxs)(t.p,{children:["A DTO is a ",(0,o.jsx)(t.strong,{children:"JSON-stringifiable object"})," representing the ",(0,o.jsx)(t.code,{children:"Table"})," that can be transferred or saved for later use:"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-ts",children:"import { TableDTO } from 'dynamodb-toolbox/table/actions/dto'\n\nconst pokeTableDTO = PokeTable.build(TableDTO)\n\nconst pokeTableJSON = JSON.stringify(tableDTO)\n"})}),"\n",(0,o.jsxs)(t.p,{children:["On DTO retrieval, you can use the ",(0,o.jsx)(t.code,{children:"fromDTO"})," util to re-create the original ",(0,o.jsx)(t.code,{children:"Table"}),":"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-ts",children:"import { fromDTO } from 'dynamodb-toolbox/table/actions/fromDTO'\n\nconst pokeTableDTO = JSON.parse(pokeTableJSON)\n\n// \ud83d\udc47 Has the same configuration as the original\nconst PokeTable = fromDTO(pokeTableDTO)\n"})}),"\n",(0,o.jsx)(t.admonition,{type:"note",children:(0,o.jsx)(t.p,{children:"All TS types are lost in the process."})})]})}function p(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>i});var o=n(6540);const s={},r=o.createContext(s);function a(e){const t=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),o.createElement(r.Provider,{value:t},e.children)}}}]);