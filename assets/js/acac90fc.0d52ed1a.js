"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3061],{15680:(e,n,t)=>{t.d(n,{xA:()=>u,yg:()=>y});var a=t(96540);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var i=a.createContext({}),c=function(e){var n=a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},u=function(e){var n=c(e.components);return a.createElement(i.Provider,{value:n},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,r=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(t),m=o,y=p["".concat(i,".").concat(m)]||p[m]||d[m]||r;return t?a.createElement(y,l(l({ref:n},u),{},{components:t})):a.createElement(y,l({ref:n},u))}));function y(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var r=t.length,l=new Array(r);l[0]=m;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s[p]="string"==typeof e?e:o,l[1]=s;for(var c=2;c<r;c++)l[c]=t[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},19365:(e,n,t)=>{t.d(n,{A:()=>l});var a=t(96540),o=t(20053);const r={tabItem:"tabItem_Ymn6"};function l(e){let{children:n,hidden:t,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,o.A)(r.tabItem,l),hidden:t},n)}},11470:(e,n,t)=>{t.d(n,{A:()=>N});var a=t(58168),o=t(96540),r=t(20053),l=t(23104),s=t(72681),i=t(57485),c=t(31682),u=t(89466);function p(e){return function(e){var n;return(null==(n=o.Children.map(e,(e=>{if(!e||(0,o.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})))?void 0:n.filter(Boolean))??[]}(e).map((e=>{let{props:{value:n,label:t,attributes:a,default:o}}=e;return{value:n,label:t,attributes:a,default:o}}))}function d(e){const{values:n,children:t}=e;return(0,o.useMemo)((()=>{const e=n??p(t);return function(e){const n=(0,c.X)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function m(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function y(e){let{queryString:n=!1,groupId:t}=e;const a=(0,s.W6)(),r=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,i.aZ)(r),(0,o.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(a.location.search);n.set(r,e),a.replace({...a.location,search:n.toString()})}),[r,a])]}function g(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,r=d(e),[l,s]=(0,o.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const a=t.find((e=>e.default))??t[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:r}))),[i,c]=y({queryString:t,groupId:a}),[p,g]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,r]=(0,u.Dv)(t);return[a,(0,o.useCallback)((e=>{t&&r.set(e)}),[t,r])]}({groupId:a}),b=(()=>{const e=i??p;return m({value:e,tabValues:r})?e:null})();(0,o.useLayoutEffect)((()=>{b&&s(b)}),[b]);return{selectedValue:l,selectValue:(0,o.useCallback)((e=>{if(!m({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);s(e),c(e),g(e)}),[c,g,r]),tabValues:r}}var b=t(92303);const h={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function f(e){let{className:n,block:t,selectedValue:s,selectValue:i,tabValues:c}=e;const u=[],{blockElementScrollPositionUntilNextRender:p}=(0,l.a_)(),d=e=>{const n=e.currentTarget,t=u.indexOf(n),a=c[t].value;a!==s&&(p(n),i(a))},m=e=>{var n;let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=u.indexOf(e.currentTarget)+1;t=u[n]??u[0];break}case"ArrowLeft":{const n=u.indexOf(e.currentTarget)-1;t=u[n]??u[u.length-1];break}}null==(n=t)||n.focus()};return o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":t},n)},c.map((e=>{let{value:n,label:t,attributes:l}=e;return o.createElement("li",(0,a.A)({role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,key:n,ref:e=>u.push(e),onKeyDown:m,onClick:d},l,{className:(0,r.A)("tabs__item",h.tabItem,null==l?void 0:l.className,{"tabs__item--active":s===n})}),t??n)})))}function v(e){let{lazy:n,children:t,selectedValue:a}=e;const r=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=r.find((e=>e.props.value===a));return e?(0,o.cloneElement)(e,{className:"margin-top--md"}):null}return o.createElement("div",{className:"margin-top--md"},r.map(((e,n)=>(0,o.cloneElement)(e,{key:n,hidden:e.props.value!==a}))))}function S(e){const n=g(e);return o.createElement("div",{className:(0,r.A)("tabs-container",h.tabList)},o.createElement(f,(0,a.A)({},e,n)),o.createElement(v,(0,a.A)({},e,n)))}function N(e){const n=(0,b.A)();return o.createElement(S,(0,a.A)({key:String(n)},e))}},61304:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>i,default:()=>y,frontMatter:()=>s,metadata:()=>c,toc:()=>p});var a=t(58168),o=(t(96540),t(15680)),r=t(11470),l=t(19365);const s={title:"Spy",sidebar_custom_props:{sidebarActionType:"util"}},i="TableSpy",c={unversionedId:"tables/actions/spy/index",id:"tables/actions/spy/index",title:"Spy",description:"Enables spying the provided Table.",source:"@site/docs/2-tables/2-actions/8-spy/index.md",sourceDirName:"2-tables/2-actions/8-spy",slug:"/tables/actions/spy/",permalink:"/docs/tables/actions/spy/",draft:!1,tags:[],version:"current",frontMatter:{title:"Spy",sidebar_custom_props:{sidebarActionType:"util"}},sidebar:"tutorialSidebar",previous:{title:"Parse Primary Key",permalink:"/docs/tables/actions/parse-primary-key/"},next:{title:"Usage",permalink:"/docs/entities/usage/"}},u={},p=[{value:"Methods",id:"methods",level:2},{value:"<code>on(...)</code>",id:"on",level:3},{value:"<code>sent(...)</code>",id:"sent",level:3},{value:"<code>reset()</code>",id:"reset",level:3},{value:"<code>restore()</code>",id:"restore",level:3},{value:"Stub Methods",id:"stub-methods",level:2},{value:"<code>resolve(...)</code>",id:"resolve",level:3},{value:"<code>mock(...)</code>",id:"mock",level:3},{value:"<code>reject(...)</code>",id:"reject",level:3},{value:"Inspector methods",id:"inspector-methods",level:2},{value:"<code>count()</code>",id:"count",level:3},{value:"<code>allArgs()</code>",id:"allargs",level:3},{value:"<code>args(...)</code>",id:"args",level:3}],d={toc:p},m="wrapper";function y(e){let{components:n,...t}=e;return(0,o.yg)(m,(0,a.A)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"tablespy"},"TableSpy"),(0,o.yg)("p",null,"Enables ",(0,o.yg)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Mock_object"},"spying")," the provided ",(0,o.yg)("inlineCode",{parentName:"p"},"Table"),"."),(0,o.yg)("p",null,(0,o.yg)("inlineCode",{parentName:"p"},"TableSpy")," is useful for writing ",(0,o.yg)("strong",{parentName:"p"},"unit tests"),", allowing you to stub sendable actions (e.g. ",(0,o.yg)("a",{parentName:"p",href:"/docs/tables/actions/scan/"},(0,o.yg)("inlineCode",{parentName:"a"},"Scans"))," and ",(0,o.yg)("a",{parentName:"p",href:"/docs/tables/actions/query/"},(0,o.yg)("inlineCode",{parentName:"a"},"Query")),"), mock their behavior, and inspect their call history:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { TableSpy } from 'dynamodb-toolbox/table/actions/spy'\n\nconst tableSpy = PokeTable.build(TableSpy)\n\n// \ud83d\ude4c Type-safe!\ntableSpy.on(ScanCommand).resolve({ Items: mockedItems })\n\nconst { Items } = await PokeTable.build(ScanCommand)\n  .options({ consistent: true })\n  .send()\n\nexpect(Items).toStrictEqual(mockedItems) // \u2705\n\nconst scanCount = tableSpy.sent(ScanCommand).count()\nexpect(scanCount).toBe(1) // \u2705\n\n// Reset history\ntableSpy.reset()\n\n// Stop spying\ntableSpy.restore()\n")),(0,o.yg)("admonition",{type:"note"},(0,o.yg)("p",{parentName:"admonition"},"Non-mocked actions are sent as usual.")),(0,o.yg)("h2",{id:"methods"},"Methods"),(0,o.yg)("h3",{id:"on"},(0,o.yg)("inlineCode",{parentName:"h3"},"on(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"(Action: SENDABLE_ACTION) => Stub<TABLE, SENDABLE_ACTION>"))),(0,o.yg)("p",null,"Enables stubbing a sendable action (see the ",(0,o.yg)("a",{parentName:"p",href:"#stub-methods"},"stub section")," section for more details):"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'\n\nconst scanStub = tableSpy.on(ScanCommand)\n")),(0,o.yg)("h3",{id:"sent"},(0,o.yg)("inlineCode",{parentName:"h3"},"sent(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"(Action: SENDABLE_ACTION) => Inspector<TABLE, SENDABLE_ACTION>"))),(0,o.yg)("p",null,"Enables inspecting a sendable action call history (see the ",(0,o.yg)("a",{parentName:"p",href:"#inspector-methods"},"inspector section")," section for more details):"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'\n\nconst scanInspector = tableSpy.sent(ScanCommand)\n")),(0,o.yg)("h3",{id:"reset"},(0,o.yg)("inlineCode",{parentName:"h3"},"reset()")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"() => Spy<TABLE>"))),(0,o.yg)("p",null,"Reset the call history for all actions:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"expect(scanInspector.count()).toBe(1) // \u2705\n\ntableSpy.reset()\n\nexpect(scanInspector.count()).toBe(0) // \u2705\n\n// The method returns the spy, so you can chain a new stub:\ntableSpy.reset().on(ScanCommand).resolve({ Items: [...] })\n")),(0,o.yg)("h3",{id:"restore"},(0,o.yg)("inlineCode",{parentName:"h3"},"restore()")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"() => void"))),(0,o.yg)("p",null,"Stop spying the ",(0,o.yg)("inlineCode",{parentName:"p"},"Table")," altogether:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"// After this point, the spy is not able to intercept any action\ntableSpy.restore()\n")),(0,o.yg)("h2",{id:"stub-methods"},"Stub Methods"),(0,o.yg)("h3",{id:"resolve"},(0,o.yg)("inlineCode",{parentName:"h3"},"resolve(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"(responseMock: Response<ACTION>) => Spy<TABLE>"))),(0,o.yg)("p",null,"Mocks the response of a sendable action ",(0,o.yg)("inlineCode",{parentName:"p"},".send()")," method:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"// \ud83d\ude4c Type-safe!\ntableSpy.on(ScanCommand).resolve({ Items: mockedItems })\n\nconst { Items } = await PokeTable.build(ScanCommand).send()\n\nexpect(Items).toStrictEqual(mockedItems) // \u2705\n")),(0,o.yg)("h3",{id:"mock"},(0,o.yg)("inlineCode",{parentName:"h3"},"mock(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"(mock: ((...args: Args<ACTION>) => Promisable<Response<ACTION>> | undefined)) => Spy<TABLE>"))),(0,o.yg)("p",null,"Mocks the implementation of a sendable action ",(0,o.yg)("inlineCode",{parentName:"p"},".send()")," method (synchronously or asynchronously), enabling you to return dynamic responses:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"// \ud83d\ude4c Type-safe!\ntableSpy.on(ScanCommand).mock((entities, options) => {\n  if (\n    entities.length === 1 &&\n    entities[0] === PokemonEntity\n  ) {\n    return { Items: mockedPokemons }\n  }\n})\n\nconst { Items } = await PokeTable.build(ScanCommand)\n  .entities(PokemonEntity)\n  .send()\n\nexpect(Items).toStrictEqual(mockedPokemons) // \u2705\n")),(0,o.yg)("admonition",{type:"info"},(0,o.yg)("p",{parentName:"admonition"},"Returning ",(0,o.yg)("inlineCode",{parentName:"p"},"undefined")," is possible and lets the action proceed as usual.")),(0,o.yg)("h3",{id:"reject"},(0,o.yg)("inlineCode",{parentName:"h3"},"reject(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"(error?: string | Error | AwsError) => Spy<TABLE>"))),(0,o.yg)("p",null,"Simulates an error during the execution of a sendable action ",(0,o.yg)("inlineCode",{parentName:"p"},".send()")," method:"),(0,o.yg)(r.A,{mdxType:"Tabs"},(0,o.yg)(l.A,{value:"any",label:"Any error",mdxType:"TabItem"},(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"tableSpy.on(ScanCommand).reject()\n\nawait expect(() =>\n  PokeTable.build(ScanCommand).send()\n).rejects.toThrow() // \u2705\n"))),(0,o.yg)(l.A,{value:"message",label:"Message",mdxType:"TabItem"},(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"tableSpy.on(ScanCommand).reject('Fake error')\n\nawait expect(() =>\n  PokeTable.build(ScanCommand).send()\n).rejects.toThrow('Fake error') // \u2705\n"))),(0,o.yg)(l.A,{value:"getter",label:"AWS Error",mdxType:"TabItem"},(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"tableSpy.on(ScanCommand).reject({\n  Name: 'ServiceUnavailable',\n  Code: '503',\n  Message: 'Service is unable to handle request.',\n  $fault: 'server',\n  $service: 'DynamoDB'\n})\n\nawait expect(() =>\n  PokeTable.build(ScanCommand).send()\n).rejects.toThrow({ Name: 'ServiceUnavailable' }) // \u2705\n")))),(0,o.yg)("admonition",{type:"info"},(0,o.yg)("p",{parentName:"admonition"},"Stub methods return the original spy, so you can easily chain them:"),(0,o.yg)("pre",{parentName:"admonition"},(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"tableSpy\n  .on(ScanCommand)\n  .resolve({ Items: [...] })\n  .on(QueryCommand)\n  .reject('Some error')\n"))),(0,o.yg)("h2",{id:"inspector-methods"},"Inspector methods"),(0,o.yg)("h3",{id:"count"},(0,o.yg)("inlineCode",{parentName:"h3"},"count()")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"() => number"))),(0,o.yg)("p",null,"Returns the number of times the action was sent:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"tableSpy.on(ScanCommand).resolve({ Items: mockedItems })\n\nconst { Items } = await PokeTable.build(ScanCommand).send()\n\nconst count = tableSpy.sent(ScanCommand).count()\n\nexpect(count).toBe(1) // \u2705\n")),(0,o.yg)("h3",{id:"allargs"},(0,o.yg)("inlineCode",{parentName:"h3"},"allArgs()")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"() => Args<ACTION>[]"))),(0,o.yg)("p",null,"Returns the arguments of the sendable action call history:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"tableSpy.on(ScanCommand).resolve({})\n\nawait PokeTable.build(ScanCommand)\n  .entities(PokemonEntity)\n  .options({ consistent: true })\n  .send()\nawait PokeTable.build(ScanCommand)\n  .entities(TrainerEntity)\n  .send()\n\nconst allArgs = tableSpy.sent(ScanCommand).allArgs()\n\nexpect(allArgs).toStrictEqual([\n  // First call\n  [PokemonEntity, { consistent: true }],\n  // Second call\n  [TrainerEntity, {}]\n]) // \u2705\n")),(0,o.yg)("h3",{id:"args"},(0,o.yg)("inlineCode",{parentName:"h3"},"args(...)")),(0,o.yg)("p",{style:{marginTop:"-15px"}},(0,o.yg)("i",null,(0,o.yg)("code",null,"(index: number) => Args<ACTION>"))),(0,o.yg)("p",null,"Returns the arguments of the n-th action of the call history:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"tableSpy.on(ScanCommand).resolve({})\n\nawait PokeTable.build(ScanCommand)\n  .entities(PokemonEntity)\n  .options({ consistent: true })\n  .send()\nawait PokeTable.build(ScanCommand)\n  .entities(TrainerEntity)\n  .send()\n\nconst firstArgs = tableSpy.sent(ScanCommand).args(0)\n\nexpect(firstArgs).toStrictEqual([\n  PokemonEntity,\n  { consistent: true }\n]) // \u2705\n")),(0,o.yg)("admonition",{type:"note"},(0,o.yg)("p",{parentName:"admonition"},"Note that the index is zero-based.")))}y.isMDXComponent=!0}}]);