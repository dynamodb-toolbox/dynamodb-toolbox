"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[6461],{11470:(e,n,t)=>{t.d(n,{A:()=>P});var i=t(96540),r=t(18215),s=t(23104),a=t(56347),o=t(205),l=t(57485),d=t(31682),c=t(70679);function h(e){return i.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,i.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function u(e){const{values:n,children:t}=e;return(0,i.useMemo)((()=>{const e=n??function(e){return h(e).map((e=>{let{props:{value:n,label:t,attributes:i,default:r}}=e;return{value:n,label:t,attributes:i,default:r}}))}(t);return function(e){const n=(0,d.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function x(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:t}=e;const r=(0,a.W6)(),s=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,l.aZ)(s),(0,i.useCallback)((e=>{if(!s)return;const n=new URLSearchParams(r.location.search);n.set(s,e),r.replace({...r.location,search:n.toString()})}),[s,r])]}function p(e){const{defaultValue:n,queryString:t=!1,groupId:r}=e,s=u(e),[a,l]=(0,i.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!x({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const i=t.find((e=>e.default))??t[0];if(!i)throw new Error("Unexpected error: 0 tabValues");return i.value}({defaultValue:n,tabValues:s}))),[d,h]=m({queryString:t,groupId:r}),[p,j]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[r,s]=(0,c.Dv)(t);return[r,(0,i.useCallback)((e=>{t&&s.set(e)}),[t,s])]}({groupId:r}),b=(()=>{const e=d??p;return x({value:e,tabValues:s})?e:null})();(0,o.A)((()=>{b&&l(b)}),[b]);return{selectedValue:a,selectValue:(0,i.useCallback)((e=>{if(!x({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);l(e),h(e),j(e)}),[h,j,s]),tabValues:s}}var j=t(92303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var y=t(74848);function f(e){let{className:n,block:t,selectedValue:i,selectValue:a,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:d}=(0,s.a_)(),c=e=>{const n=e.currentTarget,t=l.indexOf(n),r=o[t].value;r!==i&&(d(n),a(r))},h=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=l.indexOf(e.currentTarget)+1;n=l[t]??l[0];break}case"ArrowLeft":{const t=l.indexOf(e.currentTarget)-1;n=l[t]??l[l.length-1];break}}n?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":t},n),children:o.map((e=>{let{value:n,label:t,attributes:s}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:i===n?0:-1,"aria-selected":i===n,ref:e=>l.push(e),onKeyDown:h,onClick:c,...s,className:(0,r.A)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":i===n}),children:t??n},n)}))})}function g(e){let{lazy:n,children:t,selectedValue:s}=e;const a=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=a.find((e=>e.props.value===s));return e?(0,i.cloneElement)(e,{className:(0,r.A)("margin-top--md",e.props.className)}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:a.map(((e,n)=>(0,i.cloneElement)(e,{key:n,hidden:e.props.value!==s})))})}function v(e){const n=p(e);return(0,y.jsxs)("div",{className:(0,r.A)("tabs-container",b.tabList),children:[(0,y.jsx)(f,{...n,...e}),(0,y.jsx)(g,{...n,...e})]})}function P(e){const n=(0,j.A)();return(0,y.jsx)(v,{...e,children:h(e.children)},String(n))}},19365:(e,n,t)=>{t.d(n,{A:()=>a});t(96540);var i=t(18215);const r={tabItem:"tabItem_Ymn6"};var s=t(74848);function a(e){let{children:n,hidden:t,className:a}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,i.A)(r.tabItem,a),hidden:t,children:n})}},28453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>o});var i=t(96540);const r={},s=i.createContext(r);function a(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(s.Provider,{value:n},e.children)}},36440:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>x,frontMatter:()=>l,metadata:()=>i,toc:()=>h});const i=JSON.parse('{"id":"tables/actions/deletePartition/index","title":"DeletePartition","description":"DeletePartitionCommand is exposed as a quality of life improvement, but is NOT an official DynamoDB operation (eventhough we wish it was).","source":"@site/docs/2-tables/2-actions/3-deletePartition/index.md","sourceDirName":"2-tables/2-actions/3-deletePartition","slug":"/tables/actions/deletePartition/","permalink":"/docs/tables/actions/deletePartition/","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"DeletePartition","sidebar_custom_props":{"sidebarActionType":"delete"}},"sidebar":"tutorialSidebar","previous":{"title":"Query","permalink":"/docs/tables/actions/query/"},"next":{"title":"Batching","permalink":"/docs/tables/actions/batching/"}}');var r=t(74848),s=t(28453),a=t(11470),o=t(19365);const l={title:"DeletePartition",sidebar_custom_props:{sidebarActionType:"delete"}},d="DeletePartition",c={},h=[{value:"Request",id:"request",level:2},{value:"<code>.query(...)</code>",id:"query",level:3},{value:"<code>.entities(...)</code>",id:"entities",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Examples",id:"examples",level:2},{value:"Response",id:"response",level:2}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"deletepartition",children:"DeletePartition"})}),"\n",(0,r.jsxs)(n.admonition,{type:"warning",children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"DeletePartitionCommand"})," is exposed as a quality of life improvement, but is NOT an official DynamoDB operation (eventhough we wish it was)."]}),(0,r.jsxs)(n.p,{children:["Use it with \u26a0\ufe0f ",(0,r.jsx)(n.strong,{children:"caution"})," \u26a0\ufe0f It can be ",(0,r.jsx)(n.strong,{children:"long"})," and ",(0,r.jsx)(n.strong,{children:"costly"})," on large partitions, and ",(0,r.jsx)(n.strong,{children:"incomplete"})," in case of inconsistent read."]})]}),"\n",(0,r.jsxs)(n.p,{children:["Performs a paginated ",(0,r.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html",children:"Query Operation"})," on a ",(0,r.jsx)(n.code,{children:"Table"})," and run subsequent ",(0,r.jsx)(n.a,{href:"/docs/tables/actions/batch-write/",children:(0,r.jsx)(n.code,{children:"BatchWriteCommands"})})," to batch delete returned items:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { DeletePartitionCommand } from 'dynamodb-toolbox/table/actions/deletePartition'\n\nconst deletePartitionCommand = PokeTable.build(\n  DeletePartitionCommand\n)\n\nawait deletePartitionCommand.send()\n"})}),"\n",(0,r.jsx)(n.h2,{id:"request",children:"Request"}),"\n",(0,r.jsx)(n.h3,{id:"query",children:(0,r.jsx)(n.code,{children:".query(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:"(required)"})}),"\n",(0,r.jsx)(n.p,{children:"The partition to query, with optional index and range condition:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"partition"}),": The partition key to query"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsxs)("code",{children:["index ",(0,r.jsx)("i",{children:"(optional)"})]}),": The name of a secondary index to query"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsxs)("code",{children:["range ",(0,r.jsx)("i",{children:"(optional)"})]}),": If the table or index has a sort key, an additional ",(0,r.jsx)("a",{href:"../../entities/actions/parse-condition#range-conditions",children:"Range or Equality Condition"})]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"// Delete 'ashKetchum' pokemons\nawait PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity)\n  .query({ partition: 'ashKetchum' })\n  .send()\n"})}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["See the ",(0,r.jsx)(n.a,{href:"/docs/tables/actions/query/#query",children:(0,r.jsx)(n.code,{children:"QueryCommand"})})," documentation for more details."]})}),"\n",(0,r.jsx)(n.h3,{id:"entities",children:(0,r.jsx)(n.code,{children:".entities(...)"})}),"\n",(0,r.jsx)("p",{style:{marginTop:"-15px"},children:(0,r.jsx)("i",{children:"(required)"})}),"\n",(0,r.jsxs)(n.p,{children:["Provides a list of entities to filter the deleted items (via the internal ",(0,r.jsx)(n.a,{href:"/docs/entities/internal-attributes/#entity",children:(0,r.jsx)(n.code,{children:"entity"})})," attribute). Required to build underlying ",(0,r.jsx)(n.a,{href:"/docs/entities/actions/batch-delete/",children:(0,r.jsx)(n.code,{children:"BatchDeleteRequests"})}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"await PokeTable.build(DeletePartitionCommand)\n  // Deletes only `Pokemons` and `Trainers`\n  .entities(PokemonEntity, TrainerEntity)\n  .query(query)\n  .send()\n"})}),"\n",(0,r.jsx)(n.h3,{id:"options",children:(0,r.jsx)(n.code,{children:".options(...)"})}),"\n",(0,r.jsx)(n.p,{children:"Provides additional options:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"await PokeTable.build(DeletePartitionCommand)\n  .options({\n    consistent: true,\n    ...\n  })\n  .send()\n"})}),"\n",(0,r.jsxs)(n.p,{children:["You can use the ",(0,r.jsx)(n.code,{children:"DeletePartitionOptions"})," type to explicitly type an object as a ",(0,r.jsx)(n.code,{children:"DeletePartitionCommand"})," options object:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import type { DeletePartitionOptions } from 'dynamodb-toolbox/table/actions/deletePartition'\n\nconst queryOptions: DeletePartitionOptions<\n  typeof PokeTable,\n  [typeof PokemonEntity, typeof TrainerEntity]\n  // \ud83d\udc47 Optional query\n  { partition: string }\n> = {\n  consistent: true,\n  ...\n}\n\nawait PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity, TrainerEntity)\n  .query(query)\n  .options(queryOptions)\n  .send()\n"})}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["It is advised to provide ",(0,r.jsx)(n.code,{children:"entities"})," and ",(0,r.jsx)(n.code,{children:"query"})," first as they constrain the ",(0,r.jsx)(n.code,{children:"options"})," type."]})}),"\n",(0,r.jsxs)(n.p,{children:["Available options (see the ",(0,r.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_RequestParameters",children:"DynamoDB Query documentation"})," for more details):"]}),"\n",(0,r.jsxs)("table",{children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{children:"Option"}),(0,r.jsx)("th",{children:"Type"}),(0,r.jsx)("th",{children:"Default"}),(0,r.jsx)("th",{children:"Description"})]})}),(0,r.jsxs)("tbody",{children:[(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"consistent"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:"boolean"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:"false"})}),(0,r.jsx)("td",{children:(0,r.jsxs)(n.p,{children:["By default, read operations are ",(0,r.jsx)("b",{children:"eventually"})," consistent (which improves performances and reduces costs).\n",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Set to ",(0,r.jsx)("code",{children:"true"})," to use a ",(0,r.jsx)("b",{children:"strongly"})," consistent query (unavailable on global secondary indexes)."]})})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"capacity"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:"CapacityOption"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:'"NONE"'})}),(0,r.jsx)("td",{children:(0,r.jsxs)(n.p,{children:["Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.\n",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Possible values are ",(0,r.jsx)("code",{children:'"NONE"'}),", ",(0,r.jsx)("code",{children:'"TOTAL"'})," and ",(0,r.jsx)("code",{children:'"INDEXES"'}),".\n",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"(Applies for the query and the batch writes.)"]})})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"tableName"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:"string"})}),(0,r.jsx)("td",{align:"center",children:"-"}),(0,r.jsx)("td",{children:(0,r.jsxs)(n.p,{children:["Overrides the ",(0,r.jsx)("code",{children:"Table"})," name. Mostly useful for ",(0,r.jsx)("a",{href:"https://en.wikipedia.org/wiki/Multitenancy",children:"multitenancy"}),"."]})})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"exclusiveStartKey"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:"Key"})}),(0,r.jsx)("td",{align:"center",children:"-"}),(0,r.jsx)("td",{children:"The primary key of the first item that this operation evaluates."})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"filters"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:"Record<string, Condition>"})}),(0,r.jsx)("td",{align:"center",children:"-"}),(0,r.jsx)("td",{children:(0,r.jsxs)(n.p,{children:["For each entity name, a condition that must be satisfied in order for evaluated items of this entity to be deleted (improves performances but does not reduce costs).\n",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"See the ",(0,r.jsx)("a",{href:"../../entities/actions/parse-condition#building-conditions",children:(0,r.jsx)("code",{children:"ConditionParser"})})," action for more details on how to write conditions."]})})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:(0,r.jsx)("code",{children:"entityAttrFilter"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:"boolean"})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:"true"})}),(0,r.jsx)("td",{children:(0,r.jsxs)(n.p,{children:["By default, specifying ",(0,r.jsx)("a",{href:"#entities",children:(0,r.jsx)("code",{children:"entities"})})," introduces a ",(0,r.jsx)("a",{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax",children:"Filter Expression"})," on the ",(0,r.jsx)("a",{href:"../../entities/internal-attributes#entity",children:(0,r.jsx)("code",{children:"entity"})})," internal attribute. Set this option to ",(0,r.jsx)("code",{children:"false"})," to disable this behavior.\n",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"This option is useful for querying items that lack the ",(0,r.jsx)("a",{href:"../../entities/internal-attributes#entity",children:(0,r.jsx)("code",{children:"entity"})})," internal attribute (e.g., when migrating to DynamoDB-Toolbox). In this case, DynamoDB-Toolbox attempts to format the item for each entity and disregards it if none succeed.\n",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Note that you can also use ",(0,r.jsx)("a",{href:"https://aws.amazon.com/fr/blogs/developer/middleware-stack-modular-aws-sdk-js/",children:"Middleware Stacks"})," to reintroduce the entity attribute and improve performance."]})})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:(0,r.jsxs)("code",{children:["noEntityMatch",(0,r.jsx)("wbr",{}),"Behavior"]})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsxs)("code",{children:["NoEntityMatch",(0,r.jsx)("wbr",{}),"Behavior"]})}),(0,r.jsx)("td",{align:"center",children:(0,r.jsx)("code",{children:'"THROW"'})}),(0,r.jsx)("td",{children:(0,r.jsxs)(n.p,{children:["If ",(0,r.jsx)("code",{children:"entityAttrFilter"})," is ",(0,r.jsx)("code",{children:"false"}),", this option defines the behavior when a returned item fails to be formatted for all entities.\n",(0,r.jsx)("br",{}),(0,r.jsx)("br",{}),"Possible values are ",(0,r.jsx)("code",{children:'"THROW"'})," to throw an error and ",(0,r.jsx)("code",{children:'"DISCARD"'})," to discard the item."]})})]})]})]}),"\n",(0,r.jsx)(n.h2,{id:"examples",children:"Examples"}),"\n",(0,r.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,r.jsxs)(a.A,{children:[(0,r.jsx)(o.A,{value:"basic",label:"Basic",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"await PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity)\n  .query({ partition: 'ashKetchum' })\n  .send()\n"})})}),(0,r.jsx)(o.A,{value:"consistent",label:"Consistent",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"await PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity)\n  .query({ partition: 'ashKetchum' })\n  .options({ consistent: true })\n  .send()\n"})})}),(0,r.jsx)(o.A,{value:"indexed",label:"Index",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"await PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity)\n  .query({\n    index: 'byTrainerId',\n    partition: 'ashKetchum',\n    range: { gte: 50 }\n  })\n  .send()\n"})})}),(0,r.jsx)(o.A,{value:"filtered",label:"Filtered",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"await PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity, TrainerEntity)\n  .query({ partition: 'ashKetchum' })\n  .options({\n    filters: {\n      POKEMONS: { attr: 'pokeType', eq: 'fire' },\n      TRAINERS: { attr: 'age', gt: 18 }\n    }\n  })\n  .send()\n"})})}),(0,r.jsx)(o.A,{value:"multitenant",label:"Multitenant",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"await PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity)\n  .query({ partition: 'ashKetchum' })\n  .options({ tableName: `tenant-${tenantId}-pokemons` })\n  .send()\n"})})}),(0,r.jsx)(o.A,{value:"aborted",label:"Aborted",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const abortController = new AbortController()\nconst abortSignal = abortController.signal\n\nawait PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity)\n  .query({ partition: 'ashKetchum' })\n  .send({ abortSignal })\n\n// \ud83d\udc47 Aborts the command\nabortController.abort()\n"})})}),(0,r.jsx)(o.A,{value:"entity-attr",label:"Entity Attr.",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"await PokeTable.build(DeletePartitionCommand)\n  .entities(PokemonEntity, TrainerEntity)\n  .query({ partition: 'ashKetchum' })\n  .options({\n    entityAttrFilter: false,\n    noEntityMatchBehavior: 'DISCARD'\n  })\n  .send()\n"})})})]})}),"\n",(0,r.jsx)(n.h2,{id:"response",children:"Response"}),"\n",(0,r.jsxs)(n.p,{children:["The response syntax is similar to the ",(0,r.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_ResponseElements",children:"DynamoDB Query API"}),", except that:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"Items"})," are ",(0,r.jsx)(n.strong,{children:"not"})," returned"]}),"\n",(0,r.jsxs)(n.li,{children:["The query ",(0,r.jsx)(n.code,{children:"ConsumedCapacity"})," is renamed as ",(0,r.jsx)(n.code,{children:"QueryConsumedCapacity"})]}),"\n",(0,r.jsxs)(n.li,{children:["The batch write ",(0,r.jsx)(n.code,{children:"ConsumedCapacity"})," is renamed as ",(0,r.jsx)(n.code,{children:"BatchWriteConsumedCapacity"})]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["You can use the ",(0,r.jsx)(n.code,{children:"DeletePartitionResponse"})," type to explicitly type an object as a ",(0,r.jsx)(n.code,{children:"DeletePartitionCommand"})," response object:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import type { DeletePartitionResponse } from 'dynamodb-toolbox/table/actions/deletePartition'\n\nconst deletePartitionResponse: DeletePartitionResponse<\n  typeof PokeTable,\n  // \ud83d\udc47 Query\n  { partition: 'ashKetchum' },\n  // \ud83d\udc47 Optional entities\n  [typeof PokemonEntity],\n> = { Count: ... }\n"})})]})}function x(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}}}]);