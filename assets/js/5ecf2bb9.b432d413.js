"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5225],{15680:(e,t,n)=>{n.d(t,{xA:()=>m,yg:()=>y});var a=n(96540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),p=u(n),c=r,y=p["".concat(s,".").concat(c)]||p[c]||d[c]||i;return n?a.createElement(y,o(o({ref:t},m),{},{components:n})):a.createElement(y,o({ref:t},m))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:r,o[1]=l;for(var u=2;u<i;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},19365:(e,t,n)=>{n.d(t,{A:()=>o});var a=n(96540),r=n(20053);const i={tabItem:"tabItem_Ymn6"};function o(e){let{children:t,hidden:n,className:o}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.A)(i.tabItem,o),hidden:n},t)}},11470:(e,t,n)=>{n.d(t,{A:()=>w});var a=n(58168),r=n(96540),i=n(20053),o=n(23104),l=n(72681),s=n(57485),u=n(31682),m=n(89466);function p(e){return function(e){var t;return(null==(t=r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})))?void 0:t.filter(Boolean))??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}function d(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??p(n);return function(e){const t=(0,u.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function c(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function y(e){let{queryString:t=!1,groupId:n}=e;const a=(0,l.W6)(),i=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,s.aZ)(i),(0,r.useCallback)((e=>{if(!i)return;const t=new URLSearchParams(a.location.search);t.set(i,e),a.replace({...a.location,search:t.toString()})}),[i,a])]}function g(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,i=d(e),[o,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!c({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:i}))),[s,u]=y({queryString:n,groupId:a}),[p,g]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,i]=(0,m.Dv)(n);return[a,(0,r.useCallback)((e=>{n&&i.set(e)}),[n,i])]}({groupId:a}),f=(()=>{const e=s??p;return c({value:e,tabValues:i})?e:null})();(0,r.useLayoutEffect)((()=>{f&&l(f)}),[f]);return{selectedValue:o,selectValue:(0,r.useCallback)((e=>{if(!c({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),g(e)}),[u,g,i]),tabValues:i}}var f=n(92303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function h(e){let{className:t,block:n,selectedValue:l,selectValue:s,tabValues:u}=e;const m=[],{blockElementScrollPositionUntilNextRender:p}=(0,o.a_)(),d=e=>{const t=e.currentTarget,n=m.indexOf(t),a=u[n].value;a!==l&&(p(t),s(a))},c=e=>{var t;let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=m.indexOf(e.currentTarget)+1;n=m[t]??m[0];break}case"ArrowLeft":{const t=m.indexOf(e.currentTarget)-1;n=m[t]??m[m.length-1];break}}null==(t=n)||t.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.A)("tabs",{"tabs--block":n},t)},u.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.A)({role:"tab",tabIndex:l===t?0:-1,"aria-selected":l===t,key:t,ref:e=>m.push(e),onKeyDown:c,onClick:d},o,{className:(0,i.A)("tabs__item",b.tabItem,null==o?void 0:o.className,{"tabs__item--active":l===t})}),n??t)})))}function v(e){let{lazy:t,children:n,selectedValue:a}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},i.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function N(e){const t=g(e);return r.createElement("div",{className:(0,i.A)("tabs-container",b.tabList)},r.createElement(h,(0,a.A)({},e,t)),r.createElement(v,(0,a.A)({},e,t)))}function w(e){const t=(0,f.A)();return r.createElement(N,(0,a.A)({key:String(t)},e))}},37741:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>u});var a=n(58168),r=(n(96540),n(15680));n(11470),n(19365);const i={title:"Internal Attributes"},o="Internal Attributes",l={unversionedId:"entities/internal-attributes/index",id:"entities/internal-attributes/index",title:"Internal Attributes",description:"The Entity constructor automatically adds internal attributes to your schemas:",source:"@site/docs/3-entities/2-internal-attributes/index.md",sourceDirName:"3-entities/2-internal-attributes",slug:"/entities/internal-attributes/",permalink:"/docs/entities/internal-attributes/",draft:!1,tags:[],version:"current",frontMatter:{title:"Internal Attributes"},sidebar:"tutorialSidebar",previous:{title:"Usage",permalink:"/docs/entities/usage/"},next:{title:"GetItem",permalink:"/docs/entities/actions/get-item/"}},s={},u=[{value:"<code>entity</code>",id:"entity",level:2},{value:"Timestamp Attributes",id:"timestamp-attributes",level:2},{value:"<code>name</code>",id:"name",level:3},{value:"<code>savedAs</code>",id:"savedas",level:3},{value:"<code>hidden</code>",id:"hidden",level:3}],m={toc:u},p="wrapper";function d(e){let{components:t,...n}=e;return(0,r.yg)(p,(0,a.A)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"internal-attributes"},"Internal Attributes"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"Entity")," constructor automatically adds ",(0,r.yg)("strong",{parentName:"p"},"internal attributes")," to your schemas:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"An ",(0,r.yg)("a",{parentName:"li",href:"#entity"},"Entity Attribute")," ",(0,r.yg)("em",{parentName:"li"},"(required)")," that ",(0,r.yg)("strong",{parentName:"li"},"tags items with the ",(0,r.yg)("inlineCode",{parentName:"strong"},"name")," of the entity"),"."),(0,r.yg)("li",{parentName:"ul"},"Two ",(0,r.yg)("a",{parentName:"li",href:"#timestamp-attributes"},"Timestamp Attributes")," ",(0,r.yg)("em",{parentName:"li"},"(optional)")," that ",(0,r.yg)("strong",{parentName:"li"},"record when the item was created and last modified")," with timestamps in ",(0,r.yg)("a",{parentName:"li",href:"https://wikipedia.org/wiki/ISO_8601"},"ISO 8601 format"),".")),(0,r.yg)("p",null,"If the schema contains a conflicting attribute, the constructor throws a ",(0,r.yg)("inlineCode",{parentName:"p"},"reservedAttributeName")," error. To avoid this, DynamoDB-Toolbox lets you customize the name and ",(0,r.yg)("inlineCode",{parentName:"p"},"savedAs")," property of the internal attributes."),(0,r.yg)("admonition",{type:"tip"},(0,r.yg)("p",{parentName:"admonition"},"You can get familiar with the internal attributes by using the ",(0,r.yg)("inlineCode",{parentName:"p"},"FormattedItem")," and ",(0,r.yg)("inlineCode",{parentName:"p"},"SavedItem")," types, respectively from the ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/format/"},(0,r.yg)("inlineCode",{parentName:"a"},"Formatter"))," and ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/actions/parse/"},(0,r.yg)("inlineCode",{parentName:"a"},"Parser"))," actions."),(0,r.yg)("details",{className:"details-in-admonition"},(0,r.yg)("summary",null,"\ud83d\udd0e ",(0,r.yg)("b",null,"Show code")),(0,r.yg)("pre",{parentName:"admonition"},(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import type { FormattedItem } from 'dynamodb-toolbox/entity/actions/format'\nimport type { SavedItem } from 'dynamodb-toolbox/entity/actions/parse'\n\nconst PokemonEntity = new Entity({\n  name: 'Pokemon',\n  schema: schema({\n    pokemonClass: string().key().savedAs('pk'),\n    pokemonId: string().key().savedAs('sk'),\n    level: number()\n  }),\n  ...\n})\n\n// Pokemons in DynamoDB:\ntype SavedPokemon = SavedItem<typeof PokemonEntity>\n// => {\n//   pk: string,\n//   sk: string,\n//   level: number,\n//   _et: \"Pokemon\",\n//   _ct: string,\n//   _md: string,\n// }\n\n// Fetched Pokemons: (`entity` attribute is hidden)\ntype FormattedPokemon = FormattedItem<typeof PokemonEntity>\n// => {\n//   pokemonClass: string,\n//   pokemonId: string,\n//   level: number,\n//   created: string,\n//   modified: string,\n// }\n")))),(0,r.yg)("h2",{id:"entity"},(0,r.yg)("inlineCode",{parentName:"h2"},"entity")),(0,r.yg)("p",null,"A string attribute that tags your items with the ",(0,r.yg)("inlineCode",{parentName:"p"},"Entity")," name."),(0,r.yg)("p",null,"This attribute is ",(0,r.yg)("strong",{parentName:"p"},"required")," for some features to work, like allowing for appropriate formatting when fetching multiple items of the same ",(0,r.yg)("inlineCode",{parentName:"p"},"Table")," in a single operation (e.g. ",(0,r.yg)("a",{parentName:"p",href:"/docs/tables/actions/query/"},"Queries")," or ",(0,r.yg)("a",{parentName:"p",href:"/docs/tables/actions/scan/"},"Scans"),"). There are two consequences to that:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"The ",(0,r.yg)("inlineCode",{parentName:"li"},"name")," of an ",(0,r.yg)("inlineCode",{parentName:"li"},"Entity")," ",(0,r.yg)("strong",{parentName:"li"},"cannot be updated")," once it has its first items (at least not without a data migration)."),(0,r.yg)("li",{parentName:"ul"},"When migrating existing data to DynamoDB-Toolbox, you also have to add it to your items first.")),(0,r.yg)("p",null,"By default, the attribute is ",(0,r.yg)("inlineCode",{parentName:"p"},"hidden")," and named ",(0,r.yg)("inlineCode",{parentName:"p"},"entity"),". This can be overridden via the ",(0,r.yg)("inlineCode",{parentName:"p"},"entityAttributeHidden")," and ",(0,r.yg)("inlineCode",{parentName:"p"},"entityAttributeName")," properties:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokemonEntity = new Entity({\n  name: 'Pokemon',\n  entityAttributeHidden: false,\n  entityAttributeName: 'item',\n  ...\n})\n")),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"The ",(0,r.yg)("inlineCode",{parentName:"p"},"savedAs")," property must be specified at the ",(0,r.yg)("inlineCode",{parentName:"p"},"Table")," level, via the ",(0,r.yg)("a",{parentName:"p",href:"/docs/tables/usage/"},(0,r.yg)("inlineCode",{parentName:"a"},"entityAttributeSavedAs"))," property.")),(0,r.yg)("h2",{id:"timestamp-attributes"},"Timestamp Attributes"),(0,r.yg)("p",null,"There are two timestamp attributes. Both of them are string attributes containing timestamps in ",(0,r.yg)("a",{parentName:"p",href:"https://wikipedia.org/wiki/ISO_8601"},"ISO 8601 format"),":"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"created")," records when the item was ",(0,r.yg)("strong",{parentName:"li"},"created")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"modified")," records when the item was ",(0,r.yg)("strong",{parentName:"li"},"last modified"))),(0,r.yg)("p",null,"Timestamp attributes are optional. You can opt out by setting off the ",(0,r.yg)("inlineCode",{parentName:"p"},"timestamps")," property:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokemonEntity = new Entity({\n  ...\n  // \ud83d\udc47 deactivates both timestamps\n  timestamps: false\n})\n")),(0,r.yg)("p",null,"You can also manage them independently:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokemonEntity = new Entity({\n  ...\n  timestamps: {\n    created: true,\n    // \ud83d\udc47 deactivates `modified` attribute\n    modified: false\n  }\n})\n")),(0,r.yg)("h4",{style:{fontSize:"large"}},"Customizing Timestamps:"),(0,r.yg)("p",null,"Instead of ",(0,r.yg)("inlineCode",{parentName:"p"},"true"),", you can provide an object to ",(0,r.yg)("strong",{parentName:"p"},"fine-tune each attribute"),". Available options:"),(0,r.yg)("h3",{id:"name"},(0,r.yg)("inlineCode",{parentName:"h3"},"name")),(0,r.yg)("p",null,"The name of the attribute:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokemonEntity = new Entity({\n  ...\n  timestamps: {\n    ...\n    modified: {\n      // `modified` by default\n      name: 'lastModified'\n    }\n  }\n})\n")),(0,r.yg)("h3",{id:"savedas"},(0,r.yg)("inlineCode",{parentName:"h3"},"savedAs")),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"savedAs")," property of the attribute:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokemonEntity = new Entity({\n  ...\n  timestamps: {\n    ...\n    modified: {\n      // `_md` by default\n      savedAs: '__lastMod__'\n    }\n  }\n})\n")),(0,r.yg)("h3",{id:"hidden"},(0,r.yg)("inlineCode",{parentName:"h3"},"hidden")),(0,r.yg)("p",null,"Whether the attribute is hidden or not when formatting:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const PokemonEntity = new Entity({\n  ...\n  timestamps: {\n    ...\n    modified: {\n      // `false` by default\n      hidden: true\n    }\n  }\n})\n")))}d.isMDXComponent=!0}}]);