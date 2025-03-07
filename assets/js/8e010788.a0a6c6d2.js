"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2012],{11470:(e,n,t)=>{t.d(n,{A:()=>S});var s=t(96540),i=t(18215),r=t(23104),a=t(56347),l=t(205),o=t(57485),d=t(31682),c=t(70679);function h(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function u(e){const{values:n,children:t}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return h(e).map((e=>{let{props:{value:n,label:t,attributes:s,default:i}}=e;return{value:n,label:t,attributes:s,default:i}}))}(t);return function(e){const n=(0,d.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function x(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:t}=e;const i=(0,a.W6)(),r=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,o.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(i.location.search);n.set(r,e),i.replace({...i.location,search:n.toString()})}),[r,i])]}function j(e){const{defaultValue:n,queryString:t=!1,groupId:i}=e,r=u(e),[a,o]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!x({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=t.find((e=>e.default))??t[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:r}))),[d,h]=m({queryString:t,groupId:i}),[j,p]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[i,r]=(0,c.Dv)(t);return[i,(0,s.useCallback)((e=>{t&&r.set(e)}),[t,r])]}({groupId:i}),b=(()=>{const e=d??j;return x({value:e,tabValues:r})?e:null})();(0,l.A)((()=>{b&&o(b)}),[b]);return{selectedValue:a,selectValue:(0,s.useCallback)((e=>{if(!x({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);o(e),h(e),p(e)}),[h,p,r]),tabValues:r}}var p=t(92303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var f=t(74848);function g(e){let{className:n,block:t,selectedValue:s,selectValue:a,tabValues:l}=e;const o=[],{blockElementScrollPositionUntilNextRender:d}=(0,r.a_)(),c=e=>{const n=e.currentTarget,t=o.indexOf(n),i=l[t].value;i!==s&&(d(n),a(i))},h=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=o.indexOf(e.currentTarget)+1;n=o[t]??o[0];break}case"ArrowLeft":{const t=o.indexOf(e.currentTarget)-1;n=o[t]??o[o.length-1];break}}n?.focus()};return(0,f.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.A)("tabs",{"tabs--block":t},n),children:l.map((e=>{let{value:n,label:t,attributes:r}=e;return(0,f.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>o.push(e),onKeyDown:h,onClick:c,...r,className:(0,i.A)("tabs__item",b.tabItem,r?.className,{"tabs__item--active":s===n}),children:t??n},n)}))})}function y(e){let{lazy:n,children:t,selectedValue:r}=e;const a=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=a.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:(0,i.A)("margin-top--md",e.props.className)}):null}return(0,f.jsx)("div",{className:"margin-top--md",children:a.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==r})))})}function v(e){const n=j(e);return(0,f.jsxs)("div",{className:(0,i.A)("tabs-container",b.tabList),children:[(0,f.jsx)(g,{...n,...e}),(0,f.jsx)(y,{...n,...e})]})}function S(e){const n=(0,p.A)();return(0,f.jsx)(v,{...e,children:h(e.children)},String(n))}},19365:(e,n,t)=>{t.d(n,{A:()=>a});t(96540);var s=t(18215);const i={tabItem:"tabItem_Ymn6"};var r=t(74848);function a(e){let{children:n,hidden:t,className:a}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(i.tabItem,a),hidden:t,children:n})}},28453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>l});var s=t(96540);const i={},r=s.createContext(i);function a(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(r.Provider,{value:n},e.children)}},30448:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>x,frontMatter:()=>o,metadata:()=>s,toc:()=>h});const s=JSON.parse('{"id":"tables/actions/scan/index","title":"Scan","description":"Performs a Scan Operation on a Table:","source":"@site/docs/2-tables/2-actions/1-scan/index.md","sourceDirName":"2-tables/2-actions/1-scan","slug":"/tables/actions/scan/","permalink":"/docs/tables/actions/scan/","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"Scan","sidebar_custom_props":{"sidebarActionType":"read"}},"sidebar":"tutorialSidebar","previous":{"title":"Usage","permalink":"/docs/tables/usage/"},"next":{"title":"Query","permalink":"/docs/tables/actions/query/"}}');var i=t(74848),r=t(28453),a=t(11470),l=t(19365);const o={title:"Scan",sidebar_custom_props:{sidebarActionType:"read"}},d="ScanCommand",c={},h=[{value:"Request",id:"request",level:2},{value:"<code>.entities(...)</code>",id:"entities",level:3},{value:"<code>.options(...)</code>",id:"options",level:3},{value:"Examples",id:"examples",level:2},{value:"Response",id:"response",level:2}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"scancommand",children:"ScanCommand"})}),"\n",(0,i.jsxs)(n.p,{children:["Performs a ",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html",children:"Scan Operation"})," on a ",(0,i.jsx)(n.code,{children:"Table"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'\n\nconst scanCommand = PokeTable.build(ScanCommand)\n\nconst params = scanCommand.params()\nconst { Items } = await scanCommand.send()\n"})}),"\n",(0,i.jsx)(n.h2,{id:"request",children:"Request"}),"\n",(0,i.jsx)(n.h3,{id:"entities",children:(0,i.jsx)(n.code,{children:".entities(...)"})}),"\n",(0,i.jsxs)(n.p,{children:["Provides a list of entities to filter the returned items (via the internal ",(0,i.jsx)(n.a,{href:"/docs/entities/internal-attributes/#entity",children:(0,i.jsx)(n.code,{children:"entity"})})," attribute). Also ",(0,i.jsx)(n.strong,{children:"formats"})," them and ",(0,i.jsx)(n.strong,{children:"types"})," the response:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"// \ud83d\udc47 Typed as (Pokemon | Trainer)[]\nconst { Items } = await PokeTable.build(ScanCommand)\n  .entities(PokemonEntity, TrainerEntity)\n  .send()\n"})}),"\n",(0,i.jsx)(n.h3,{id:"options",children:(0,i.jsx)(n.code,{children:".options(...)"})}),"\n",(0,i.jsx)(n.p,{children:"Provides additional options:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .options({\n    consistent: true,\n    limit: 10,\n    ...\n  })\n  .send()\n"})}),"\n",(0,i.jsxs)(n.p,{children:["You can use the ",(0,i.jsx)(n.code,{children:"ScanOptions"})," type to explicitly type an object as a ",(0,i.jsx)(n.code,{children:"ScanCommand"})," options object:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import type { ScanOptions } from 'dynamodb-toolbox/table/actions/scan'\n\nconst scanOptions: ScanOptions<\n  typeof PokeTable,\n  // \ud83d\udc47 Optional entities\n  [typeof PokemonEntity, typeof TrainerEntity]\n> = {\n  consistent: true,\n  limit: 10,\n  ...\n}\n\nconst { Items } = await PokeTable.build(ScanCommand)\n  .options(scanOptions)\n  .send()\n"})}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["It is advised to provide ",(0,i.jsx)(n.code,{children:"entities"})," first as it constrains the ",(0,i.jsx)(n.code,{children:"options"})," type."]})}),"\n",(0,i.jsxs)(n.p,{children:["Available options (see the ",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestParameters",children:"DynamoDB documentation"})," for more details):"]}),"\n",(0,i.jsxs)("table",{children:[(0,i.jsx)("thead",{children:(0,i.jsxs)("tr",{children:[(0,i.jsx)("th",{children:"Cat."}),(0,i.jsx)("th",{children:"Option"}),(0,i.jsx)("th",{children:"Type"}),(0,i.jsx)("th",{children:"Default"}),(0,i.jsx)("th",{children:"Description"})]})}),(0,i.jsxs)("tbody",{children:[(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{rowSpan:"5",align:"center",className:"vertical",children:(0,i.jsx)("b",{children:"General"})}),(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"consistent"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"boolean"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"false"})}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["By default, read operations are ",(0,i.jsx)("b",{children:"eventually"})," consistent (which improves performances and reduces costs).\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Set to ",(0,i.jsx)("code",{children:"true"})," to use ",(0,i.jsx)("b",{children:"strongly"})," consistent reads (unavailable on global secondary indexes)."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"index"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"string"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["The name of a secondary index to scan.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"This index can be any local secondary index or global secondary index."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"capacity"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"CapacityOption"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:'"NONE"'})}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Possible values are ",(0,i.jsx)("code",{children:'"NONE"'}),", ",(0,i.jsx)("code",{children:'"TOTAL"'})," and ",(0,i.jsx)("code",{children:'"INDEXES"'}),"."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"tableName"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"string"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["Overrides the ",(0,i.jsx)("code",{children:"Table"})," name. Mostly useful for ",(0,i.jsx)("a",{href:"https://en.wikipedia.org/wiki/Multitenancy",children:"multitenancy"}),"."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"showEntityAttr"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"boolean"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"false"})}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["Includes the ",(0,i.jsx)("a",{href:"../../entities/internal-attributes#entity",children:(0,i.jsx)("code",{children:"entity"})})," internal attribute in the returned items (even if it is hidden). Useful for easily distinguishing items based on their entities."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{rowSpan:"3",align:"center",className:"vertical",children:(0,i.jsx)("b",{children:"Pagination"})}),(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"limit"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"integer \u2265 1"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["The maximum number of items to evaluate for 1 page.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Note that DynamoDB may return a lower number of items if it reaches the limit of 1MB, or if filters are applied."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"exclusiveStartKey"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"Key"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsxs)("td",{children:["The primary key of the first item that this operation evaluates. Use the ",(0,i.jsx)("code",{children:"LastEvaluatedKey"})," from the previous operation."]})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"maxPages"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"integer \u2265 1"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"1"})}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:['A "meta" option provided by DynamoDB-Toolbox to send multiple requests in a single promise.\n',(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Note that ",(0,i.jsx)("code",{children:"Infinity"})," is a valid (albeit dangerous) option.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"If two pages or more have been fetched, the responses ",(0,i.jsx)("code",{children:"Count"})," and ",(0,i.jsx)("code",{children:"ScannedCount"})," are summed, but the ",(0,i.jsx)("code",{children:"ConsumedCapacity"})," is omitted for the moment."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{rowSpan:"6",align:"center",className:"vertical",children:(0,i.jsx)("b",{children:"Filters"})}),(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"select"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"SelectOption"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["The strategy for returned attributes. You can retrieve all attributes, specific attributes, the count of matching items, or in the case of an index, some or all of the projected attributes.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Possible values are ",(0,i.jsx)("code",{children:'"ALL_ATTRIBUTES"'}),", ",(0,i.jsx)("code",{children:'"ALL_PROJECTED_ATTRIBUTES"'})," (if ",(0,i.jsx)("code",{children:"index"})," is specified), ",(0,i.jsx)("code",{children:'"COUNT"'})," and ",(0,i.jsx)("code",{children:'"SPECIFIC_ATTRIBUTES"'})," (if ",(0,i.jsx)("code",{children:"attributes"})," are specified)"]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"filters"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"Record<string, Condition>"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["For each entity name, a condition that must be satisfied in order for evaluated items of this entity to be returned (improves performances but does not reduce costs).\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Requires ",(0,i.jsx)("a",{href:"#entities",children:(0,i.jsx)("code",{children:"entities"})}),".\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"See the ",(0,i.jsx)("a",{href:"../../entities/actions/parse-condition#building-conditions",children:(0,i.jsx)("code",{children:"ConditionParser"})})," action for more details on how to write conditions."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"filter"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"Condition"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["An untyped condition that must be satisfied in order for evaluated items to be returned (improves performances but does not reduce costs).\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"No effect if ",(0,i.jsx)("a",{href:"#entities",children:(0,i.jsx)("code",{children:"entities"})})," are provided (use ",(0,i.jsx)("code",{children:"filters"})," instead).\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"See the ",(0,i.jsx)("a",{href:"../../entities/actions/parse-condition#building-conditions",children:(0,i.jsx)("code",{children:"ConditionParser"})})," action for more details on how to write conditions."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"attributes"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"string[]"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["To specify a list of attributes to retrieve (improves performances but does not reduce costs).\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Requires ",(0,i.jsx)("a",{href:"#entities",children:(0,i.jsx)("code",{children:"entities"})}),". Paths must be common to all entities.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"See the ",(0,i.jsx)("a",{href:"../../entities/actions/parse-paths#paths",children:(0,i.jsx)("code",{children:"PathParser"})})," action for more details on how to write attribute paths."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"entityAttrFilter"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"boolean"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["If ",(0,i.jsx)("a",{href:"#entities",children:(0,i.jsx)("code",{children:"entities"})})," are specified, introduces a ",(0,i.jsx)("a",{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax",children:"Filter Expression"})," on the ",(0,i.jsx)("a",{href:"../../entities/internal-attributes#entity",children:(0,i.jsx)("code",{children:"entity"})})," internal attribute. Default value is ",(0,i.jsx)("code",{children:"true"})," if all entities use the ",(0,i.jsx)("a",{href:"#entities",children:(0,i.jsx)("code",{children:"entity"})})," internal attribute, ",(0,i.jsx)("code",{children:"false"})," otherwise.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Setting this option to ",(0,i.jsx)("code",{children:"false"})," is useful for querying items that lack the ",(0,i.jsx)("a",{href:"../../entities/internal-attributes#entity",children:(0,i.jsx)("code",{children:"entity"})})," internal attribute (e.g., when migrating to DynamoDB-Toolbox). In such cases, DynamoDB-Toolbox attempts to format the item with each entity until one succeeds.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Note that you can also use ",(0,i.jsx)("a",{href:"https://aws.amazon.com/fr/blogs/developer/middleware-stack-modular-aws-sdk-js/",children:"Middleware Stacks"})," to reintroduce the entity attribute and improve performance."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsxs)("code",{children:["noEntityMatch",(0,i.jsx)("wbr",{}),"Behavior"]})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsxs)("code",{children:["NoEntityMatch",(0,i.jsx)("wbr",{}),"Behavior"]})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:'"THROW"'})}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["If ",(0,i.jsx)("a",{href:"#entities",children:(0,i.jsx)("code",{children:"entities"})})," are specified and ",(0,i.jsx)("code",{children:"entityAttrFilter"})," is ",(0,i.jsx)("code",{children:"false"}),", this option defines the behavior when a returned item fails to be formatted for all entities.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),"Possible values are ",(0,i.jsx)("code",{children:'"THROW"'})," to throw an error and ",(0,i.jsx)("code",{children:'"DISCARD"'})," to discard the item."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{rowSpan:"2",align:"center",className:"vertical",children:(0,i.jsx)("b",{children:"Parallelism"})}),(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"segment"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"integer \u2265 0"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["Identifies an individual segment to be scanned by an application worker (zero-based).\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),(0,i.jsx)("code",{children:"totalSegments"})," must be provided."]})})]}),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("code",{children:"totalSegment"})}),(0,i.jsx)("td",{align:"center",children:(0,i.jsx)("code",{children:"integer \u2265 1"})}),(0,i.jsx)("td",{align:"center",children:"-"}),(0,i.jsx)("td",{children:(0,i.jsxs)(n.p,{children:["Represents the total number of segments into which the Scan operation is divided.\n",(0,i.jsx)("br",{}),(0,i.jsx)("br",{}),(0,i.jsx)("code",{children:"segment"})," must be provided."]})})]})]})]}),"\n",(0,i.jsx)(n.h2,{id:"examples",children:"Examples"}),"\n",(0,i.jsx)(n.admonition,{title:"Examples",type:"note",children:(0,i.jsxs)(a.A,{children:[(0,i.jsx)(l.A,{value:"basic",label:"Basic",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand).send()\n"})})}),(0,i.jsx)(l.A,{value:"single-entity",label:"Entity",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .entities(PokemonEntity)\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"consistent",label:"Consistent",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .options({ consistent: true })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"indexed",label:"On index",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .options({ index: 'my-index' })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"multitenant",label:"Multitenant",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .options({ tableName: `tenant-${tenantId}-pokemons` })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"multi-entity",label:"Multi-Entities",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .entities(TrainerEntity, PokemonEntity)\n  .options({ showEntityAttr: true })\n  .send()\n\nfor (const item of Items) {\n  switch (item.entity) {\n    case 'trainer':\n      // \ud83d\ude4c Typed as Trainer\n      ...\n    case 'pokemon':\n      // \ud83d\ude4c Typed as Pokemon\n      ...\n  }\n}\n"})})}),(0,i.jsx)(l.A,{value:"aborted",label:"Aborted",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const abortController = new AbortController()\nconst abortSignal = abortController.signal\n\nconst { Items } = await PokeTable.build(ScanCommand).send({\n  abortSignal\n})\n\n// \ud83d\udc47 Aborts the command\nabortController.abort()\n"})})})]})}),"\n",(0,i.jsx)(n.admonition,{title:"Paginated",type:"note",children:(0,i.jsxs)(a.A,{children:[(0,i.jsx)(l.A,{value:"paginated",label:"Paginated",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"let lastEvaluatedKey: Record<string, unknown> | undefined\nconst command = PokeTable.build(ScanCommand)\n\ndo {\n  const page = await command\n    .options({ exclusiveStartKey: lastEvaluatedKey })\n    .send()\n\n  // ...do something with page.Items here...\n\n  lastEvaluatedKey = page.LastEvaluatedKey\n} while (lastEvaluatedKey !== undefined)\n"})})}),(0,i.jsx)(l.A,{value:"db",label:"All DB",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  // Retrieve all items from the table (beware of RAM issues!)\n  .options({ maxPages: Infinity })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"entity",label:"All Pokemons",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .entities(PokemonEntity)\n  // Retrieve all pokemons from the table (beware of RAM issues!)\n  .options({ maxPages: Infinity })\n  .send()\n"})})})]})}),"\n",(0,i.jsx)(n.admonition,{title:"Filtered",type:"note",children:(0,i.jsxs)(a.A,{children:[(0,i.jsx)(l.A,{value:"filters",label:"Filters",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .entities(PokemonEntity, TrainerEntity)\n  .options({\n    filters: {\n      POKEMONS: { attr: 'pokeType', eq: 'fire' },\n      TRAINERS: { attr: 'age', gt: 18 }\n    }\n  })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"filter",label:"Filter",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .options({\n    filter: { attr: 'pokeType', eq: 'fire' }\n  })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"attributes",label:"Attributes",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .entities(PokemonEntity)\n  .options({ attributes: ['name', 'type'] })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"entity-attr",label:"Entity Attr.",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .entities(PokemonEntity, TrainerEntity)\n  .options({\n    entityAttrFilter: false,\n    noEntityMatchBehavior: 'DISCARD'\n  })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"count",label:"Count",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Count } = await PokeTable.build(ScanCommand)\n  .options({ select: 'COUNT' })\n  .send()\n"})})})]})}),"\n",(0,i.jsx)(n.admonition,{title:"Parallel",type:"note",children:(0,i.jsxs)(a.A,{children:[(0,i.jsx)(l.A,{value:"segment",label:"Segment",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const { Items } = await PokeTable.build(ScanCommand)\n  .options({\n    segment: 1,\n    totalSegment: 3\n  })\n  .send()\n"})})}),(0,i.jsx)(l.A,{value:"db",label:"All DB (3 threads)",children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const opts = { totalSegment: 3, maxPages: Infinity }\n\nconst [\n  { Items: segment1 = [] },\n  { Items: segment2 = [] },\n  { Items: segment3 = [] }\n] = await Promise.all([\n  PokeTable.build(ScanCommand)\n    .options({ segment: 0, ...opts })\n    .send(),\n  PokeTable.build(ScanCommand)\n    .options({ segment: 1, ...opts })\n    .send(),\n  PokeTable.build(ScanCommand)\n    .options({ segment: 2, ...opts })\n    .send()\n])\n\nconst allItems = [...segment1, ...segment2, ...segment3]\n"})})})]})}),"\n",(0,i.jsx)(n.h2,{id:"response",children:"Response"}),"\n",(0,i.jsxs)(n.p,{children:["The data is returned using the same response syntax as the ",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_ResponseElements",children:"DynamoDB Scan API"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["If ",(0,i.jsx)(n.a,{href:"#entities",children:(0,i.jsx)(n.code,{children:"entities"})})," are provided, the response ",(0,i.jsx)(n.code,{children:"Items"})," are formatted by their respective entities."]}),"\n",(0,i.jsxs)(n.p,{children:["You can use the ",(0,i.jsx)(n.code,{children:"ScanResponse"})," type to explicitly type an object as a ",(0,i.jsx)(n.code,{children:"ScanCommand"})," response object:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import type { ScanResponse } from 'dynamodb-toolbox/table/actions/scan'\n\nconst scanResponse: ScanResponse<\n  typeof PokeTable,\n  // \ud83d\udc47 Optional entities\n  [typeof PokemonEntity],\n  // \ud83d\udc47 Optional options\n  { attributes: ['name', 'type'] }\n> = { Items: ... }\n"})})]})}function x(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}}}]);