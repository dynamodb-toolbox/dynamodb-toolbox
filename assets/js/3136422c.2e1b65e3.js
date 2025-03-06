"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[1995],{2347:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var s=r(4848),t=r(8453);const o={title:"jsonStringify",sidebar_custom_props:{code:!0}},i="JSONStringify",a={id:"schemas/transformers/json-stringify",title:"jsonStringify",description:"Applies JSON.stringify to any value:",source:"@site/docs/4-schemas/18-transformers/3-json-stringify.md",sourceDirName:"4-schemas/18-transformers",slug:"/schemas/transformers/json-stringify",permalink:"/docs/schemas/transformers/json-stringify",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"jsonStringify",sidebar_custom_props:{code:!0}},sidebar:"tutorialSidebar",previous:{title:"prefix",permalink:"/docs/schemas/transformers/prefix"},next:{title:"\ud83d\udca5 Error management",permalink:"/docs/error-management/"}},c={},l=[];function d(e){const n={a:"a",code:"code",h1:"h1",header:"header",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"jsonstringify",children:"JSONStringify"})}),"\n",(0,s.jsxs)(n.p,{children:["Applies ",(0,s.jsx)(n.code,{children:"JSON.stringify"})," to any value:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { jsonStringify } from 'dynamodb-toolbox/transformers/jsonStringify'\n\nconst stringifiedSchema = any().transform(jsonStringify())\n"})}),"\n",(0,s.jsxs)(n.p,{children:["If needed, you can provide custom ",(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space",children:(0,s.jsx)(n.code,{children:"space"})}),", ",(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer",children:(0,s.jsx)(n.code,{children:"replacer"})})," and ",(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#reviver",children:(0,s.jsx)(n.code,{children:"reviver"})})," options:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"import { jsonStringify } from 'dynamodb-toolbox/transformers/jsonStringify'\n\nconst stringifiedSchema = any().transform(\n  jsonStringify({\n    space: 2,\n    // Save prices as cents\n    replacer: (_, dollars) =>\n      typeof dollars === 'number'\n        ? Math.round(dollars * 100)\n        : value,\n    // Revive cents as dollars\n    reviver: (_, cents) =>\n      typeof cents === 'number' ? cents / 100 : cents\n  })\n)\n"})})]})}function f(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>a});var s=r(6540);const t={},o=s.createContext(t);function i(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);