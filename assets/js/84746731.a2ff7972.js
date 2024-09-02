"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[935],{15680:(e,t,n)=>{n.d(t,{xA:()=>m,yg:()=>y});var a=n(96540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},p="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),p=u(n),d=r,y=p["".concat(s,".").concat(d)]||p[d]||c[d]||o;return n?a.createElement(y,i(i({ref:t},m),{},{components:n})):a.createElement(y,i({ref:t},m))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:r,i[1]=l;for(var u=2;u<o;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},19365:(e,t,n)=>{n.d(t,{A:()=>i});var a=n(96540),r=n(20053);const o={tabItem:"tabItem_Ymn6"};function i(e){let{children:t,hidden:n,className:i}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.A)(o.tabItem,i),hidden:n},t)}},11470:(e,t,n)=>{n.d(t,{A:()=>I});var a=n(58168),r=n(96540),o=n(20053),i=n(23104),l=n(72681),s=n(57485),u=n(31682),m=n(89466);function p(e){return function(e){var t;return(null==(t=r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})))?void 0:t.filter(Boolean))??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}function c(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??p(n);return function(e){const t=(0,u.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function d(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function y(e){let{queryString:t=!1,groupId:n}=e;const a=(0,l.W6)(),o=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,s.aZ)(o),(0,r.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(a.location.search);t.set(o,e),a.replace({...a.location,search:t.toString()})}),[o,a])]}function g(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,o=c(e),[i,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!d({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:o}))),[s,u]=y({queryString:n,groupId:a}),[p,g]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,o]=(0,m.Dv)(n);return[a,(0,r.useCallback)((e=>{n&&o.set(e)}),[n,o])]}({groupId:a}),b=(()=>{const e=s??p;return d({value:e,tabValues:o})?e:null})();(0,r.useLayoutEffect)((()=>{b&&l(b)}),[b]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!d({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),g(e)}),[u,g,o]),tabValues:o}}var b=n(92303);const f={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function h(e){let{className:t,block:n,selectedValue:l,selectValue:s,tabValues:u}=e;const m=[],{blockElementScrollPositionUntilNextRender:p}=(0,i.a_)(),c=e=>{const t=e.currentTarget,n=m.indexOf(t),a=u[n].value;a!==l&&(p(t),s(a))},d=e=>{var t;let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=m.indexOf(e.currentTarget)+1;n=m[t]??m[0];break}case"ArrowLeft":{const t=m.indexOf(e.currentTarget)-1;n=m[t]??m[m.length-1];break}}null==(t=n)||t.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":n},t)},u.map((e=>{let{value:t,label:n,attributes:i}=e;return r.createElement("li",(0,a.A)({role:"tab",tabIndex:l===t?0:-1,"aria-selected":l===t,key:t,ref:e=>m.push(e),onKeyDown:d,onClick:c},i,{className:(0,o.A)("tabs__item",f.tabItem,null==i?void 0:i.className,{"tabs__item--active":l===t})}),n??t)})))}function v(e){let{lazy:t,children:n,selectedValue:a}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},o.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function N(e){const t=g(e);return r.createElement("div",{className:(0,o.A)("tabs-container",f.tabList)},r.createElement(h,(0,a.A)({},e,t)),r.createElement(v,(0,a.A)({},e,t)))}function I(e){const t=(0,b.A)();return r.createElement(N,(0,a.A)({key:String(t)},e))}},72011:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>s,default:()=>y,frontMatter:()=>l,metadata:()=>u,toc:()=>p});var a=n(58168),r=(n(96540),n(15680)),o=n(11470),i=n(19365);const l={title:"GetItem",sidebar_custom_props:{sidebarActionType:"read"}},s="GetItemCommand",u={unversionedId:"entities/actions/get-item/index",id:"entities/actions/get-item/index",title:"GetItem",description:"Performs a GetItem Operation on an entity item:",source:"@site/docs/3-entities/3-actions/1-get-item/index.md",sourceDirName:"3-entities/3-actions/1-get-item",slug:"/entities/actions/get-item/",permalink:"/docs/entities/actions/get-item/",draft:!1,tags:[],version:"current",frontMatter:{title:"GetItem",sidebar_custom_props:{sidebarActionType:"read"}},sidebar:"tutorialSidebar",previous:{title:"Internal Attributes",permalink:"/docs/entities/internal-attributes/"},next:{title:"PutItem",permalink:"/docs/entities/actions/put-item/"}},m={},p=[{value:"Request",id:"request",level:2},{value:"<code>.key(...)</code>",id:"key",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Response",id:"response",level:2}],c={toc:p},d="wrapper";function y(e){let{components:t,...n}=e;return(0,r.yg)(d,(0,a.A)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"getitemcommand"},"GetItemCommand"),(0,r.yg)("p",null,"Performs a ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html"},"GetItem Operation")," on an entity item:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'\n\nconst getItemCommand = PokemonEntity.build(GetItemCommand)\n\nconst params = getItemCommand.params()\nawait getItemCommand.send()\n")),(0,r.yg)("h2",{id:"request"},"Request"),(0,r.yg)("h3",{id:"key"},(0,r.yg)("inlineCode",{parentName:"h3"},".key(...)")),(0,r.yg)("p",{style:{marginTop:"-15px"}},(0,r.yg)("i",null,"(required)")),(0,r.yg)("p",null,"The key of the item to get (i.e. attributes that are tagged as part of the primary key):"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .send()\n")),(0,r.yg)("p",null,"You can use the ",(0,r.yg)("inlineCode",{parentName:"p"},"KeyInput")," type from the ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/parse/"},(0,r.yg)("inlineCode",{parentName:"a"},"EntityParser"))," action to explicitly type an object as a ",(0,r.yg)("inlineCode",{parentName:"p"},"GetItemCommand")," key object:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import type { KeyInput } from 'dynamodb-toolbox/entity/actions/parse'\n\nconst key: KeyInput<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1'\n}\n\nconst { Item } = await PokemonEntity.build(GetItemCommand)\n  .key(key)\n  .send()\n")),(0,r.yg)("h3",{id:"options"},(0,r.yg)("inlineCode",{parentName:"h3"},".options(...)")),(0,r.yg)("p",null,"Provides additional options:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key(...)\n  .options({\n    consistent: true,\n    attributes: ['type', 'level'],\n    ...\n  })\n  .send()\n")),(0,r.yg)("p",null,"You can use the ",(0,r.yg)("inlineCode",{parentName:"p"},"GetItemOptions")," type to explicitly type an object as a ",(0,r.yg)("inlineCode",{parentName:"p"},"GetItemCommand")," options object:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import type { GetItemOptions } from 'dynamodb-toolbox/entity/actions/get'\n\nconst options: PutItemOptions<typeof PokemonEntity> = {\n  consistent: true,\n  attributes: ['type', 'level'],\n  ...\n}\n\nawait PokemonEntity.build(GetItemCommand)\n  .key(...)\n  .options(options)\n  .send()\n")),(0,r.yg)("p",null,"Available options (see the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_RequestParameters"},"DynamoDB documentation")," for more details):"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Option"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"consistent")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"boolean")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"false")),(0,r.yg)("td",{parentName:"tr",align:null},"By default, read operations are ",(0,r.yg)("b",null,"eventually")," consistent (which improves performances and reduces costs).",(0,r.yg)("br",null),(0,r.yg)("br",null),"Set to ",(0,r.yg)("inlineCode",{parentName:"td"},"true")," to use ",(0,r.yg)("b",null,"strongly")," consistent reads.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"attributes")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"Path<Entity>[]")),(0,r.yg)("td",{parentName:"tr",align:"center"},"-"),(0,r.yg)("td",{parentName:"tr",align:null},"To specify a list of attributes to retrieve (improves performances but does not reduce costs).",(0,r.yg)("br",null),(0,r.yg)("br",null),"See the ",(0,r.yg)("a",{parentName:"td",href:"/docs/entities/actions/parse-paths/#paths"},(0,r.yg)("inlineCode",{parentName:"a"},"PathParser"))," action for more details on how to write attribute paths.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"capacity")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},"CapacityOption")),(0,r.yg)("td",{parentName:"tr",align:"center"},(0,r.yg)("inlineCode",{parentName:"td"},'"NONE"')),(0,r.yg)("td",{parentName:"tr",align:null},"Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.",(0,r.yg)("br",null),(0,r.yg)("br",null),"Possible values are ",(0,r.yg)("inlineCode",{parentName:"td"},'"NONE"'),", ",(0,r.yg)("inlineCode",{parentName:"td"},'"TOTAL"')," and ",(0,r.yg)("inlineCode",{parentName:"td"},'"INDEXES"'),".")))),(0,r.yg)("admonition",{title:"Examples",type:"note"},(0,r.yg)(o.A,{mdxType:"Tabs"},(0,r.yg)(i.A,{value:"consistent",label:"Consistent read",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .options({ consistent: true })\n  .send()\n"))),(0,r.yg)(i.A,{value:"filtered",label:"Filtered",mdxType:"TabItem"},(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu1' })\n  .options({ attributes: ['type', 'level'] })\n  .send()\n"))))),(0,r.yg)("h2",{id:"response"},"Response"),(0,r.yg)("p",null,"The data is returned with the same response syntax as from the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_ResponseElements"},"DynamoDB GetItem API"),". If present, the returned item is formatted by the Entity."),(0,r.yg)("p",null,"You can use the ",(0,r.yg)("inlineCode",{parentName:"p"},"GetItemResponse")," type to explicitly type an object as a ",(0,r.yg)("inlineCode",{parentName:"p"},"GetItemCommand")," response object:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import type { GetItemResponse } from 'dynamodb-toolbox/entity/actions/get'\n\nconst getItemResponse: GetItemResponse<\n  typeof PokemonEntity,\n  // \ud83d\udc47 Optional options\n  { attributes: ['type', 'level'] }\n  // \ud83d\udc47 Typed as Pokemon\xa0| undefined\n> = { Item: ... }\n")))}y.isMDXComponent=!0}}]);