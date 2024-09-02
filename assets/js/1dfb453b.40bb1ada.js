"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7410],{15680:(e,r,t)=>{t.d(r,{xA:()=>p,yg:()=>g});var n=t(96540);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=n.createContext({}),l=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},p=function(e){var r=l(e.components);return n.createElement(c.Provider,{value:r},e.children)},m="mdxType",f={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},u=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=l(t),u=a,g=m["".concat(c,".").concat(u)]||m[u]||f[u]||o;return t?n.createElement(g,s(s({ref:r},p),{},{components:t})):n.createElement(g,s({ref:r},p))}));function g(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,s=new Array(o);s[0]=u;var i={};for(var c in r)hasOwnProperty.call(r,c)&&(i[c]=r[c]);i.originalType=e,i[m]="string"==typeof e?e:a,s[1]=i;for(var l=2;l<o;l++)s[l]=t[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},99485:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>s,default:()=>f,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var n=t(58168),a=(t(96540),t(15680));const o={title:"Usage"},s="Transformers",i={unversionedId:"schemas/transformers/usage",id:"schemas/transformers/usage",title:"Usage",description:"Transformers allow modifying a primitive attribute value during the transformation step:",source:"@site/docs/4-schemas/17-transformers/1-usage.md",sourceDirName:"4-schemas/17-transformers",slug:"/schemas/transformers/usage",permalink:"/docs/schemas/transformers/usage",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Usage"},sidebar:"tutorialSidebar",previous:{title:"Format",permalink:"/docs/schemas/actions/format"},next:{title:"prefix",permalink:"/docs/schemas/transformers/prefix"}},c={},l=[],p={toc:l},m="wrapper";function f(e){let{components:r,...t}=e;return(0,a.yg)(m,(0,n.A)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"transformers"},"Transformers"),(0,a.yg)("p",null,"Transformers allow modifying a primitive attribute value during the ",(0,a.yg)("a",{parentName:"p",href:"/docs/schemas/actions/parse"},"transformation step"),":"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-ts"},"import type { Transformer } from 'dynamodb-toolbox/transformers'\n\nconst PREFIX = 'POKEMON#'\n\nconst prefix: Transformer<string, string> = {\n  // Updates the value during parsing\n  parse: input => [PREFIX, input].join(''),\n  // Updates the value back during formatting\n  format: saved => saved.slice(PREFIX.length)\n}\n\n// Saves the prefixed value\nconst pokemonIdSchema = string().transform(prefix)\nconst pokemonIdSchema = string({ transform: prefix })\n")),(0,a.yg)("p",null,"For the moment, there's only one available off-the-shelf transformer, but we hope there will be more in the future:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/docs/schemas/transformers/prefix"},(0,a.yg)("inlineCode",{parentName:"a"},"prefix")),": Prefixes a string value")),(0,a.yg)("p",null,"If you think of a transformer that you'd like to see open-sourced, feel free to open an issue or submit a PR \ud83e\udd17"))}f.isMDXComponent=!0}}]);