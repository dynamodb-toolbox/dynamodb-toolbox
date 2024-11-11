"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9074],{3916:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>r,metadata:()=>d,toc:()=>a});var i=n(4848),s=n(8453);const r={sidebar_position:7,title:"Type Inference"},o="Type Inference",d={id:"v0/type-inference/index",title:"Type Inference",description:"Since the v0.4, most Entity methods types are inferred from an Entity definition. This is still experimental and may change in the future.",source:"@site/docs/6-v0/7-type-inference/index.md",sourceDirName:"6-v0/7-type-inference",slug:"/v0/type-inference/",permalink:"/docs/v0/type-inference/",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7,title:"Type Inference"},sidebar:"tutorialSidebar",previous:{title:"Custom Parameters and Clauses",permalink:"/docs/v0/custom-parameters/"},next:{title:"Contributing",permalink:"/docs/v0/contributing/"}},c={},a=[{value:"Overlays",id:"overlays",level:2},{value:"Utility Types",id:"utility-types",level:2},{value:"EntityItem",id:"entityitem",level:3},{value:"Options",id:"options",level:3}];function l(e){const t={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"type-inference",children:"Type Inference"})}),"\n",(0,i.jsxs)(t.p,{children:["Since the v0.4, most ",(0,i.jsx)(t.code,{children:"Entity"})," methods types are inferred from an ",(0,i.jsx)(t.code,{children:"Entity"})," definition. This is still experimental and may change in the future."]}),"\n",(0,i.jsx)(t.p,{children:"The following options are implemented:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["\ud83d\udd11 ",(0,i.jsx)(t.code,{children:"partitionKey"}),", ",(0,i.jsx)(t.code,{children:"sortKey"}),": They are used, along with array-based mapped attributes to infer the primary key type."]}),"\n",(0,i.jsxs)(t.li,{children:["\u26a1\ufe0f ",(0,i.jsx)(t.code,{children:"autoExecute"}),", ",(0,i.jsx)(t.code,{children:"execute"}),": If the ",(0,i.jsx)(t.code,{children:"execute"})," option is set to ",(0,i.jsx)(t.code,{children:"false"})," (either in the Entity definition or the method options), the method responses are typed as ",(0,i.jsx)(t.code,{children:"DocumentClient.<METHOD>ItemInput"}),"."]}),"\n",(0,i.jsxs)(t.li,{children:["\ud83e\uddd0 ",(0,i.jsx)(t.code,{children:"autoParse"}),", ",(0,i.jsx)(t.code,{children:"parse"}),": If the ",(0,i.jsx)(t.code,{children:"parse"})," option is set to ",(0,i.jsx)(t.code,{children:"false"})," (either in the Entity definition or the method options), the method responses are typed as ",(0,i.jsx)(t.code,{children:"DocumentClient.<METHOD>ItemOutput"}),"."]}),"\n",(0,i.jsxs)(t.li,{children:["\u270d\ufe0f ",(0,i.jsx)(t.code,{children:"typeAlias"}),", ",(0,i.jsx)(t.code,{children:"createdAlias"}),", ",(0,i.jsx)(t.code,{children:"modifiedAlias"}),": Aliases are used to compute the parsed responses types. They are also prevented from attribute definitions to avoid conflicts."]}),"\n",(0,i.jsxs)(t.li,{children:["\u23f0 ",(0,i.jsx)(t.code,{children:"timestamps"}),": If the ",(0,i.jsx)(t.code,{children:"timestamps"})," option is set to false, ",(0,i.jsx)(t.code,{children:"createdAlias"})," and ",(0,i.jsx)(t.code,{children:"modifiedAlias"})," are omitted from the parsed responses types."]}),"\n",(0,i.jsxs)(t.li,{children:["\ud83d\udc6e ",(0,i.jsx)(t.code,{children:"required"}),": Attributes flagged as ",(0,i.jsx)(t.code,{children:"required"})," are required as needed in ",(0,i.jsx)(t.code,{children:"put"})," and ",(0,i.jsx)(t.code,{children:"update"})," operations. They appear as always defined in parsed responses. Attempting to remove them, either with the ",(0,i.jsx)(t.code,{children:"$delete"})," shorthand or by setting them to ",(0,i.jsx)(t.code,{children:"null"})," causes an error."]}),"\n",(0,i.jsxs)(t.li,{children:["\ud83d\udc4d ",(0,i.jsx)(t.code,{children:"default"}),": Required attributes are not required in ",(0,i.jsx)(t.code,{children:"put"})," and ",(0,i.jsx)(t.code,{children:"update"})," operations if they have a ",(0,i.jsx)(t.code,{children:"default"})," value. They appear as always defined in parsed responses."]}),"\n",(0,i.jsxs)(t.li,{children:["\u2702\ufe0f ",(0,i.jsx)(t.code,{children:"attributes"}),": In ",(0,i.jsx)(t.code,{children:"get"})," and ",(0,i.jsx)(t.code,{children:"queries"})," operations, the ",(0,i.jsx)(t.code,{children:"attributes"})," option filter the attributes of the parsed responses types."]}),"\n",(0,i.jsxs)(t.li,{children:["\u261d\ufe0f ",(0,i.jsx)(t.code,{children:"conditions"}),": In ",(0,i.jsx)(t.code,{children:"put"}),", ",(0,i.jsx)(t.code,{children:"update"})," and ",(0,i.jsx)(t.code,{children:"delete"})," operations, the ",(0,i.jsx)(t.code,{children:"conditions"})," attributes are correctly typed."]}),"\n",(0,i.jsxs)(t.li,{children:["\ud83d\udce8 ",(0,i.jsx)(t.code,{children:"returnValues"}),": In ",(0,i.jsx)(t.code,{children:"put"}),", ",(0,i.jsx)(t.code,{children:"update"})," and ",(0,i.jsx)(t.code,{children:"delete"})," operation, the ",(0,i.jsx)(t.code,{children:"returnValues"})," option is interpreted to format the responses."]}),"\n",(0,i.jsxs)(t.li,{children:["\ud83d\ude48 ",(0,i.jsx)(t.code,{children:"hidden"}),": Hidden attributes are omitted from the parsed responses types."]}),"\n",(0,i.jsxs)(t.li,{children:["\ud83d\udd17 ",(0,i.jsx)(t.code,{children:"dependsOn"})," option: If the ",(0,i.jsx)(t.code,{children:"default"})," property of a key attribute is a function, you can use the ",(0,i.jsx)(t.code,{children:"dependsOn"})," attribute to enable typing the primary key through the depended-on attributes (i.e. those used in the function)."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"The following options are not yet implemented:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"alias"})," attribute option"]}),"\n",(0,i.jsx)(t.li,{children:"Table attributes!"}),"\n",(0,i.jsx)(t.li,{children:"Secondary indexes names"}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.code,{children:"coerce"})," option"]}),"\n",(0,i.jsxs)(t.li,{children:["Improved ",(0,i.jsx)(t.code,{children:"list"})," and ",(0,i.jsx)(t.code,{children:"set"})," support\n... And probably more! Feel free to open an issue if needed \ud83e\udd17"]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"overlays",children:"Overlays"}),"\n",(0,i.jsxs)(t.p,{children:["When type infering doesn't cut it, every method supports the possibility of enforcing a custom ",(0,i.jsx)(t.code,{children:"Item"})," type, and a custom ",(0,i.jsx)(t.code,{children:"CompositeKey"})," type where needed."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:"type CustomItem = {\n  pk: string\n  sk: string\n  name: string\n}\n\ntype CustomCompositeKey = {\n  pk: string\n  sk: string\n}\n\nconst { Item } = await MyEntity.get<\n  CustomItem,\n  CustomCompositeKey\n>({\n  pk: 'pk',\n  sk: 'sk' // \u2705 CustomCompositeKey expected\n}) // \u2705 Item is of type: undefined | CustomItem\n"})}),"\n",(0,i.jsx)(t.p,{children:"Overlaying at the Entity level is also possible. The overlay is passed down to every method, and type inference is fully deactivated:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:'const MyEntity =  new Entity<"MyEntityName", CustomItem, CustomCompositeKey, typeof table>({\n  name: "MyEntityName",\n  ...,\n  table,\n} as const)\n\nawait MyEntity.update({ pk, sk, name }) // \u2705 Overlay CustomItem is used\nawait MyEntity.delete<CustomItem, { foo: "bar" }>({ foo: "bar" }) // \u2705 Entity overlays can still be overridden\n'})}),"\n",(0,i.jsxs)(t.p,{children:["Write operations ",(0,i.jsx)(t.code,{children:"condition"})," and read operations ",(0,i.jsx)(t.code,{children:"attributes"})," options are also typed as the applied overlay keys and filter the response properties:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:"const { Item } = await MyEntity.get(\n  { pk, sk },\n  { attributes: ['incorrect'] }\n) // \u274c Errors\nconst { Item } = await MyEntity.get(\n  { pk, sk },\n  { attributes: ['name'] }\n) // \u2705 Item is of type { name: string }\n"})}),"\n",(0,i.jsx)(t.h2,{id:"utility-types",children:"Utility Types"}),"\n",(0,i.jsx)(t.h3,{id:"entityitem",children:"EntityItem"}),"\n",(0,i.jsxs)(t.p,{children:["The inferred or overlayed entity items type can be obtained through the ",(0,i.jsx)(t.code,{children:"EntityItem"})," utility type:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:"import type { EntityItem } from 'dynamodb-toolbox'\n\nconst listUsers = async (): Promise<EntityItem<typeof UserEntity>[]> => {\n  const { Items } = await UserEntity.query(...)\n  return Items\n}\n"})}),"\n",(0,i.jsx)(t.h3,{id:"options",children:"Options"}),"\n",(0,i.jsx)(t.p,{children:"Sometimes, it can be useful to dynamically set an entity operation options. For instance:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:"const queryOptions = {}\n\nif (!isSuperadmin(user)) {\n  queryOptions.beginsWith = 'USER'\n}\n\nconst { Item } = await MyEntity.query(pk, {\n  attributes: ['name', 'age'],\n  ...queryOptions\n})\n"})}),"\n",(0,i.jsxs)(t.p,{children:["Sadly, in TS this throws an error, as ",(0,i.jsx)(t.code,{children:"getOptions"})," is typed as ",(0,i.jsx)(t.code,{children:"{}"}),". Using a non-generic ",(0,i.jsx)(t.code,{children:"GetOptions"})," type also throws an error as the entity attribute names are hardly typed, and ",(0,i.jsx)(t.code,{children:"string"})," is not assignable to the ",(0,i.jsx)(t.code,{children:"attributes"})," or ",(0,i.jsx)(t.code,{children:"conditions"})," options."]}),"\n",(0,i.jsxs)(t.p,{children:["For this purpose, DynamoDB-Toolbox exposes ",(0,i.jsx)(t.code,{children:"GetOptions"}),", ",(0,i.jsx)(t.code,{children:"PutOptions"}),", ",(0,i.jsx)(t.code,{children:"DeleteOptions"}),", ",(0,i.jsx)(t.code,{children:"UpdateOptions"})," & ",(0,i.jsx)(t.code,{children:"QueryOptions"})," utility types:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:"import type { QueryOptions } from 'dynamodb-toolbox'\n\nconst queryOptions: QueryOptions<typeof MyEntity> = {}\n\nif (!isSuperadmin(user)) {\n  queryOptions.beginsWith = 'USER'\n}\n\nconst { Item } = await MyEntity.query(pk, {\n  attributes: ['name', 'age'],\n  ...queryOptions\n})\n"})})]})}function p(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>d});var i=n(6540);const s={},r=i.createContext(s);function o(e){const t=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),i.createElement(r.Provider,{value:t},e.children)}}}]);