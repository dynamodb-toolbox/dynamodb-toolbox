"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8852],{15680:(e,t,n)=>{n.d(t,{xA:()=>l,yg:()=>u});var a=n(96540);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=a.createContext({}),c=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},l=function(e){var t=c(e.components);return a.createElement(p.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},y=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=c(n),y=o,u=d["".concat(p,".").concat(y)]||d[y]||m[y]||i;return n?a.createElement(u,r(r({ref:t},l),{},{components:n})):a.createElement(u,r({ref:t},l))}));function u(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=y;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s[d]="string"==typeof e?e:o,r[1]=s;for(var c=2;c<i;c++)r[c]=n[c];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}y.displayName="MDXCreateElement"},57995:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>r,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var a=n(58168),o=(n(96540),n(15680));const i={title:"TransactUpdate",sidebar_custom_props:{sidebarActionType:"write"}},r="UpdateTransaction",s={unversionedId:"entities/actions/transact-update/index",id:"entities/actions/transact-update/index",title:"TransactUpdate",description:"Builds a transaction to update an entity item, to be used within TransactWriteItems operations:",source:"@site/docs/3-entities/3-actions/12-transact-update/index.md",sourceDirName:"3-entities/3-actions/12-transact-update",slug:"/entities/actions/transact-update/",permalink:"/docs/entities/actions/transact-update/",draft:!1,tags:[],version:"current",frontMatter:{title:"TransactUpdate",sidebar_custom_props:{sidebarActionType:"write"}},sidebar:"tutorialSidebar",previous:{title:"TransactPut",permalink:"/docs/entities/actions/transact-put/"},next:{title:"TransactDelete",permalink:"/docs/entities/actions/transact-delete/"}},p={},c=[{value:"Request",id:"request",level:2},{value:"<code>.item(...)</code>",id:"item",level:3},{value:"<code>.options(...)</code>",id:"options",level:3}],l={toc:c},d="wrapper";function m(e){let{components:t,...n}=e;return(0,o.yg)(d,(0,a.A)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"updatetransaction"},"UpdateTransaction"),(0,o.yg)("p",null,"Builds a transaction to update an entity item, to be used within ",(0,o.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html"},"TransactWriteItems operations"),":"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'\nimport { UpdateTransaction } from 'dynamodb-toolbox/entity/actions/transactUpdate'\n\nconst transaction = PokemonEntity.build(UpdateTransaction)\n\nconst params = transaction.params()\nawait execute(transaction, ...otherTransactions)\n")),(0,o.yg)("p",null,(0,o.yg)("inlineCode",{parentName:"p"},"UpdateTransactions")," can be executed in conjunction with ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-put/"},(0,o.yg)("inlineCode",{parentName:"a"},"PutTransactions")),", ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-delete/"},(0,o.yg)("inlineCode",{parentName:"a"},"DeleteTransactions"))," and ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/condition-check/"},(0,o.yg)("inlineCode",{parentName:"a"},"ConditionChecks")),"."),(0,o.yg)("admonition",{type:"info"},(0,o.yg)("p",{parentName:"admonition"},"Check the ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transactions/#transactwrite"},"Transaction Documentation")," to learn more about the ",(0,o.yg)("inlineCode",{parentName:"p"},"execute")," function.")),(0,o.yg)("h2",{id:"request"},"Request"),(0,o.yg)("h3",{id:"item"},(0,o.yg)("inlineCode",{parentName:"h3"},".item(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,"(required)")),(0,o.yg)("p",null,"The attributes to update, including the key:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { $add } from 'dynamodb-toolbox/entity/actions/update'\n\nconst transaction = PokemonEntity.build(UpdateTransaction)\n  .item({\n    pokemonId: 'pikachu1',\n    level: $add(1),\n    ...\n  })\n")),(0,o.yg)("p",null,"Check the ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/update-item/"},(0,o.yg)("inlineCode",{parentName:"a"},"UpdateItemCommand"))," action to learn more about the ",(0,o.yg)("inlineCode",{parentName:"p"},"UpdateItem")," syntax. You can use the ",(0,o.yg)("inlineCode",{parentName:"p"},"UpdateItemInput")," type to explicitly type an object as an ",(0,o.yg)("inlineCode",{parentName:"p"},"UpdateTransaction")," item object:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import type { UpdateItemInput } from 'dynamodb-toolbox/entity/actions/update'\n\nconst item: UpdateItemInput<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1',\n  level: $add(1),\n  ...\n}\n\nconst transaction = PokemonEntity.build(\n  UpdateTransaction\n).item(item)\n")),(0,o.yg)("h3",{id:"options"},(0,o.yg)("inlineCode",{parentName:"h3"},".options(...)")),(0,o.yg)("p",null,"Provides additional options:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(UpdateTransaction)\n  .item({\n    pokemonId: 'pikachu1',\n    level: $add(1),\n    ...\n  })\n  .options({\n    // \ud83d\udc47 Make sure that 'level' stays <= 99\n    condition: { attr: 'level', lt: 99 }\n  })\n")),(0,o.yg)("p",null,"You can use the ",(0,o.yg)("inlineCode",{parentName:"p"},"UpdateTransactionOptions")," type to explicitly type an object as a ",(0,o.yg)("inlineCode",{parentName:"p"},"UpdateTransaction")," options object:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import type { UpdateTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactUpdate'\n\nconst options: UpdateTransactionOptions<\n  typeof PokemonEntity\n> = {\n  condition: { attr: 'level', lt: 99 }\n}\n\nconst transaction = PokemonEntity.build(UpdateTransaction)\n  .item(...)\n  .options(options)\n")),(0,o.yg)("p",null,"Available options (see the ",(0,o.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters"},"DynamoDB documentation")," for more details):"),(0,o.yg)("table",null,(0,o.yg)("thead",{parentName:"table"},(0,o.yg)("tr",{parentName:"thead"},(0,o.yg)("th",{parentName:"tr",align:null},"Option"),(0,o.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,o.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,o.yg)("th",{parentName:"tr",align:null},"Description"))),(0,o.yg)("tbody",{parentName:"table"},(0,o.yg)("tr",{parentName:"tbody"},(0,o.yg)("td",{parentName:"tr",align:null},(0,o.yg)("inlineCode",{parentName:"td"},"condition")),(0,o.yg)("td",{parentName:"tr",align:"center"},(0,o.yg)("inlineCode",{parentName:"td"},"Condition<typeof PokemonEntity>")),(0,o.yg)("td",{parentName:"tr",align:"center"},"-"),(0,o.yg)("td",{parentName:"tr",align:null},"A condition that must be satisfied in order for the ",(0,o.yg)("inlineCode",{parentName:"td"},"UpdateTransaction")," to succeed.",(0,o.yg)("br",null),(0,o.yg)("br",null),"See the ",(0,o.yg)("a",{parentName:"td",href:"/docs/entities/actions/parse-condition/#building-conditions"},(0,o.yg)("inlineCode",{parentName:"a"},"ConditionParser"))," action for more details on how to write conditions.")))),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"PokemonEntity.build(UpdateTransaction)\n  .item(...)\n  .options({\n    condition: { attr: 'level', lt: 99 }\n  })\n")),(0,o.yg)("admonition",{type:"info"},(0,o.yg)("p",{parentName:"admonition"},"Contrary to ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/update-item/"},(0,o.yg)("inlineCode",{parentName:"a"},"UpdateItemCommands")),", update transactions cannot return the previous or new values of the written items.")))}m.isMDXComponent=!0}}]);