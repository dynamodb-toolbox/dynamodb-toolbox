"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9624],{3905:(e,r,t)=>{t.d(r,{Zo:()=>s,kt:()=>u});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=n.createContext({}),c=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},s=function(e){var r=c(e.components);return n.createElement(l.Provider,{value:r},e.children)},m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),d=c(t),u=o,y=d["".concat(l,".").concat(u)]||d[u]||m[u]||a;return t?n.createElement(y,i(i({ref:r},s),{},{components:t})):n.createElement(y,i({ref:r},s))}));function u(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var p={};for(var l in r)hasOwnProperty.call(r,l)&&(p[l]=r[l]);p.originalType=e,p.mdxType="string"==typeof e?e:o,i[1]=p;for(var c=2;c<a;c++)i[c]=t[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},19343:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>p,toc:()=>c});var n=t(87462),o=(t(67294),t(3905));const a={title:"\ud83d\udca5 Error management"},i="Error Management",p={unversionedId:"error-management/index",id:"error-management/index",title:"\ud83d\udca5 Error management",description:"When DynamoDB-Toolbox encounters an unexpected input, it throws an instance of DynamoDBToolboxError, which itself extends the native Error class with a code property:",source:"@site/docs/5-error-management/index.md",sourceDirName:"5-error-management",slug:"/error-management/",permalink:"/docs/error-management/",draft:!1,tags:[],version:"current",frontMatter:{title:"\ud83d\udca5 Error management"},sidebar:"tutorialSidebar",previous:{title:"prefix",permalink:"/docs/schemas/transformers/prefix"},next:{title:"What is DynamoDB Toolbox?",permalink:"/docs/v0/introduction/what-is-dynamodb-toolbox"}},l={},c=[],s={toc:c};function m(e){let{components:r,...t}=e;return(0,o.kt)("wrapper",(0,n.Z)({},s,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"error-management"},"Error Management"),(0,o.kt)("p",null,"When DynamoDB-Toolbox encounters an unexpected input, it throws an instance of ",(0,o.kt)("inlineCode",{parentName:"p"},"DynamoDBToolboxError"),", which itself extends the native ",(0,o.kt)("inlineCode",{parentName:"p"},"Error")," class with a ",(0,o.kt)("inlineCode",{parentName:"p"},"code")," property:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"await PokemonEntity\n  .build(PutItemCommand)\n  .item({ ..., level: 'not a number' })\n  .send();\n// \u274c [parsing.invalidAttributeInput] Attribute 'level' should be a number\n")),(0,o.kt)("p",null,"Some ",(0,o.kt)("inlineCode",{parentName:"p"},"DynamoDBToolboxErrors")," also expose a ",(0,o.kt)("inlineCode",{parentName:"p"},"path")," property (mostly in validations) and/or a ",(0,o.kt)("inlineCode",{parentName:"p"},"payload")," property for additional context."),(0,o.kt)("p",null,"If you need to handle them, TypeScript is your best friend, as the ",(0,o.kt)("inlineCode",{parentName:"p"},"code")," property correctly discriminates the ",(0,o.kt)("inlineCode",{parentName:"p"},"DynamoDBToolboxError")," type:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { DynamoDBToolboxError } from 'dynamodb-toolbox';\n\nconst handleError = (error: Error) => {\n  if (!error instanceof DynamoDBToolboxError) throw error;\n\n  switch (error.code) {\n    case 'parsing.invalidAttributeInput':\n      const path = error.path;\n      // => \"level\"\n      const payload = error.payload;\n      // => { received: \"not a number\", expected: \"number\" }\n      break;\n      ...\n    case 'entity.invalidItemSchema':\n      const path = error.path; // \u274c error does not have path property\n      const payload = error.payload; // \u274c same goes with payload\n      ...\n  }\n};\n")))}m.isMDXComponent=!0}}]);