"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2707],{15680:(e,t,n)=>{n.d(t,{xA:()=>d,yg:()=>m});var i=n(96540);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,i,o=function(e,t){if(null==e)return{};var n,i,o={},a=Object.keys(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=i.createContext({}),p=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=p(e.components);return i.createElement(s.Provider,{value:t},e.children)},l="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},u=i.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),l=p(n),u=o,m=l["".concat(s,".").concat(u)]||l[u]||y[u]||a;return n?i.createElement(m,r(r({ref:t},d),{},{components:n})):i.createElement(m,r({ref:t},d))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,r=new Array(a);r[0]=u;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[l]="string"==typeof e?e:o,r[1]=c;for(var p=2;p<a;p++)r[p]=n[p];return i.createElement.apply(null,r)}return i.createElement.apply(null,n)}u.displayName="MDXCreateElement"},52013:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>y,frontMatter:()=>a,metadata:()=>c,toc:()=>p});var i=n(58168),o=(n(96540),n(15680));const a={title:"ConditionCheck",sidebar_custom_props:{sidebarActionType:"util"}},r="ConditionCheck",c={unversionedId:"entities/actions/condition-check/index",id:"entities/actions/condition-check/index",title:"ConditionCheck",description:"Builds a condition to check against an entity item for the transaction to succeed, to be used within TransactWriteItems operations:",source:"@site/docs/3-entities/3-actions/14-condition-check/index.md",sourceDirName:"3-entities/3-actions/14-condition-check",slug:"/entities/actions/condition-check/",permalink:"/docs/entities/actions/condition-check/",draft:!1,tags:[],version:"current",frontMatter:{title:"ConditionCheck",sidebar_custom_props:{sidebarActionType:"util"}},sidebar:"tutorialSidebar",previous:{title:"TransactDelete",permalink:"/docs/entities/actions/transact-delete/"},next:{title:"Utilities",permalink:"/docs/entities/actions/utilities/"}},s={},p=[{value:"Request",id:"request",level:2},{value:"<code>.key(...)</code>",id:"key",level:3},{value:"<code>.condition(...)</code>",id:"condition",level:3}],d={toc:p},l="wrapper";function y(e){let{components:t,...n}=e;return(0,o.yg)(l,(0,i.A)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"conditioncheck"},"ConditionCheck"),(0,o.yg)("p",null,"Builds a condition to check against an entity item for the transaction to succeed, to be used within ",(0,o.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html"},"TransactWriteItems operations"),":"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'\nimport { ConditionCheck } from 'dynamodb-toolbox/entity/actions/transactCheck'\n\nconst transaction = PokemonEntity.build(ConditionCheck)\n\nconst params = transaction.params()\nawait execute(transaction, ...otherTransactions)\n")),(0,o.yg)("p",null,(0,o.yg)("inlineCode",{parentName:"p"},"ConditionCheck")," can be executed in conjunction with ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-put/"},(0,o.yg)("inlineCode",{parentName:"a"},"PutTransactions")),", ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-update/"},(0,o.yg)("inlineCode",{parentName:"a"},"UpdateTransactions"))," and ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-delete/"},(0,o.yg)("inlineCode",{parentName:"a"},"DeleteTransactions")),"."),(0,o.yg)("admonition",{type:"info"},(0,o.yg)("p",{parentName:"admonition"},"Check the ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transactions/#transactwrite"},"Transaction Documentation")," to learn more about the ",(0,o.yg)("inlineCode",{parentName:"p"},"execute")," function.")),(0,o.yg)("admonition",{type:"caution"},(0,o.yg)("p",{parentName:"admonition"},"Only ",(0,o.yg)("strong",{parentName:"p"},"one transaction per item")," is supported. For instance, you cannot run a ",(0,o.yg)("inlineCode",{parentName:"p"},"ConditionCheck")," and an ",(0,o.yg)("inlineCode",{parentName:"p"},"UpdateTransaction")," on the same item: You can, however, condition the ",(0,o.yg)("inlineCode",{parentName:"p"},"UpdateTransaction")," itself.")),(0,o.yg)("h2",{id:"request"},"Request"),(0,o.yg)("h3",{id:"key"},(0,o.yg)("inlineCode",{parentName:"h3"},".key(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,"(required)")),(0,o.yg)("p",null,"The key of the item to check (i.e. attributes that are tagged as part of the primary key):"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(ConditionCheck).key(\n  { pokemonId: 'pikachu1' }\n)\n")),(0,o.yg)("p",null,"You can use the ",(0,o.yg)("inlineCode",{parentName:"p"},"KeyInput")," type from the ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/parse/"},(0,o.yg)("inlineCode",{parentName:"a"},"EntityParser"))," action to explicitly type an object as a ",(0,o.yg)("inlineCode",{parentName:"p"},"ConditionCheck")," key object:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import type { KeyInput } from 'dynamodb-toolbox/entity/actions/parse'\n\nconst key: KeyInput<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1'\n}\n\nconst transaction =\n  PokemonEntity.build(ConditionCheck).key(key)\n")),(0,o.yg)("h3",{id:"condition"},(0,o.yg)("inlineCode",{parentName:"h3"},".condition(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,"(required)")),(0,o.yg)("p",null,"The condition to check against:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(ConditionCheck)\n  .key(...)\n  .options({\n    condition: { attr: 'level', gte: 50 }\n  })\n")),(0,o.yg)("p",null,"See the ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/parse-condition/#building-conditions"},(0,o.yg)("inlineCode",{parentName:"a"},"ConditionParser"))," action for more details on how to write conditions."))}y.isMDXComponent=!0}}]);