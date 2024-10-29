"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2852],{15680:(e,n,t)=>{t.d(n,{xA:()=>p,yg:()=>c});var a=t(96540);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,i=function(e,n){if(null==e)return{};var t,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=a.createContext({}),d=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},p=function(e){var n=d(e.components);return a.createElement(s.Provider,{value:n},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},y=a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=d(t),y=i,c=m["".concat(s,".").concat(y)]||m[y]||u[y]||o;return t?a.createElement(c,r(r({ref:n},p),{},{components:t})):a.createElement(c,r({ref:n},p))}));function c(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,r=new Array(o);r[0]=y;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l[m]="string"==typeof e?e:i,r[1]=l;for(var d=2;d<o;d++)r[d]=t[d];return a.createElement.apply(null,r)}return a.createElement.apply(null,t)}y.displayName="MDXCreateElement"},19365:(e,n,t)=>{t.d(n,{A:()=>r});var a=t(96540),i=t(20053);const o={tabItem:"tabItem_Ymn6"};function r(e){let{children:n,hidden:t,className:r}=e;return a.createElement("div",{role:"tabpanel",className:(0,i.A)(o.tabItem,r),hidden:t},n)}},11470:(e,n,t)=>{t.d(n,{A:()=>I});var a=t(58168),i=t(96540),o=t(20053),r=t(23104),l=t(56347),s=t(57485),d=t(31682),p=t(89466);function m(e){return function(e){return i.Children.map(e,(e=>{if(!e||(0,i.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:n,label:t,attributes:a,default:i}}=e;return{value:n,label:t,attributes:a,default:i}}))}function u(e){const{values:n,children:t}=e;return(0,i.useMemo)((()=>{const e=n??m(t);return function(e){const n=(0,d.X)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function y(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function c(e){let{queryString:n=!1,groupId:t}=e;const a=(0,l.W6)(),o=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,s.aZ)(o),(0,i.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(a.location.search);n.set(o,e),a.replace({...a.location,search:n.toString()})}),[o,a])]}function g(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,o=u(e),[r,l]=(0,i.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!y({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const a=t.find((e=>e.default))??t[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:o}))),[s,d]=c({queryString:t,groupId:a}),[m,g]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,o]=(0,p.Dv)(t);return[a,(0,i.useCallback)((e=>{t&&o.set(e)}),[t,o])]}({groupId:a}),b=(()=>{const e=s??m;return y({value:e,tabValues:o})?e:null})();(0,i.useLayoutEffect)((()=>{b&&l(b)}),[b]);return{selectedValue:r,selectValue:(0,i.useCallback)((e=>{if(!y({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),d(e),g(e)}),[d,g,o]),tabValues:o}}var b=t(92303);const N={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function f(e){let{className:n,block:t,selectedValue:l,selectValue:s,tabValues:d}=e;const p=[],{blockElementScrollPositionUntilNextRender:m}=(0,r.a_)(),u=e=>{const n=e.currentTarget,t=p.indexOf(n),a=d[t].value;a!==l&&(m(n),s(a))},y=e=>{let n=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const t=p.indexOf(e.currentTarget)+1;n=p[t]??p[0];break}case"ArrowLeft":{const t=p.indexOf(e.currentTarget)-1;n=p[t]??p[p.length-1];break}}n?.focus()};return i.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":t},n)},d.map((e=>{let{value:n,label:t,attributes:r}=e;return i.createElement("li",(0,a.A)({role:"tab",tabIndex:l===n?0:-1,"aria-selected":l===n,key:n,ref:e=>p.push(e),onKeyDown:y,onClick:u},r,{className:(0,o.A)("tabs__item",N.tabItem,r?.className,{"tabs__item--active":l===n})}),t??n)})))}function h(e){let{lazy:n,children:t,selectedValue:a}=e;const o=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=o.find((e=>e.props.value===a));return e?(0,i.cloneElement)(e,{className:"margin-top--md"}):null}return i.createElement("div",{className:"margin-top--md"},o.map(((e,n)=>(0,i.cloneElement)(e,{key:n,hidden:e.props.value!==a}))))}function v(e){const n=g(e);return i.createElement("div",{className:(0,o.A)("tabs-container",N.tabList)},i.createElement(f,(0,a.A)({},e,n)),i.createElement(h,(0,a.A)({},e,n)))}function I(e){const n=(0,b.A)();return i.createElement(v,(0,a.A)({key:String(n)},e))}},26285:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>s,default:()=>c,frontMatter:()=>l,metadata:()=>d,toc:()=>m});var a=t(58168),i=(t(96540),t(15680)),o=t(11470),r=t(19365);const l={title:"UpdateItem",sidebar_custom_props:{sidebarActionType:"write"}},s="UpdateItemCommand",d={unversionedId:"entities/actions/update-item/index",id:"entities/actions/update-item/index",title:"UpdateItem",description:"Performs a UpdateItem Operation on an entity item:",source:"@site/docs/3-entities/4-actions/3-update-item/index.md",sourceDirName:"3-entities/4-actions/3-update-item",slug:"/entities/actions/update-item/",permalink:"/docs/entities/actions/update-item/",draft:!1,tags:[],version:"current",frontMatter:{title:"UpdateItem",sidebar_custom_props:{sidebarActionType:"write"}},sidebar:"tutorialSidebar",previous:{title:"PutItem",permalink:"/docs/entities/actions/put-item/"},next:{title:"UpdateAttributes",permalink:"/docs/entities/actions/update-attributes/"}},p={},m=[{value:"Request",id:"request",level:2},{value:"<code>.item(...)</code>",id:"item",level:3},{value:"Removing an attribute",id:"removing-an-attribute",level:3},{value:"References",id:"references",level:3},{value:"Flat attributes",id:"flat-attributes",level:3},{value:"Deep attributes",id:"deep-attributes",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Response",id:"response",level:2},{value:"Extended Syntax",id:"extended-syntax",level:2}],u={toc:m},y="wrapper";function c(e){let{components:n,...t}=e;return(0,i.yg)(y,(0,a.A)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,i.yg)("h1",{id:"updateitemcommand"},"UpdateItemCommand"),(0,i.yg)("p",null,"Performs a ",(0,i.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html"},"UpdateItem Operation")," on an entity item:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import { UpdateItemCommand } from 'dynamodb-toolbox/entity/actions/update'\n\nconst updateItemCommand = PokemonEntity.build(\n  UpdateItemCommand\n)\n\nconst params = updateItemCommand.params()\nawait updateItemCommand.send()\n")),(0,i.yg)("h2",{id:"request"},"Request"),(0,i.yg)("h3",{id:"item"},(0,i.yg)("inlineCode",{parentName:"h3"},".item(...)")),(0,i.yg)("p",{style:{marginTop:"-15px"}},(0,i.yg)("i",null,"(required)")),(0,i.yg)("p",null,"The attributes to update, including the key:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import { UpdateItemCommand, $add } from 'dynamodb-toolbox/entity/actions/update'\n\nawait PokemonEntity.build(UpdateItemCommand)\n  .item({\n    pokemonId: 'pikachu1',\n    level: $add(1),\n    ...\n  })\n  .send()\n")),(0,i.yg)("p",null,"You can use the ",(0,i.yg)("inlineCode",{parentName:"p"},"UpdateItemInput")," type to explicitly type an object as a ",(0,i.yg)("inlineCode",{parentName:"p"},"UpdateItemCommand")," item object:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import type { UpdateItemInput } from 'dynamodb-toolbox/entity/actions/update'\n\nconst item: UpdateItemInput<typeof PokemonEntity> = {\n  pokemonId: 'pikachu1',\n  level: $add(1),\n  ...\n}\n\nawait PokemonEntity.build(UpdateItemCommand).item(item).send()\n")),(0,i.yg)("p",null,(0,i.yg)("inlineCode",{parentName:"p"},"UpdateItemInput")," differs from ",(0,i.yg)("a",{parentName:"p",href:"/docs/entities/actions/put-item/#item"},(0,i.yg)("inlineCode",{parentName:"a"},"PutItemInput"))," as it is ",(0,i.yg)("strong",{parentName:"p"},"partial by default"),", except for ",(0,i.yg)("inlineCode",{parentName:"p"},"always")," required attributes without defaults or links."),(0,i.yg)("p",null,"It also benefits from an ",(0,i.yg)("strong",{parentName:"p"},"extended syntax")," that reflects the ",(0,i.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html"},"capabilities of DynamoDB"),":"),(0,i.yg)("h3",{id:"removing-an-attribute"},"Removing an attribute"),(0,i.yg)("p",null,"Any optional attribute can be removed with the ",(0,i.yg)("inlineCode",{parentName:"p"},"$remove")," extension:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import { $remove } from 'dynamodb-toolbox/entity/actions/update'\n\nawait PokemonEntity.build(UpdateItemCommand)\n  .item({\n    pokemonId: 'pikachu1',\n    // \ud83d\udc47 clear 'statusEffect' from pokemon\n    statusEffect: $remove()\n  })\n  .send()\n")),(0,i.yg)("h3",{id:"references"},"References"),(0,i.yg)("p",null,"You can indicate DynamoDB to resolve an attribute ",(0,i.yg)("strong",{parentName:"p"},"at write time")," with the ",(0,i.yg)("inlineCode",{parentName:"p"},"$get")," extension:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import { $get } from 'dynamodb-toolbox/entity/actions/update'\n\nawait PokemonEntity.build(UpdateItemCommand)\n  .item({\n    ...\n    level: 42,\n    // \ud83d\udc47 fill 'previousLevel' with current 'level'\n    previousLevel: $get('level')\n  })\n  .send()\n")),(0,i.yg)("p",null,"Self-references are possible. You can also ",(0,i.yg)("strong",{parentName:"p"},"provide a fallback")," as a second argument (which can also be a reference) in case the specified attribute path misses from the item:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"await PokemonEntity.build(UpdateItemCommand)\n  .item({\n    ...\n    previousLevel: $get('level', 1),\n    // \ud83d\udc47 fallback can also be a reference!\n    chainedRefs: $get(\n      'firstRef',\n      $get('secondRef', 'Sky is the limit!')\n    )\n  })\n  .send()\n")),(0,i.yg)("p",null,"Note that the attribute path is type-checked, but whether its attribute value extends the updated attribute value is ",(0,i.yg)("strong",{parentName:"p"},"not")," for the moment, so be extra-careful:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"await PokemonEntity.build(UpdateItemCommand)\n  .item({\n    // \u274c Raises a type error\n    name: $get('non.existing[0].attribute'),\n    // ...but overriding a number by a string doesn't \ud83d\ude48\n    level: $get('name')\n  })\n  .send()\n")),(0,i.yg)("h3",{id:"flat-attributes"},"Flat attributes"),(0,i.yg)("p",null,"In the case of flat attributes (primitives and ",(0,i.yg)("inlineCode",{parentName:"p"},"sets"),"), updates completely override their current values:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"await PokemonEntity.build(UpdateItemCommand)\n  .item({\n    ...\n    // \ud83d\udc47 Set fields to desired values\n    isLegendary: true,\n    nextLevel: 42,\n    name: 'Pikachu',\n    binEncoded: new Uint8Array(...),\n    skills: new Set(['thunder'])\n  })\n  .send()\n")),(0,i.yg)("p",null,"Numbers benefit from additional ",(0,i.yg)("inlineCode",{parentName:"p"},"$sum"),", ",(0,i.yg)("inlineCode",{parentName:"p"},"$subtract")," and ",(0,i.yg)("inlineCode",{parentName:"p"},"$add")," extensions, which can use references:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $add,\n  $subtract,\n  $get\n} from 'dynamodb-toolbox/entity/actions/update'\n\nawait PokemonEntity.build(UpdateItemCommand)\n  .item({\n    ...\n    // \ud83d\udc47 lose 20 health points\n    health: $subtract($get('health'), 20),\n    // \ud83d\udc47 gain 1 level\n    level: $sum($get('level', 0), 1),\n    // ...similar to\n    level: $add(1)\n  })\n  .send()\n")),(0,i.yg)("p",null,"Sets benefit from additional ",(0,i.yg)("inlineCode",{parentName:"p"},"$add")," and ",(0,i.yg)("inlineCode",{parentName:"p"},"$delete")," extensions, which can be used to add or remove specific values:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $add,\n  $delete\n} from 'dynamodb-toolbox/entity/actions/update'\n\nawait PokemonEntity.build(UpdateItemCommand)\n  .item({\n    ...,\n    skills: $add(new Set(['thunder', 'dragon-tail'])),\n    types: $delete(new Set(['flight']))\n  })\n  .send()\n")),(0,i.yg)("h3",{id:"deep-attributes"},"Deep attributes"),(0,i.yg)("p",null,"In the case of deep attributes (e.g. ",(0,i.yg)("inlineCode",{parentName:"p"},"lists"),", ",(0,i.yg)("inlineCode",{parentName:"p"},"maps")," and ",(0,i.yg)("inlineCode",{parentName:"p"},"records"),"), updates are ",(0,i.yg)("strong",{parentName:"p"},"partial by default"),":"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// \ud83d\udc47 Partial overrides\nawait PokemonEntity.build(UpdateItemCommand)\n  .item({\n    ...\n    // \ud83d\udc47 Elements 0 and 2 are updated\n    skills: ['thunder', undefined, $remove()],\n    // ...similar to\n    skills: {\n      0: 'thunder',\n      2: $remove()\n    },\n    // \ud83d\udc47 Map\n    some: {\n      deep: {\n        field: 'foo'\n      }\n    },\n    // \ud83d\udc47 Record\n    bestSkillByType: {\n      electric: 'thunder',\n      flight: $remove()\n    }\n  })\n  .send()\n")),(0,i.yg)("p",null,"You can use the ",(0,i.yg)("inlineCode",{parentName:"p"},"$set")," extension to specify a complete override:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import { $set } from 'dynamodb-toolbox/entity/actions/update'\n\n// \ud83d\udc47 Complete overrides\nawait PokemonEntity.build(UpdateItemCommand).item({\n ...\n // Resets list\n skills: $set(['thunder']),\n // Removes all other map attributes\n some: $set({\n   deep: {\n     field: 'foo',\n     otherField: 42\n   }\n }),\n // Removes all other record keys\n bestSkillByType: $set({\n   electric: 'thunder'\n })\n})\n")),(0,i.yg)("p",null,"Lists benefit from additional ",(0,i.yg)("inlineCode",{parentName:"p"},"$append")," and ",(0,i.yg)("inlineCode",{parentName:"p"},"$prepend")," extensions, which can use references:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $append,\n  $prepend\n} from 'dynamodb-toolbox/entity/actions/update'\n\nPokemonEntity.build(UpdateItemCommand).item({\n  ...\n  skills: $append(['thunder', 'dragon-tail']),\n  levelHistory: $append($get('level')),\n  types: $prepend(['flight']),\n})\n")),(0,i.yg)("admonition",{type:"info"},(0,i.yg)("p",{parentName:"admonition"},(0,i.yg)("inlineCode",{parentName:"p"},"$append")," and ",(0,i.yg)("inlineCode",{parentName:"p"},"$prepend")," are ",(0,i.yg)("strong",{parentName:"p"},"upserts"),": they create a new list if the attribute is missing from the item.")),(0,i.yg)("h3",{id:"options"},(0,i.yg)("inlineCode",{parentName:"h3"},".options(...)")),(0,i.yg)("p",null,"Provides additional options:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"await PokemonEntity.build(UpdateItemCommand)\n  .item(...)\n  .options({\n    returnValues: 'UPDATED_OLD',\n    capacity: 'TOTAL',\n    ...\n  })\n  .send()\n")),(0,i.yg)("p",null,"You can use the ",(0,i.yg)("inlineCode",{parentName:"p"},"UpdateItemOptions")," type to explicitly type an object as an ",(0,i.yg)("inlineCode",{parentName:"p"},"UpdateItemCommand")," options object:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import type { UpdateItemOptions } from 'dynamodb-toolbox/entity/actions/update'\n\nconst options: UpdateItemOptions<typeof PokemonEntity> = {\n  returnValues: 'UPDATED_OLD',\n  capacity: 'TOTAL',\n  ...\n}\n\nawait PokemonEntity.build(UpdateItemCommand)\n  .item(...)\n  .options(options)\n  .send()\n")),(0,i.yg)("p",null,"Available options (see the ",(0,i.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_RequestParameters"},"DynamoDB documentation")," for more details):"),(0,i.yg)("table",null,(0,i.yg)("thead",{parentName:"table"},(0,i.yg)("tr",{parentName:"thead"},(0,i.yg)("th",{parentName:"tr",align:null},"Option"),(0,i.yg)("th",{parentName:"tr",align:"center"},"Type"),(0,i.yg)("th",{parentName:"tr",align:"center"},"Default"),(0,i.yg)("th",{parentName:"tr",align:null},"Description"))),(0,i.yg)("tbody",{parentName:"table"},(0,i.yg)("tr",{parentName:"tbody"},(0,i.yg)("td",{parentName:"tr",align:null},(0,i.yg)("inlineCode",{parentName:"td"},"condition")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},"Condition<typeof PokemonEntity>")),(0,i.yg)("td",{parentName:"tr",align:"center"},"-"),(0,i.yg)("td",{parentName:"tr",align:null},"A condition that must be satisfied in order for the ",(0,i.yg)("inlineCode",{parentName:"td"},"UpdateItemCommand")," to succeed.",(0,i.yg)("br",null),(0,i.yg)("br",null),"See the ",(0,i.yg)("a",{parentName:"td",href:"/docs/entities/actions/parse-condition/#building-conditions"},(0,i.yg)("inlineCode",{parentName:"a"},"ConditionParser"))," action for more details on how to write conditions.")),(0,i.yg)("tr",{parentName:"tbody"},(0,i.yg)("td",{parentName:"tr",align:null},(0,i.yg)("inlineCode",{parentName:"td"},"returnValues")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},"ReturnValuesOption")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},'"NONE"')),(0,i.yg)("td",{parentName:"tr",align:null},"To get the item attributes as they appeared before they were updated with the request.",(0,i.yg)("br",null),(0,i.yg)("br",null),"Possible values are ",(0,i.yg)("inlineCode",{parentName:"td"},'"NONE"'),", ",(0,i.yg)("inlineCode",{parentName:"td"},'"UPDATED_NEW"'),", ",(0,i.yg)("inlineCode",{parentName:"td"},'"ALL_NEW"'),", ",(0,i.yg)("inlineCode",{parentName:"td"},'"UPDATED_OLD"')," and ",(0,i.yg)("inlineCode",{parentName:"td"},'"ALL_OLD"'),".")),(0,i.yg)("tr",{parentName:"tbody"},(0,i.yg)("td",{parentName:"tr",align:null},(0,i.yg)("inlineCode",{parentName:"td"},"metrics")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},"MetricsOption")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},'"NONE"')),(0,i.yg)("td",{parentName:"tr",align:null},"Determines whether item collection metrics are returned.",(0,i.yg)("br",null),(0,i.yg)("br",null),"Possible values are ",(0,i.yg)("inlineCode",{parentName:"td"},'"NONE"')," and ",(0,i.yg)("inlineCode",{parentName:"td"},'"SIZE"'),".")),(0,i.yg)("tr",{parentName:"tbody"},(0,i.yg)("td",{parentName:"tr",align:null},(0,i.yg)("inlineCode",{parentName:"td"},"capacity")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},"CapacityOption")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},'"NONE"')),(0,i.yg)("td",{parentName:"tr",align:null},"Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.",(0,i.yg)("br",null),(0,i.yg)("br",null),"Possible values are ",(0,i.yg)("inlineCode",{parentName:"td"},'"NONE"'),", ",(0,i.yg)("inlineCode",{parentName:"td"},'"TOTAL"')," and ",(0,i.yg)("inlineCode",{parentName:"td"},'"INDEXES"'),".")),(0,i.yg)("tr",{parentName:"tbody"},(0,i.yg)("td",{parentName:"tr",align:null},(0,i.yg)("inlineCode",{parentName:"td"},"tableName")),(0,i.yg)("td",{parentName:"tr",align:"center"},(0,i.yg)("inlineCode",{parentName:"td"},"string")),(0,i.yg)("td",{parentName:"tr",align:"center"},"-"),(0,i.yg)("td",{parentName:"tr",align:null},"Overrides the ",(0,i.yg)("inlineCode",{parentName:"td"},"Table")," name. Mostly useful for ",(0,i.yg)("a",{parentName:"td",href:"https://en.wikipedia.org/wiki/Multitenancy"},"multitenancy"),".")))),(0,i.yg)("admonition",{title:"Examples",type:"note"},(0,i.yg)(o.A,{mdxType:"Tabs"},(0,i.yg)(r.A,{value:"conditional",label:"Conditional write",mdxType:"TabItem"},(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"await PokemonEntity.build(UpdateItemCommand)\n  .item({\n    pokemonId: 'pikachu1',\n    level: $add(1)\n  })\n  .options({\n    // \ud83d\udc47 Make sure that 'level' stays <= 99\n    condition: { attr: 'level', lt: 99 }\n  })\n  .send()\n"))),(0,i.yg)(r.A,{value:"return-values",label:"Return values",mdxType:"TabItem"},(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"const { Attributes: prevPikachu } =\n  await PokemonEntity.build(UpdateItemCommand)\n    .item({\n      pokemonId: 'pikachu1',\n      level: $add(1)\n    })\n    .options({\n      returnValues: 'ALL_OLD'\n    })\n    .send()\n"))),(0,i.yg)(r.A,{value:"multitenant",label:"Multitenant",mdxType:"TabItem"},(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"await PokemonEntity.build(UpdateItemCommand)\n  .item({\n    pokemonId: 'pikachu1',\n    level: $add(1)\n  })\n  .options({\n    tableName: `tenant-${tenantId}-pokemons`\n  })\n  .send()\n"))))),(0,i.yg)("h2",{id:"response"},"Response"),(0,i.yg)("p",null,"The data is returned using the same response syntax as the ",(0,i.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_ResponseElements"},"DynamoDB UpdateItem API"),", with an additional ",(0,i.yg)("inlineCode",{parentName:"p"},"ToolboxItem")," property, which allows you to retrieve the item generated by DynamoDB-Toolbox:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"const { ToolboxItem: generatedPokemon } =\n  await PokemonEntity.build(UpdateItemCommand)\n    .item(...)\n    .send()\n\n// \ud83d\udc47 Great for auto-generated attributes\nconst modifiedTimestamp = generatedPokemon.modified\n")),(0,i.yg)("p",null,"If present, the returned attributes are formatted by the Entity."),(0,i.yg)("p",null,"You can use the ",(0,i.yg)("inlineCode",{parentName:"p"},"UpdateItemResponse")," type to explicitly type an object as an ",(0,i.yg)("inlineCode",{parentName:"p"},"UpdateItemCommand")," response object:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import type { UpdateItemResponse } from 'dynamodb-toolbox/entity/actions/update'\n\nconst response: UpdateItemResponse<\n  typeof PokemonEntity,\n  // \ud83d\udc47 Optional options\n  { returnValues: 'ALL_OLD' }\n  // \ud83d\udc47 Typed as Pokemon\xa0| undefined\n> = { Attributes: ... }\n")),(0,i.yg)("h2",{id:"extended-syntax"},"Extended Syntax"),(0,i.yg)("p",null,"In some contexts, like when defining ",(0,i.yg)("a",{parentName:"p",href:"/docs/schemas/defaults-and-links/"},(0,i.yg)("inlineCode",{parentName:"a"},"updateLinks")),", it may be useful to understand extended syntax in greater details."),(0,i.yg)("p",null,"To avoid conflicts with regular syntax, extensions are defined through ",(0,i.yg)("strong",{parentName:"p"},"objects")," with ",(0,i.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"},"symbols")," as keys:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $add,\n  // \ud83d\udc47 Unique symbols\n  $ADD,\n  $IS_EXTENSION\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst addOne = $add(1)\n\n// \ud83d\udc47 Equivalent to\nconst addOne = {\n  [$ADD]: 1,\n  [$IS_EXTENSION]: true\n}\n")),(0,i.yg)("p",null,"If you need to build complex update links, ",(0,i.yg)("strong",{parentName:"p"},"all those symbols are exported"),", as well as ",(0,i.yg)("strong",{parentName:"p"},"dedicated type guards"),". If you don't, you can ",(0,i.yg)("strong",{parentName:"p"},"exclude extended syntax")," altogether with the ",(0,i.yg)("inlineCode",{parentName:"p"},"isExtension")," type guard."),(0,i.yg)("p",null,"Here's an example in which we automatically derive pokemon level upgrades:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $add,\n  $get,\n  $subtract,\n  isAddition,\n  isExtension,\n  isGetting,\n  $ADD\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst pokemonSchema = schema({\n  ...\n  level: number()\n}).and(prevSchema => ({\n  lastLevelUpgrade: number().updateLink<typeof prevSchema>(\n    ({ level }) => {\n      if (level === undefined) {\n        return undefined\n      }\n\n      if (isAddition(level)) {\n        return level[$ADD]\n      }\n\n      if (!isExtension(level) || isGetting(level)) {\n        return $subtract(level, $get('level'))\n      }\n    }\n  )\n}))\n\nawait PokemonEntity.build(UpdateItemCommand)\n  .item({\n    pokemonId,\n    // \ud83d\udc47 lastLevelUpgrade = 3\n    level: $add(3)\n    // \ud83d\udc47 lastLevelUpgrade = $subtract(10, $get('level'))\n    level: 10,\n    // \ud83d\udc47 lastLevelUpgrade = $subtract($get('otherAttr'), $get('level'))\n    level: $get('otherAttr'),\n  })\n  .send()\n")),(0,i.yg)("admonition",{title:"Example",type:"note"},(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$remove")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $remove,\n  $REMOVE,\n  $IS_EXTENSION,\n  isRemoval\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst removal = $remove()\n\n// \ud83d\udc47 Equivalent to\nconst removal = {\n  [$REMOVE]: true,\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isRemoval(input)) {\n    input[$REMOVE] // => true\n  }\n}\n"))),(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$get")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $get,\n  $GET,\n  $IS_EXTENSION,\n  isGetting\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst getting = $get('attr', 'fallback')\n\n// \ud83d\udc47 Equivalent to\nconst getting = {\n  [$GET]: ['attr', 'fallback'],\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isGetting(input)) {\n    input[$GET] // => ['attr', 'fallback']\n  }\n}\n"))),(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$sum")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $sum,\n  $SUM,\n  $IS_EXTENSION,\n  isSum\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst sum = $sum(1, 2)\n\n// \ud83d\udc47 Equivalent to\nconst sum = {\n  [$SUM]: [1, 2],\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isSum(input)) {\n    input[$SUM] // => [1, 2]\n  }\n}\n"))),(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$subtract")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $subtract,\n  $SUBTRACT,\n  $IS_EXTENSION,\n  isSubtraction\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst subtraction = $subtract(1, 2)\n\n// \ud83d\udc47 Equivalent to\nconst subtraction = {\n  [$SUBTRACT]: [1, 2],\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isSubtraction(input)) {\n    input[$SUBTRACT] // => [1, 2]\n  }\n}\n"))),(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$add")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $add,\n  $ADD,\n  $IS_EXTENSION,\n  isAddition\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst addition = $add(1)\n\n// \ud83d\udc47 Equivalent to\nconst addition = {\n  [$ADD]: 1,\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isAddition(input)) {\n    input[$ADD] // => 1\n  }\n}\n"))),(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$delete")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $delete,\n  $DELETE,\n  $IS_EXTENSION,\n  isDeletion\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst deletion = $delete(new Set(['flight']))\n\n// \ud83d\udc47 Equivalent to\nconst deletion = {\n  [$DELETE]: new Set(['flight']),\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isDeletion(input)) {\n    input[$DELETE] // => new Set(['flight'])\n  }\n}\n"))),(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$set")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $set,\n  $SET,\n  $IS_EXTENSION,\n  isSetting\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst setting = $set({\n  deep: {\n    field: 'foo',\n    otherField: 42\n  }\n})\n\n// \ud83d\udc47 Equivalent to\nconst setting = {\n  [$SET]: {\n    deep: {\n      field: 'foo',\n      otherField: 42\n    }\n  },\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isSetting(input)) {\n    input[$SET] // => {\n    //   deep: {\n    //     field: 'foo',\n    //     otherField: 42\n    //   }\n    // }\n  }\n}\n"))),(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$append")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $append,\n  $APPEND,\n  $IS_EXTENSION,\n  isAppending\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst appending = $append(['thunder', 'dragon-tail'])\n\n// \ud83d\udc47 Equivalent to\nconst appending = {\n  [$APPEND]: ['thunder', 'dragon-tail'],\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isAppending(input)) {\n    input[$APPEND] // => ['thunder', 'dragon-tail']\n  }\n}\n"))),(0,i.yg)("details",{className:"details-in-admonition"},(0,i.yg)("summary",null,"\ud83d\udd0e ",(0,i.yg)("b",null,"$prepend")),(0,i.yg)("pre",{parentName:"admonition"},(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {\n  $prepend,\n  $PREPEND,\n  $IS_EXTENSION,\n  isPrepending\n} from 'dynamodb-toolbox/entity/actions/update/symbols'\n\nconst prepending = $prepend(['thunder', 'dragon-tail'])\n\n// \ud83d\udc47 Equivalent to\nconst prepending = {\n  [$PREPEND]: ['thunder', 'dragon-tail'],\n  [$IS_EXTENSION]: true\n}\n\nconst link = (input: UpdateItemInput) => {\n  if (isPrepending(input)) {\n    input[$PREPEND] // => ['thunder', 'dragon-tail']\n  }\n}\n")))))}c.isMDXComponent=!0}}]);