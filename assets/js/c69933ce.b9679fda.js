"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7724],{15680:(e,t,n)=>{n.d(t,{xA:()=>l,yg:()=>u});var o=n(96540);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,o,i=function(e,t){if(null==e)return{};var n,o,i={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=o.createContext({}),p=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},l=function(e){var t=p(e.components);return o.createElement(s.Provider,{value:t},e.children)},d="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),d=p(n),m=i,u=d["".concat(s,".").concat(m)]||d[m]||y[m]||a;return n?o.createElement(u,r(r({ref:t},l),{},{components:n})):o.createElement(u,r({ref:t},l))}));function u(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,r=new Array(a);r[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[d]="string"==typeof e?e:i,r[1]=c;for(var p=2;p<a;p++)r[p]=n[p];return o.createElement.apply(null,r)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},16025:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>y,frontMatter:()=>a,metadata:()=>c,toc:()=>p});var o=n(58168),i=(n(96540),n(15680));const a={title:"ConditionCheck",sidebar_custom_props:{sidebarActionType:"util"}},r="ConditionCheck",c={unversionedId:"entities/actions/condition-check/index",id:"entities/actions/condition-check/index",title:"ConditionCheck",description:"Builds a condition to check against an entity item for the transaction to succeed, to be used within TransactWriteItems operations:",source:"@site/docs/3-entities/4-actions/15-condition-check/index.md",sourceDirName:"3-entities/4-actions/15-condition-check",slug:"/entities/actions/condition-check/",permalink:"/docs/entities/actions/condition-check/",draft:!1,tags:[],version:"current",frontMatter:{title:"ConditionCheck",sidebar_custom_props:{sidebarActionType:"util"}},sidebar:"tutorialSidebar",previous:{title:"TransactDelete",permalink:"/docs/entities/actions/transact-delete/"},next:{title:"Utilities",permalink:"/docs/entities/actions/utilities/"}},s={},p=[{value:"Request",id:"request",level:2},{value:"<code>.key(...)</code>",id:"key",level:3},{value:"<code>.condition(...)</code>",id:"condition",level:3},{value:"<code>.options(...)</code>",id:"options",level:3}],l={toc:p},d="wrapper";function y(e){let{components:t,...n}=e;return(0,i.yg)(d,(0,o.A)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,i.yg)("h1",{id:"conditioncheck"},"ConditionCheck"),(0,i.yg)("p",null,"Builds a condition to check against an entity item for the transaction to succeed, to be used within ",(0,i.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html"},"TransactWriteItems operations"),":"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'\nimport { ConditionCheck } from 'dynamodb-toolbox/entity/actions/transactCheck'\n\nconst transaction = PokemonEntity.build(ConditionCheck)\n\nconst params = transaction.params()\nawait execute(transaction, ...otherTransactions)\n")),(0,i.yg)("p",null,(0,i.yg)("inlineCode",{parentName:"p"},"ConditionCheck")," can be executed in conjunction with ",(0,i.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-put/"},(0,i.yg)("inlineCode",{parentName:"a"},"PutTransactions")),", ",(0,i.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-update/"},(0,i.yg)("inlineCode",{parentName:"a"},"UpdateTransactions"))," and ",(0,i.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-delete/"},(0,i.yg)("inlineCode",{parentName:"a"},"DeleteTransactions")),"."),(0,i.yg)("admonition",{type:"info"},(0,i.yg)("p",{parentName:"admonition"},"Check the ",(0,i.yg)("a",{parentName:"p",href:"/docs/entities/actions/transactions/#transactwrite"},"Transaction Documentation")," to learn more about the ",(0,i.yg)("inlineCode",{parentName:"p"},"execute")," function.")),(0,i.yg)("admonition",{type:"caution"},(0,i.yg)("p",{parentName:"admonition"},"Only ",(0,i.yg)("strong",{parentName:"p"},"one transaction per item")," is supported. For instance, you cannot run a ",(0,i.yg)("inlineCode",{parentName:"p"},"ConditionCheck")," and an ",(0,i.yg)("inlineCode",{parentName:"p"},"UpdateTransaction")," on the same item: You can, however, condition the ",(0,i.yg)("inlineCode",{parentName:"p"},"UpdateTransaction")," itself.")),(0,i.yg)("h2",{id:"request"},"Request"),(0,i.yg)("h3",{id:"key"},(0,i.yg)("inlineCode",{parentName:"h3"},".key(...)")),(0,i.yg)("p",{style:{marginTop:"-15px"}},(0,i.yg)("i",null,"(required)")),(0,i.yg)("p",null,"The key of the item to check (i.e. attributes that are tagged as part of the primary key):"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(ConditionCheck).key(\n  { pokemonId: 'pikachu1' }\n)\n")),(0,i.yg)("p",null,"You can use the ",(0,i.yg)("inlineCode",{parentName:"p"},"KeyInputItem")," generic type to explicitly type an object as a ",(0,i.yg)("inlineCode",{parentName:"p"},"ConditionCheck")," key object:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import type { KeyInputItem } from 'dynamodb-toolbox/entity'\n\nconst key: KeyInputItem<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1'\n}\n\nconst transaction =\n  PokemonEntity.build(ConditionCheck).key(key)\n")),(0,i.yg)("h3",{id:"condition"},(0,i.yg)("inlineCode",{parentName:"h3"},".condition(...)")),(0,i.yg)("p",{style:{marginTop:"-15px"}},(0,i.yg)("i",null,"(required)")),(0,i.yg)("p",null,"The condition to check against:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(ConditionCheck)\n  .key(...)\n  .condition({ attr: 'level', gte: 50 })\n")),(0,i.yg)("p",null,"See the ",(0,i.yg)("a",{parentName:"p",href:"/docs/entities/actions/parse-condition/#building-conditions"},(0,i.yg)("inlineCode",{parentName:"a"},"ConditionParser"))," action for more details on how to write conditions."),(0,i.yg)("h3",{id:"options"},(0,i.yg)("inlineCode",{parentName:"h3"},".options(...)")),(0,i.yg)("p",null,"Provides additional options:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(ConditionCheck)\n  .options({ ... })\n")),(0,i.yg)("p",null,"You can use the ",(0,i.yg)("inlineCode",{parentName:"p"},"ConditionCheckOptions")," type to explicitly type an object as a ",(0,i.yg)("inlineCode",{parentName:"p"},"ConditionCheck")," options object:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import type { ConditionCheckOptions } from 'dynamodb-toolbox/entity/actions/transactCheck'\n\nconst options: ConditionCheckOptions<\n  typeof PokemonEntity\n> = { ... }\n\nconst transaction = PokemonEntity.build(ConditionCheck)\n  .options(options)\n")),(0,i.yg)("p",null,"Available options:"),(0,i.yg)("table",null,(0,i.yg)("thead",{parentName:"table"},(0,i.yg)("tr",{parentName:"thead"},(0,i.yg)("th",{parentName:"tr",align:null},"Option"),(0,i.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,i.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,i.yg)("th",{parentName:"tr",align:null},"Description"))),(0,i.yg)("tbody",{parentName:"table"},(0,i.yg)("tr",{parentName:"tbody"},(0,i.yg)("td",{parentName:"tr",align:null},(0,i.yg)("inlineCode",{parentName:"td"},"tableName")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},"string")),(0,i.yg)("td",{parentName:"tr",align:"center"},"-"),(0,i.yg)("td",{parentName:"tr",align:null},"Overrides the ",(0,i.yg)("inlineCode",{parentName:"td"},"Table")," name. Mostly useful for ",(0,i.yg)("a",{parentName:"td",href:"https://en.wikipedia.org/wiki/Multitenancy"},"multitenancy"),".")))),(0,i.yg)("admonition",{title:"Examples",type:"note"},(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(ConditionCheck)\n  .key(...)\n  .condition(...)\n  .options({\n    tableName: `tenant-${tenantId}-pokemons`\n  })\n"))))}y.isMDXComponent=!0}}]);