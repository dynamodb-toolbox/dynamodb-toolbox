"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2290],{15680:(t,e,n)=>{n.d(e,{xA:()=>l,yg:()=>y});var a=n(96540);function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e){if(null==t)return{};var n,a,o=function(t,e){if(null==t)return{};var n,a,o={},i=Object.keys(t);for(a=0;a<i.length;a++)n=i[a],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(a=0;a<i.length;a++)n=i[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var c=a.createContext({}),p=function(t){var e=a.useContext(c),n=e;return t&&(n="function"==typeof t?t(e):r(r({},e),t)),n},l=function(t){var e=p(t.components);return a.createElement(c.Provider,{value:e},t.children)},m="mdxType",u={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},d=a.forwardRef((function(t,e){var n=t.components,o=t.mdxType,i=t.originalType,c=t.parentName,l=s(t,["components","mdxType","originalType","parentName"]),m=p(n),d=o,y=m["".concat(c,".").concat(d)]||m[d]||u[d]||i;return n?a.createElement(y,r(r({ref:e},l),{},{components:n})):a.createElement(y,r({ref:e},l))}));function y(t,e){var n=arguments,o=e&&e.mdxType;if("string"==typeof t||o){var i=n.length,r=new Array(i);r[0]=d;var s={};for(var c in e)hasOwnProperty.call(e,c)&&(s[c]=e[c]);s.originalType=t,s[m]="string"==typeof t?t:o,r[1]=s;for(var p=2;p<i;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},87072:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>c,contentTitle:()=>r,default:()=>u,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var a=n(58168),o=(n(96540),n(15680));const i={title:"TransactPut",sidebar_custom_props:{sidebarActionType:"write"}},r="PutTransaction",s={unversionedId:"entities/actions/transact-put/index",id:"entities/actions/transact-put/index",title:"TransactPut",description:"Builds a transaction to put an entity item, to be used within TransactWriteItems operations:",source:"@site/docs/3-entities/3-actions/11-transact-put/index.md",sourceDirName:"3-entities/3-actions/11-transact-put",slug:"/entities/actions/transact-put/",permalink:"/docs/entities/actions/transact-put/",draft:!1,tags:[],version:"current",frontMatter:{title:"TransactPut",sidebar_custom_props:{sidebarActionType:"write"}},sidebar:"tutorialSidebar",previous:{title:"TransactGet",permalink:"/docs/entities/actions/transact-get/"},next:{title:"TransactUpdate",permalink:"/docs/entities/actions/transact-update/"}},c={},p=[{value:"Request",id:"request",level:2},{value:"<code>.item(...)</code>",id:"item",level:3},{value:"<code>.options(...)</code>",id:"options",level:3}],l={toc:p},m="wrapper";function u(t){let{components:e,...n}=t;return(0,o.yg)(m,(0,a.A)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"puttransaction"},"PutTransaction"),(0,o.yg)("p",null,"Builds a transaction to put an entity item, to be used within ",(0,o.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html"},"TransactWriteItems operations"),":"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'\nimport { PutTransaction } from 'dynamodb-toolbox/entity/actions/transactPut'\n\nconst transaction = PokemonEntity.build(PutTransaction)\n\nconst params = transaction.params()\nawait execute(transaction, ...otherTransactions)\n")),(0,o.yg)("p",null,(0,o.yg)("inlineCode",{parentName:"p"},"PutTransactions")," can be executed in conjunction with ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-update/"},(0,o.yg)("inlineCode",{parentName:"a"},"UpdateTransactions")),", ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transact-delete/"},(0,o.yg)("inlineCode",{parentName:"a"},"DeleteTransactions"))," and ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/condition-check/"},(0,o.yg)("inlineCode",{parentName:"a"},"ConditionChecks")),"."),(0,o.yg)("admonition",{type:"info"},(0,o.yg)("p",{parentName:"admonition"},"Check the ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/transactions/#transactwrite"},"Transaction Documentation")," to learn more about the ",(0,o.yg)("inlineCode",{parentName:"p"},"execute")," function.")),(0,o.yg)("h2",{id:"request"},"Request"),(0,o.yg)("h3",{id:"item"},(0,o.yg)("inlineCode",{parentName:"h3"},".item(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,"(required)")),(0,o.yg)("p",null,"The item to write:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(PutTransaction)\n  .item({\n    pokemonId: 'pikachu1',\n    name: 'Pikachu',\n    pokeType: 'electric',\n    level: 50,\n    ...\n  })\n")),(0,o.yg)("p",null,"You can use the ",(0,o.yg)("inlineCode",{parentName:"p"},"PutItemInput")," type from the ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/put-item/"},(0,o.yg)("inlineCode",{parentName:"a"},"PutItemCommand"))," action to explicitly type an object as a ",(0,o.yg)("inlineCode",{parentName:"p"},"PutTransaction")," item object:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import type { PutItemInput } from 'dynamodb-toolbox/entity/actions/put'\n\nconst item: PutItemInput<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1',\n  name: 'Pikachu',\n  ...\n}\n\nconst transaction =\n  PokemonEntity.build(PutTransaction).item(item)\n")),(0,o.yg)("h3",{id:"options"},(0,o.yg)("inlineCode",{parentName:"h3"},".options(...)")),(0,o.yg)("p",null,"Provides additional options:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"const transaction = PokemonEntity.build(PutTransaction)\n  .item(...)\n  .options({\n    // \ud83d\udc47 Checks that item didn't previously exist\n    condition: { attr: 'pokemonId', exists: false }\n  })\n")),(0,o.yg)("p",null,"You can use the ",(0,o.yg)("inlineCode",{parentName:"p"},"PutTransactionOptions")," type to explicitly type an object as a ",(0,o.yg)("inlineCode",{parentName:"p"},"PutTransaction")," options object:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import type { PutTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactPut'\n\nconst options: PutTransactionOptions<\n  typeof PokemonEntity\n> = {\n  condition: { attr: 'pokemonId', exists: false }\n}\n\nconst transaction = PokemonEntity.build(PutTransaction)\n  .item(...)\n  .options(options)\n")),(0,o.yg)("p",null,"Available options (see the ",(0,o.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters"},"DynamoDB documentation")," for more details):"),(0,o.yg)("table",null,(0,o.yg)("thead",{parentName:"table"},(0,o.yg)("tr",{parentName:"thead"},(0,o.yg)("th",{parentName:"tr",align:null},"Option"),(0,o.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,o.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,o.yg)("th",{parentName:"tr",align:null},"Description"))),(0,o.yg)("tbody",{parentName:"table"},(0,o.yg)("tr",{parentName:"tbody"},(0,o.yg)("td",{parentName:"tr",align:null},(0,o.yg)("inlineCode",{parentName:"td"},"condition")),(0,o.yg)("td",{parentName:"tr",align:"center"},(0,o.yg)("inlineCode",{parentName:"td"},"Condition<typeof PokemonEntity>")),(0,o.yg)("td",{parentName:"tr",align:"center"},"-"),(0,o.yg)("td",{parentName:"tr",align:null},"A condition that must be satisfied in order for the ",(0,o.yg)("inlineCode",{parentName:"td"},"PutTransaction")," to succeed.",(0,o.yg)("br",null),(0,o.yg)("br",null),"See the ",(0,o.yg)("a",{parentName:"td",href:"/docs/entities/actions/parse-condition/#building-conditions"},(0,o.yg)("inlineCode",{parentName:"a"},"ConditionParser"))," action for more details on how to write conditions.")))),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"PokemonEntity.build(PutTransaction)\n  .item(...)\n  .options({\n    condition: { attr: 'pokemonId', exists: false }\n  })\n")),(0,o.yg)("admonition",{type:"info"},(0,o.yg)("p",{parentName:"admonition"},"Contrary to ",(0,o.yg)("a",{parentName:"p",href:"/docs/entities/actions/put-item/"},(0,o.yg)("inlineCode",{parentName:"a"},"PutItemCommands")),", put transactions cannot return the previous values of the written items.")))}u.isMDXComponent=!0}}]);