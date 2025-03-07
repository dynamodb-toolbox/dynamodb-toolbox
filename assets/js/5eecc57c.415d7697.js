"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5471],{28453:(e,s,r)=>{r.d(s,{R:()=>o,x:()=>i});var n=r(96540);const t={},a=n.createContext(t);function o(e){const s=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),n.createElement(a.Provider,{value:s},e.children)}},55476:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>c,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"schemas/transformers/usage","title":"Usage","description":"Transformers allow modifying a primitive or any attribute value during the transformation step:","source":"@site/versioned_docs/version-v1/4-schemas/17-transformers/1-usage.md","sourceDirName":"4-schemas/17-transformers","slug":"/schemas/transformers/usage","permalink":"/docs/v1/schemas/transformers/usage","draft":false,"unlisted":false,"tags":[],"version":"v1","sidebarPosition":1,"frontMatter":{"title":"Usage"},"sidebar":"tutorialSidebar","previous":{"title":"Format","permalink":"/docs/v1/schemas/actions/format"},"next":{"title":"prefix","permalink":"/docs/v1/schemas/transformers/prefix"}}');var t=r(74848),a=r(28453);const o={title:"Usage"},i="Transformers",c={},l=[];function d(e){const s={a:"a",code:"code",h1:"h1",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"transformers",children:"Transformers"})}),"\n",(0,t.jsxs)(s.p,{children:["Transformers allow modifying a primitive or ",(0,t.jsx)(s.code,{children:"any"})," attribute value during the ",(0,t.jsx)(s.a,{href:"/docs/v1/schemas/actions/parse",children:"transformation step"}),":"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-ts",children:"const PREFIX = 'POKEMON#'\n\nconst prefix = {\n  // Updates the value during parsing\n  parse: (input: string) => [PREFIX, input].join(''),\n  // Updates the value back during formatting\n  format: (saved: string) => saved.slice(PREFIX.length)\n}\n\n// Saves the prefixed value\nconst pokemonIdSchema = string().transform(prefix)\nconst pokemonIdSchema = string({ transform: prefix })\n"})}),"\n",(0,t.jsx)(s.p,{children:"For the moment, there's only two available off-the-shelf transformers, but we hope there will be more in the future:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.a,{href:"/docs/v1/schemas/transformers/prefix",children:(0,t.jsx)(s.code,{children:"prefix"})}),": Prefixes a ",(0,t.jsx)(s.code,{children:"string"})," value"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.a,{href:"/docs/v1/schemas/transformers/json-stringify",children:(0,t.jsx)(s.code,{children:"jsonStringify"})}),": Applies ",(0,t.jsx)(s.code,{children:"JSON.stringify"})," to any value"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"If you think of a transformer that you'd like to see open-sourced, feel free to open an issue or submit a PR \ud83e\udd17"})]})}function f(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}}}]);