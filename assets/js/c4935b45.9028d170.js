"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8266],{3202:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>l,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var n=s(4848),a=s(8453);const r={sidebar_position:6,title:"Custom Parameters and Clauses"},o="Adding Custom Parameters and Clauses",i={id:"custom-parameters/index",title:"Custom Parameters and Clauses",description:"This library supports all API options for the available API methods, so it is unnecessary for you to provide additional parameters. However, if you would like to pass custom parameters, simply pass them in an object as the last parameter to any appropriate method.",source:"@site/versioned_docs/version-v0.9/6-custom-parameters/index.md",sourceDirName:"6-custom-parameters",slug:"/custom-parameters/",permalink:"/docs/v0.9/custom-parameters/",draft:!1,unlisted:!1,tags:[],version:"v0.9",sidebarPosition:6,frontMatter:{sidebar_position:6,title:"Custom Parameters and Clauses"},sidebar:"tutorialSidebar",previous:{title:"Projection Expressions",permalink:"/docs/v0.9/projection-expressions/"},next:{title:"Type Inference",permalink:"/docs/v0.9/type-inference/"}},d={},c=[];function p(e){const t={code:"code",h1:"h1",header:"header",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"adding-custom-parameters-and-clauses",children:"Adding Custom Parameters and Clauses"})}),"\n",(0,n.jsx)(t.p,{children:"This library supports all API options for the available API methods, so it is unnecessary for you to provide additional parameters. However, if you would like to pass custom parameters, simply pass them in an object as the last parameter to any appropriate method."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-typescript",children:"const result = await MyEntity.update(\n  item, // the item to update\n  { ..options... }, // method options\n  { // your custom parameters\n    ReturnConsumedCapacity: 'TOTAL',\n    ReturnValues: 'ALL_NEW'\n  }\n)\n"})}),"\n",(0,n.jsxs)(t.p,{children:["For the ",(0,n.jsx)(t.code,{children:"update"})," method, you can add additional statements to the clauses by specifying arrays as the ",(0,n.jsx)(t.code,{children:"SET"}),", ",(0,n.jsx)(t.code,{children:"ADD"}),", ",(0,n.jsx)(t.code,{children:"REMOVE"})," and ",(0,n.jsx)(t.code,{children:"DELETE"})," properties. You can also specify additional ",(0,n.jsx)(t.code,{children:"ExpressionAttributeNames"})," and ",(0,n.jsx)(t.code,{children:"ExpressionAttributeValues"})," with object values and the system will merge them in with the generated ones."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-typescript",children:"const results = await MyEntity.update(\n  item,\n  {},\n  {\n    SET: ['#somefield = :somevalue'],\n    ExpressionAttributeNames: { '#somefield': 'somefield' },\n    ExpressionAttributeValues: { ':somevalue': 123 }\n  }\n)\n"})})]})}function l(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(p,{...e})}):p(e)}},8453:(e,t,s)=>{s.d(t,{R:()=>o,x:()=>i});var n=s(6540);const a={},r=n.createContext(a);function o(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);