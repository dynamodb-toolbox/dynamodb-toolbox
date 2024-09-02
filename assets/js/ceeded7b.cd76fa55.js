"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7308],{15680:(e,t,i)=>{i.d(t,{xA:()=>p,yg:()=>u});var n=i(96540);function r(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function a(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function o(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?a(Object(i),!0).forEach((function(t){r(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):a(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function s(e,t){if(null==e)return{};var i,n,r=function(e,t){if(null==e)return{};var i,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)i=a[n],t.indexOf(i)>=0||(r[i]=e[i]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)i=a[n],t.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(e,i)&&(r[i]=e[i])}return r}var l=n.createContext({}),c=function(e){var t=n.useContext(l),i=t;return e&&(i="function"==typeof e?e(t):o(o({},t),e)),i},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},d="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var i=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(i),m=r,u=d["".concat(l,".").concat(m)]||d[m]||y[m]||a;return i?n.createElement(u,o(o({ref:t},p),{},{components:i})):n.createElement(u,o({ref:t},p))}));function u(e,t){var i=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=i.length,o=new Array(a);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:r,o[1]=s;for(var c=2;c<a;c++)o[c]=i[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,i)}m.displayName="MDXCreateElement"},32130:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>y,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var n=i(58168),r=(i(96540),i(15680));const a={title:"Utilities",sidebar_custom_props:{sidebarActionTitle:!0}},o="Utilities",s={unversionedId:"entities/actions/utilities/index",id:"entities/actions/utilities/index",title:"Utilities",description:"DynamoDB-Toolbox exposes the following utility actions for Entities:",source:"@site/docs/3-entities/3-actions/15-utilities/index.md",sourceDirName:"3-entities/3-actions/15-utilities",slug:"/entities/actions/utilities/",permalink:"/docs/entities/actions/utilities/",draft:!1,tags:[],version:"current",frontMatter:{title:"Utilities",sidebar_custom_props:{sidebarActionTitle:!0}},sidebar:"tutorialSidebar",previous:{title:"ConditionCheck",permalink:"/docs/entities/actions/condition-check/"},next:{title:"Parse",permalink:"/docs/entities/actions/parse/"}},l={},c=[],p={toc:c},d="wrapper";function y(e){let{components:t,...i}=e;return(0,r.yg)(d,(0,n.A)({},p,i,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"utilities"},"Utilities"),(0,r.yg)("p",null,"DynamoDB-Toolbox exposes the following ",(0,r.yg)("em",{parentName:"p"},"utility")," actions for ",(0,r.yg)("inlineCode",{parentName:"p"},"Entities"),":"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/entities/actions/parse/"},(0,r.yg)("inlineCode",{parentName:"a"},"EntityParser")),": Given an input of any type and a mode, validates that it respects the schema of the ",(0,r.yg)("inlineCode",{parentName:"li"},"Entity")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/entities/actions/parse-condition/"},(0,r.yg)("inlineCode",{parentName:"a"},"ConditionParser")),": Builds a ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html"},"Condition Expression")," that can be used to condition write operations, or filter the results of a ",(0,r.yg)("a",{parentName:"li",href:"/docs/tables/actions/query/"},"Query")," or a ",(0,r.yg)("a",{parentName:"li",href:"/docs/tables/actions/scan/"},"Scan")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/entities/actions/parse-paths/"},(0,r.yg)("inlineCode",{parentName:"a"},"PathParser")),": Builds a ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html"},"Projection Expression")," that can be used to filter the returned attributes of a read operation like a ",(0,r.yg)("a",{parentName:"li",href:"/docs/entities/actions/get-item/"},"GetItem"),", ",(0,r.yg)("a",{parentName:"li",href:"/docs/tables/actions/query"},"Query")," or ",(0,r.yg)("a",{parentName:"li",href:"/docs/tables/actions/scan"},"Scan")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/entities/actions/format/"},(0,r.yg)("inlineCode",{parentName:"a"},"EntityFormatter")),": Given a saved item, validates that it respects the schema of the ",(0,r.yg)("inlineCode",{parentName:"li"},"Entity")," and formats it"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/entities/actions/spy/"},(0,r.yg)("inlineCode",{parentName:"a"},"EntitySpy")),": Enables ",(0,r.yg)("a",{parentName:"li",href:"https://en.wikipedia.org/wiki/Mock_object"},"spying")," the provided ",(0,r.yg)("inlineCode",{parentName:"li"},"Entity"))))}y.isMDXComponent=!0}}]);