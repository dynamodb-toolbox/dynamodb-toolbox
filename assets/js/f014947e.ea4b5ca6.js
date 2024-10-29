"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[545],{15680:(e,r,t)=>{t.d(r,{xA:()=>l,yg:()=>d});var a=t(96540);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var y=a.createContext({}),s=function(e){var r=a.useContext(y),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},l=function(e){var r=s(e.components);return a.createElement(y.Provider,{value:r},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},u=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,i=e.originalType,y=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),c=s(t),u=n,d=c["".concat(y,".").concat(u)]||c[u]||m[u]||i;return t?a.createElement(d,o(o({ref:r},l),{},{components:t})):a.createElement(d,o({ref:r},l))}));function d(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var i=t.length,o=new Array(i);o[0]=u;var p={};for(var y in r)hasOwnProperty.call(r,y)&&(p[y]=r[y]);p.originalType=e,p[c]="string"==typeof e?e:n,o[1]=p;for(var s=2;s<i;s++)o[s]=t[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},19685:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>y,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var a=t(58168),n=(t(96540),t(15680));const i={title:"Parse Primary Key",sidebar_custom_props:{sidebarActionType:"util"}},o="PrimaryKeyParser",p={unversionedId:"tables/actions/parse-primary-key/index",id:"tables/actions/parse-primary-key/index",title:"Parse Primary Key",description:"Parses a Primary Key for the provided Table.",source:"@site/docs/2-tables/2-actions/7-parse-primary-key/index.md",sourceDirName:"2-tables/2-actions/7-parse-primary-key",slug:"/tables/actions/parse-primary-key/",permalink:"/docs/tables/actions/parse-primary-key/",draft:!1,tags:[],version:"current",frontMatter:{title:"Parse Primary Key",sidebar_custom_props:{sidebarActionType:"util"}},sidebar:"tutorialSidebar",previous:{title:"Utilities",permalink:"/docs/tables/actions/utilities/"},next:{title:"Spy",permalink:"/docs/tables/actions/spy/"}},y={},s=[{value:"Output",id:"output",level:2}],l={toc:s},c="wrapper";function m(e){let{components:r,...t}=e;return(0,n.yg)(c,(0,a.A)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"primarykeyparser"},"PrimaryKeyParser"),(0,n.yg)("p",null,"Parses a ",(0,n.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey"},"Primary Key")," for the provided ",(0,n.yg)("inlineCode",{parentName:"p"},"Table"),"."),(0,n.yg)("p",null,"Given an input of any type, validates that it respects the primary key schema of the ",(0,n.yg)("inlineCode",{parentName:"p"},"Table")," and throws an error otherwise. Additional fields are silently omitted, but the input is not mutated:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-ts"},"import { PrimaryKeyParser } from 'dynamodb-toolbox/table/actions/parsePrimaryKey'\n\nconst primaryKeyParser = PokeTable.build(PrimaryKeyParser)\n\nconst primaryKey = primaryKeyParser.parse({\n  partitionKey: 'pikachu',\n  sortKey: 42,\n  foo: 'bar'\n})\n// \u2705 => { partitionKey: 'pikachu', sortKey: 42 }\n\nprimaryKeyParser.parse({ invalid: 'input' })\n// \u274c Throws an 'actions.parsePrimaryKey.invalidKeyPart' error\n")),(0,n.yg)("admonition",{type:"info"},(0,n.yg)("p",{parentName:"admonition"},"Only the presence and types of the primary key components are validated. Since the primary key schema of a ",(0,n.yg)("inlineCode",{parentName:"p"},"Table")," is not technically an instance of ",(0,n.yg)("a",{parentName:"p",href:"/docs/schemas/usage/"},(0,n.yg)("inlineCode",{parentName:"a"},"Schema")),", no ",(0,n.yg)("inlineCode",{parentName:"p"},"default"),", ",(0,n.yg)("inlineCode",{parentName:"p"},"link"),", or ",(0,n.yg)("inlineCode",{parentName:"p"},"transform")," is applied.")),(0,n.yg)("h2",{id:"output"},"Output"),(0,n.yg)("p",null,"The output is typed as the primary key of the table."),(0,n.yg)("p",null,"You can use the ",(0,n.yg)("inlineCode",{parentName:"p"},"PrimaryKey")," type to explicitly type an object as a primary key object:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-ts"},"import type { PrimaryKey } from 'dynamodb-toolbox/table/actions/parsePrimaryKey'\n\ntype PokeKey = PrimaryKey<typeof PokeTable>\n// => { partitionKey: string, sortKey: number }\n")))}m.isMDXComponent=!0}}]);