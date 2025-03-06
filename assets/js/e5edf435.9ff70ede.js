"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7968],{838:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>c,contentTitle:()=>a,default:()=>f,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var n=r(4848),t=r(8453);const o={title:"Usage"},a="Transformers",i={id:"schemas/transformers/usage",title:"Usage",description:"Transformers allow modifying a primitive or any attribute value during the transformation step:",source:"@site/docs/4-schemas/18-transformers/1-usage.md",sourceDirName:"4-schemas/18-transformers",slug:"/schemas/transformers/usage",permalink:"/docs/schemas/transformers/usage",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Usage"},sidebar:"tutorialSidebar",previous:{title:"DTO",permalink:"/docs/schemas/actions/dto"},next:{title:"prefix",permalink:"/docs/schemas/transformers/prefix"}},c={},l=[];function d(e){const s={a:"a",code:"code",h1:"h1",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"transformers",children:"Transformers"})}),"\n",(0,n.jsxs)(s.p,{children:["Transformers allow modifying a primitive or ",(0,n.jsx)(s.code,{children:"any"})," attribute value during the ",(0,n.jsx)(s.a,{href:"/docs/schemas/actions/parse",children:"transformation step"}),":"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"const PREFIX = 'POKEMON#'\n\nconst prefix = {\n  // Updates the value during parsing\n  parse: (input: string) => [PREFIX, input].join(''),\n  // Updates the value back during formatting\n  format: (saved: string) => saved.slice(PREFIX.length)\n}\n\n// Saves the prefixed value\nconst pokemonIdSchema = string().transform(prefix)\nconst pokemonIdSchema = string({ transform: prefix })\n"})}),"\n",(0,n.jsx)(s.p,{children:"For the moment, there's only two available off-the-shelf transformers, but we hope there will be more in the future:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"/docs/schemas/transformers/prefix",children:(0,n.jsx)(s.code,{children:"prefix"})}),": Prefixes a ",(0,n.jsx)(s.code,{children:"string"})," value"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"/docs/schemas/transformers/json-stringify",children:(0,n.jsx)(s.code,{children:"jsonStringify"})}),": Applies ",(0,n.jsx)(s.code,{children:"JSON.stringify"})," to any value"]}),"\n"]}),"\n",(0,n.jsx)(s.p,{children:"If you think of a transformer that you'd like to see open-sourced, feel free to open an issue or submit a PR \ud83e\udd17"})]})}function f(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},8453:(e,s,r)=>{r.d(s,{R:()=>a,x:()=>i});var n=r(6540);const t={},o=n.createContext(t);function a(e){const s=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),n.createElement(o.Provider,{value:s},e.children)}}}]);