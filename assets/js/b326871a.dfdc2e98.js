"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7287],{3291:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>u});var a=n(4848),r=n(8453),s=n(1470),i=n(9365);const o={title:"TransactDelete",sidebar_custom_props:{sidebarActionType:"delete"}},c="DeleteTransaction",l={id:"entities/actions/transact-delete/index",title:"TransactDelete",description:"Builds a transaction to delete an entity item, to be used within TransactWriteItems operations:",source:"@site/docs/3-entities/4-actions/14-transact-delete/index.md",sourceDirName:"3-entities/4-actions/14-transact-delete",slug:"/entities/actions/transact-delete/",permalink:"/docs/entities/actions/transact-delete/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"TransactDelete",sidebar_custom_props:{sidebarActionType:"delete"}},sidebar:"tutorialSidebar",previous:{title:"TransactUpdate",permalink:"/docs/entities/actions/transact-update/"},next:{title:"ConditionCheck",permalink:"/docs/entities/actions/condition-check/"}},d={},u=[{value:"Request",id:"request",level:2},{value:"<code>.key(...)</code>",id:"key",level:3},{value:"<code>.options(...)</code>",id:"options",level:3}];function h(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"deletetransaction",children:"DeleteTransaction"})}),"\n",(0,a.jsxs)(t.p,{children:["Builds a transaction to delete an entity item, to be used within ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html",children:"TransactWriteItems operations"}),":"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'\nimport { DeleteTransaction } from 'dynamodb-toolbox/entity/actions/transactDelete'\n\nconst transaction = PokemonEntity.build(DeleteTransaction)\n\nconst params = transaction.params()\nawait execute(transaction, ...otherTransactions)\n"})}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.code,{children:"DeleteTransactions"})," can be executed in conjunction with ",(0,a.jsx)(t.a,{href:"/docs/entities/actions/transact-put/",children:(0,a.jsx)(t.code,{children:"PutTransactions"})}),", ",(0,a.jsx)(t.a,{href:"/docs/entities/actions/transact-update/",children:(0,a.jsx)(t.code,{children:"UpdateTransactions"})})," and ",(0,a.jsx)(t.a,{href:"/docs/entities/actions/condition-check/",children:(0,a.jsx)(t.code,{children:"ConditionChecks"})}),"."]}),"\n",(0,a.jsx)(t.admonition,{type:"info",children:(0,a.jsxs)(t.p,{children:["Check the ",(0,a.jsx)(t.a,{href:"/docs/entities/actions/transactions/#transactwrite",children:"Transaction Documentation"})," to learn more about the ",(0,a.jsx)(t.code,{children:"execute"})," function."]})}),"\n",(0,a.jsx)(t.h2,{id:"request",children:"Request"}),"\n",(0,a.jsx)(t.h3,{id:"key",children:(0,a.jsx)(t.code,{children:".key(...)"})}),"\n",(0,a.jsx)("p",{style:{marginTop:"-15px"},children:(0,a.jsx)("i",{children:"(required)"})}),"\n",(0,a.jsx)(t.p,{children:"The key of the item to delete (i.e. attributes that are tagged as part of the primary key):"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const transaction = PokemonEntity.build(\n  DeleteTransaction\n).key({ pokemonId: 'pikachu1' })\n"})}),"\n",(0,a.jsxs)(t.p,{children:["You can use the ",(0,a.jsx)(t.code,{children:"KeyInputItem"})," generic type to explicitly type an object as a ",(0,a.jsx)(t.code,{children:"BatchDeleteItemRequest"})," key object:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"import type { KeyInputItem } from 'dynamodb-toolbox/entity'\n\nconst key: KeyInputItem<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1'\n}\n\nconst transaction = PokemonEntity.build(\n  DeleteTransaction\n).key(key)\n"})}),"\n",(0,a.jsx)(t.h3,{id:"options",children:(0,a.jsx)(t.code,{children:".options(...)"})}),"\n",(0,a.jsx)(t.p,{children:"Provides additional options:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const transaction = PokemonEntity.build(\n  DeleteTransaction\n)\n  .key(...)\n  .options({\n    condition: { attr: 'archived', eq: true }\n  })\n"})}),"\n",(0,a.jsxs)(t.p,{children:["You can use the ",(0,a.jsx)(t.code,{children:"DeleteTransactionOptions"})," type to explicitly type an object as a ",(0,a.jsx)(t.code,{children:"DeleteTransaction"})," options object:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"import type { DeleteTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactDelete'\n\nconst options: DeleteTransactionOptions<\n  typeof PokemonEntity\n> = {\n  condition: { attr: 'archived', eq: true }\n}\n\nconst transaction = PokemonEntity.build(\n  DeleteTransaction\n)\n  .key(...)\n  .options(options)\n"})}),"\n",(0,a.jsxs)(t.p,{children:["Available options (see the ",(0,a.jsx)(t.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters",children:"DynamoDB documentation"})," for more details):"]}),"\n",(0,a.jsxs)(t.table,{children:[(0,a.jsx)(t.thead,{children:(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.th,{children:"Option"}),(0,a.jsx)(t.th,{style:{textAlign:"center"},children:"Type"}),(0,a.jsx)(t.th,{style:{textAlign:"center"},children:"Default"}),(0,a.jsx)(t.th,{children:"Description"})]})}),(0,a.jsxs)(t.tbody,{children:[(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:(0,a.jsx)(t.code,{children:"condition"})}),(0,a.jsx)(t.td,{style:{textAlign:"center"},children:(0,a.jsx)(t.code,{children:"Condition<typeof PokemonEntity>"})}),(0,a.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,a.jsxs)(t.td,{children:["A condition that must be satisfied in order for the ",(0,a.jsx)(t.code,{children:"DeleteTransaction"})," to succeed.",(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),"See the ",(0,a.jsx)(t.a,{href:"/docs/entities/actions/parse-condition/#building-conditions",children:(0,a.jsx)(t.code,{children:"ConditionParser"})})," action for more details on how to write conditions."]})]}),(0,a.jsxs)(t.tr,{children:[(0,a.jsx)(t.td,{children:(0,a.jsx)(t.code,{children:"tableName"})}),(0,a.jsx)(t.td,{style:{textAlign:"center"},children:(0,a.jsx)(t.code,{children:"string"})}),(0,a.jsx)(t.td,{style:{textAlign:"center"},children:"-"}),(0,a.jsxs)(t.td,{children:["Overrides the ",(0,a.jsx)(t.code,{children:"Table"})," name. Mostly useful for ",(0,a.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Multitenancy",children:"multitenancy"}),"."]})]})]})]}),"\n",(0,a.jsx)(t.admonition,{title:"Examples",type:"note",children:(0,a.jsxs)(s.A,{children:[(0,a.jsx)(i.A,{value:"condition",label:"Conditional write",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const transaction = PokemonEntity.build(DeleteTransaction)\n  .key({ pokemonId: 'pikachu1' })\n  .options({\n    condition: { attr: 'archived', eq: true }\n  })\n"})})}),(0,a.jsx)(i.A,{value:"multitenant",label:"Multitenant",children:(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const transaction = PokemonEntity.build(DeleteTransaction)\n  .key({ pokemonId: 'pikachu1' })\n  .options({\n    tableName: `tenant-${tenantId}-pokemons`\n  })\n"})})})]})}),"\n",(0,a.jsx)(t.admonition,{type:"info",children:(0,a.jsxs)(t.p,{children:["Contrary to ",(0,a.jsx)(t.a,{href:"/docs/entities/actions/delete-item/",children:(0,a.jsx)(t.code,{children:"DeleteItemCommands"})}),", delete transactions cannot return the values of the deleted items."]})})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},9365:(e,t,n)=>{n.d(t,{A:()=>i});n(6540);var a=n(8215);const r={tabItem:"tabItem_Ymn6"};var s=n(4848);function i(e){let{children:t,hidden:n,className:i}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,a.A)(r.tabItem,i),hidden:n,children:t})}},1470:(e,t,n)=>{n.d(t,{A:()=>g});var a=n(6540),r=n(8215),s=n(3104),i=n(6347),o=n(205),c=n(7485),l=n(1682),d=n(679);function u(e){return a.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}(n);return function(e){const t=(0,l.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:n}=e;const r=(0,i.W6)(),s=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,c.aZ)(s),(0,a.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(r.location.search);t.set(s,e),r.replace({...r.location,search:t.toString()})}),[s,r])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,s=h(e),[i,c]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:s}))),[l,u]=m({queryString:n,groupId:r}),[x,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,s]=(0,d.Dv)(n);return[r,(0,a.useCallback)((e=>{n&&s.set(e)}),[n,s])]}({groupId:r}),f=(()=>{const e=l??x;return p({value:e,tabValues:s})?e:null})();(0,o.A)((()=>{f&&c(f)}),[f]);return{selectedValue:i,selectValue:(0,a.useCallback)((e=>{if(!p({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);c(e),u(e),b(e)}),[u,b,s]),tabValues:s}}var b=n(2303);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=n(4848);function y(e){let{className:t,block:n,selectedValue:a,selectValue:i,tabValues:o}=e;const c=[],{blockElementScrollPositionUntilNextRender:l}=(0,s.a_)(),d=e=>{const t=e.currentTarget,n=c.indexOf(t),r=o[n].value;r!==a&&(l(t),i(r))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":n},t),children:o.map((e=>{let{value:t,label:n,attributes:s}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:a===t?0:-1,"aria-selected":a===t,ref:e=>c.push(e),onKeyDown:u,onClick:d,...s,className:(0,r.A)("tabs__item",f.tabItem,s?.className,{"tabs__item--active":a===t}),children:n??t},t)}))})}function v(e){let{lazy:t,children:n,selectedValue:s}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===s));return e?(0,a.cloneElement)(e,{className:(0,r.A)("margin-top--md",e.props.className)}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==s})))})}function k(e){const t=x(e);return(0,j.jsxs)("div",{className:(0,r.A)("tabs-container",f.tabList),children:[(0,j.jsx)(y,{...t,...e}),(0,j.jsx)(v,{...t,...e})]})}function g(e){const t=(0,b.A)();return(0,j.jsx)(k,{...e,children:u(e.children)},String(t))}},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>o});var a=n(6540);const r={},s=a.createContext(r);function i(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),a.createElement(s.Provider,{value:t},e.children)}}}]);