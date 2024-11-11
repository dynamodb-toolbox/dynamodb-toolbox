"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5225],{2688:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>u,frontMatter:()=>s,metadata:()=>o,toc:()=>d});var r=n(4848),i=n(8453);n(1470),n(9365);const s={title:"Internal Attributes"},a="Internal Attributes",o={id:"entities/internal-attributes/index",title:"Internal Attributes",description:"The Entity constructor automatically adds internal attributes to your schemas:",source:"@site/docs/3-entities/2-internal-attributes/index.md",sourceDirName:"3-entities/2-internal-attributes",slug:"/entities/internal-attributes/",permalink:"/docs/entities/internal-attributes/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Internal Attributes"},sidebar:"tutorialSidebar",previous:{title:"Usage",permalink:"/docs/entities/usage/"},next:{title:"Type Inference",permalink:"/docs/entities/type-inference/"}},l={},d=[{value:"<code>entity</code>",id:"entity",level:2},{value:"Timestamp Attributes",id:"timestamp-attributes",level:2},{value:"<code>name</code>",id:"name",level:3},{value:"<code>savedAs</code>",id:"savedas",level:3},{value:"<code>hidden</code>",id:"hidden",level:3}];function c(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components},{Details:n}=t;return n||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"internal-attributes",children:"Internal Attributes"})}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(t.code,{children:"Entity"})," constructor automatically adds ",(0,r.jsx)(t.strong,{children:"internal attributes"})," to your schemas:"]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["An ",(0,r.jsx)(t.a,{href:"#entity",children:"Entity Attribute"})," ",(0,r.jsx)(t.em,{children:"(required)"})," that ",(0,r.jsxs)(t.strong,{children:["tags items with the ",(0,r.jsx)(t.code,{children:"name"})," of the entity"]}),"."]}),"\n",(0,r.jsxs)(t.li,{children:["Two ",(0,r.jsx)(t.a,{href:"#timestamp-attributes",children:"Timestamp Attributes"})," ",(0,r.jsx)(t.em,{children:"(optional)"})," that ",(0,r.jsx)(t.strong,{children:"record when the item was created and last modified"})," with timestamps in ",(0,r.jsx)(t.a,{href:"https://wikipedia.org/wiki/ISO_8601",children:"ISO 8601 format"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["If the schema contains a conflicting attribute, the constructor throws a ",(0,r.jsx)(t.code,{children:"reservedAttributeName"})," error. To avoid this, DynamoDB-Toolbox lets you customize the name and ",(0,r.jsx)(t.code,{children:"savedAs"})," property of the internal attributes."]}),"\n",(0,r.jsxs)(t.admonition,{type:"tip",children:[(0,r.jsxs)(t.p,{children:["You can get familiar with the internal attributes by using the ",(0,r.jsx)(t.code,{children:"FormattedItem"})," and ",(0,r.jsx)(t.code,{children:"SavedItem"})," types (see ",(0,r.jsx)(t.a,{href:"/docs/entities/type-inference/",children:"Type Inference"})," for more details):"]}),(0,r.jsxs)(n,{className:"details-in-admonition",children:[(0,r.jsxs)("summary",{children:["\ud83d\udd0e ",(0,r.jsx)("b",{children:"Show code"})]}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"import type { FormattedItem, SavedItem } from 'dynamodb-toolbox/entity'\n\nconst PokemonEntity = new Entity({\n  name: 'Pokemon',\n  schema: schema({\n    pokemonClass: string().key().savedAs('pk'),\n    pokemonId: string().key().savedAs('sk'),\n    level: number()\n  }),\n  ...\n})\n\n// Pokemons in DynamoDB:\ntype SavedPokemon = SavedItem<typeof PokemonEntity>\n// => {\n//   pk: string,\n//   sk: string,\n//   level: number,\n//   _et: \"Pokemon\",\n//   _ct: string,\n//   _md: string,\n// }\n\n// Fetched Pokemons: (`entity` attribute is hidden)\ntype FormattedPokemon = FormattedItem<typeof PokemonEntity>\n// => {\n//   pokemonClass: string,\n//   pokemonId: string,\n//   level: number,\n//   created: string,\n//   modified: string,\n// }\n"})})]})]}),"\n",(0,r.jsx)(t.h2,{id:"entity",children:(0,r.jsx)(t.code,{children:"entity"})}),"\n",(0,r.jsxs)(t.p,{children:["A string attribute that tags your items with the ",(0,r.jsx)(t.code,{children:"Entity"})," name."]}),"\n",(0,r.jsxs)(t.p,{children:["This attribute is ",(0,r.jsx)(t.strong,{children:"required"})," for some features to work, like allowing for appropriate formatting when fetching multiple items of the same ",(0,r.jsx)(t.code,{children:"Table"})," in a single operation (e.g. ",(0,r.jsx)(t.a,{href:"/docs/tables/actions/query/",children:"Queries"})," or ",(0,r.jsx)(t.a,{href:"/docs/tables/actions/scan/",children:"Scans"}),"). There are two consequences to that:"]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["The ",(0,r.jsx)(t.code,{children:"name"})," of an ",(0,r.jsx)(t.code,{children:"Entity"})," ",(0,r.jsx)(t.strong,{children:"cannot be updated"})," once it has its first items (at least not without a data migration)."]}),"\n",(0,r.jsx)(t.li,{children:"When migrating existing data to DynamoDB-Toolbox, you also have to add it to your items first."}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["By default, the attribute is ",(0,r.jsx)(t.code,{children:"hidden"})," and named ",(0,r.jsx)(t.code,{children:"entity"}),". This can be overridden via the ",(0,r.jsx)(t.code,{children:"entityAttributeHidden"})," and ",(0,r.jsx)(t.code,{children:"entityAttributeName"})," properties:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  name: 'Pokemon',\n  entityAttributeHidden: false,\n  entityAttributeName: 'item',\n  ...\n})\n"})}),"\n",(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(t.code,{children:"savedAs"})," property must be specified at the ",(0,r.jsx)(t.code,{children:"Table"})," level, via the ",(0,r.jsx)(t.a,{href:"/docs/tables/usage/",children:(0,r.jsx)(t.code,{children:"entityAttributeSavedAs"})})," property."]})}),"\n",(0,r.jsx)(t.h2,{id:"timestamp-attributes",children:"Timestamp Attributes"}),"\n",(0,r.jsxs)(t.p,{children:["There are two timestamp attributes. Both of them are string attributes containing timestamps in ",(0,r.jsx)(t.a,{href:"https://wikipedia.org/wiki/ISO_8601",children:"ISO 8601 format"}),":"]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"created"})," records when the item was ",(0,r.jsx)(t.strong,{children:"created"})]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.code,{children:"modified"})," records when the item was ",(0,r.jsx)(t.strong,{children:"last modified"})]}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["Timestamp attributes are optional. You can opt out by setting off the ",(0,r.jsx)(t.code,{children:"timestamps"})," property:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  ...\n  // \ud83d\udc47 deactivates both timestamps\n  timestamps: false\n})\n"})}),"\n",(0,r.jsx)(t.p,{children:"You can also manage them independently:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  ...\n  timestamps: {\n    created: true,\n    // \ud83d\udc47 deactivates `modified` attribute\n    modified: false\n  }\n})\n"})}),"\n",(0,r.jsx)("h4",{style:{fontSize:"large"},children:"Customizing Timestamps:"}),"\n",(0,r.jsxs)(t.p,{children:["Instead of ",(0,r.jsx)(t.code,{children:"true"}),", you can provide an object to ",(0,r.jsx)(t.strong,{children:"fine-tune each attribute"}),". Available options:"]}),"\n",(0,r.jsx)(t.h3,{id:"name",children:(0,r.jsx)(t.code,{children:"name"})}),"\n",(0,r.jsx)(t.p,{children:"The name of the attribute:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  ...\n  timestamps: {\n    ...\n    modified: {\n      // `modified` by default\n      name: 'lastModified'\n    }\n  }\n})\n"})}),"\n",(0,r.jsx)(t.h3,{id:"savedas",children:(0,r.jsx)(t.code,{children:"savedAs"})}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(t.code,{children:"savedAs"})," property of the attribute:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  ...\n  timestamps: {\n    ...\n    modified: {\n      // `_md` by default\n      savedAs: '__lastMod__'\n    }\n  }\n})\n"})}),"\n",(0,r.jsx)(t.h3,{id:"hidden",children:(0,r.jsx)(t.code,{children:"hidden"})}),"\n",(0,r.jsx)(t.p,{children:"Whether the attribute is hidden or not when formatting:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"const PokemonEntity = new Entity({\n  ...\n  timestamps: {\n    ...\n    modified: {\n      // `false` by default\n      hidden: true\n    }\n  }\n})\n"})})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},9365:(e,t,n)=>{n.d(t,{A:()=>a});n(6540);var r=n(8215);const i={tabItem:"tabItem_Ymn6"};var s=n(4848);function a(e){let{children:t,hidden:n,className:a}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,r.A)(i.tabItem,a),hidden:n,children:t})}},1470:(e,t,n)=>{n.d(t,{A:()=>w});var r=n(6540),i=n(8215),s=n(3104),a=n(6347),o=n(205),l=n(7485),d=n(1682),c=n(679);function u(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:i}}=e;return{value:t,label:n,attributes:r,default:i}}))}(n);return function(e){const t=(0,d.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function m(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:n}=e;const i=(0,a.W6)(),s=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l.aZ)(s),(0,r.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(i.location.search);t.set(s,e),i.replace({...i.location,search:t.toString()})}),[s,i])]}function f(e){const{defaultValue:t,queryString:n=!1,groupId:i}=e,s=h(e),[a,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:s}))),[d,u]=p({queryString:n,groupId:i}),[f,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[i,s]=(0,c.Dv)(n);return[i,(0,r.useCallback)((e=>{n&&s.set(e)}),[n,s])]}({groupId:i}),x=(()=>{const e=d??f;return m({value:e,tabValues:s})?e:null})();(0,o.A)((()=>{x&&l(x)}),[x]);return{selectedValue:a,selectValue:(0,r.useCallback)((e=>{if(!m({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),b(e)}),[u,b,s]),tabValues:s}}var b=n(2303);const x={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var j=n(4848);function y(e){let{className:t,block:n,selectedValue:r,selectValue:a,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:d}=(0,s.a_)(),c=e=>{const t=e.currentTarget,n=l.indexOf(t),i=o[n].value;i!==r&&(d(t),a(i))},u=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const n=l.indexOf(e.currentTarget)+1;t=l[n]??l[0];break}case"ArrowLeft":{const n=l.indexOf(e.currentTarget)-1;t=l[n]??l[l.length-1];break}}t?.focus()};return(0,j.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.A)("tabs",{"tabs--block":n},t),children:o.map((e=>{let{value:t,label:n,attributes:s}=e;return(0,j.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>l.push(e),onKeyDown:u,onClick:c,...s,className:(0,i.A)("tabs__item",x.tabItem,s?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function g(e){let{lazy:t,children:n,selectedValue:s}=e;const a=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=a.find((e=>e.props.value===s));return e?(0,r.cloneElement)(e,{className:(0,i.A)("margin-top--md",e.props.className)}):null}return(0,j.jsx)("div",{className:"margin-top--md",children:a.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==s})))})}function v(e){const t=f(e);return(0,j.jsxs)("div",{className:(0,i.A)("tabs-container",x.tabList),children:[(0,j.jsx)(y,{...t,...e}),(0,j.jsx)(g,{...t,...e})]})}function w(e){const t=(0,b.A)();return(0,j.jsx)(v,{...e,children:u(e.children)},String(t))}},8453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>o});var r=n(6540);const i={},s=r.createContext(i);function a(e){const t=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);