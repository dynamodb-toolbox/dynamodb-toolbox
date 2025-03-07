"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[746],{9389:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>c,metadata:()=>s,toc:()=>u});const s=JSON.parse('{"id":"entities/actions/spy/index","title":"Spy","description":"Enables spying the provided Entity.","source":"@site/versioned_docs/version-v1/3-entities/4-actions/21-spy/index.md","sourceDirName":"3-entities/4-actions/21-spy","slug":"/entities/actions/spy/","permalink":"/docs/v1/entities/actions/spy/","draft":false,"unlisted":false,"tags":[],"version":"v1","frontMatter":{"title":"Spy","sidebar_custom_props":{"sidebarActionType":"util"}},"sidebar":"tutorialSidebar","previous":{"title":"Format","permalink":"/docs/v1/entities/actions/format/"},"next":{"title":"EntityRepository","permalink":"/docs/v1/entities/actions/repository/"}}');var o=t(74848),r=t(28453),i=t(11470),a=t(19365);const c={title:"Spy",sidebar_custom_props:{sidebarActionType:"util"}},l="EntitySpy",d={},u=[{value:"Methods",id:"methods",level:2},{value:"<code>on(...)</code>",id:"on",level:3},{value:"<code>sent(...)</code>",id:"sent",level:3},{value:"<code>reset()</code>",id:"reset",level:3},{value:"<code>restore()</code>",id:"restore",level:3},{value:"Stub Methods",id:"stub-methods",level:2},{value:"<code>resolve(...)</code>",id:"resolve",level:3},{value:"<code>mock(...)</code>",id:"mock",level:3},{value:"<code>reject(...)</code>",id:"reject",level:3},{value:"Inspector methods",id:"inspector-methods",level:2},{value:"<code>count()</code>",id:"count",level:3},{value:"<code>allArgs()</code>",id:"allargs",level:3},{value:"<code>args(...)</code>",id:"args",level:3}];function m(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"entityspy",children:"EntitySpy"})}),"\n",(0,o.jsxs)(n.p,{children:["Enables ",(0,o.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Mock_object",children:"spying"})," the provided ",(0,o.jsx)(n.code,{children:"Entity"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"EntitySpy"})," is useful for writing ",(0,o.jsx)(n.strong,{children:"unit tests"}),", allowing you to stub sendable actions (e.g. ",(0,o.jsx)(n.a,{href:"/docs/v1/entities/actions/get-item/",children:(0,o.jsx)(n.code,{children:"GetItemCommand"})}),", ",(0,o.jsx)(n.a,{href:"/docs/v1/entities/actions/put-item/",children:(0,o.jsx)(n.code,{children:"PutItemCommand"})})," etc.), mock their behavior, and inspect their call history:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import { EntitySpy } from 'dynamodb-toolbox/entity/actions/spy'\n\nconst entitySpy = PokemonEntity.build(EntitySpy)\n\n// \ud83d\ude4c Type-safe!\nentitySpy.on(GetItemCommand).resolve({ Item: pokeMock })\n\nconst { Item } = await PokemonEntity.build(GetItemCommand)\n  .key(key)\n  .options({ consistent: true })\n  .send()\n\nexpect(Item).toStrictEqual(pokeMock) // \u2705\n\nconst getCount = entitySpy.sent(GetItemCommand).count()\nexpect(getCount).toBe(1) // \u2705\n\n// Reset history\nentitySpy.reset()\n\n// Stop spying\nentitySpy.restore()\n"})}),"\n",(0,o.jsx)(n.admonition,{type:"note",children:(0,o.jsx)(n.p,{children:"Non-mocked actions are sent as usual."})}),"\n",(0,o.jsx)(n.h2,{id:"methods",children:"Methods"}),"\n",(0,o.jsx)(n.h3,{id:"on",children:(0,o.jsx)(n.code,{children:"on(...)"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"(Action: SENDABLE_ACTION) => Stub<ENTITY, SENDABLE_ACTION>"})})}),"\n",(0,o.jsxs)(n.p,{children:["Enables stubbing a sendable action (see the ",(0,o.jsx)(n.a,{href:"#stub-methods",children:"stub section"})," section for more details):"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'\n\nconst getStub = entitySpy.on(GetItemCommand)\n"})}),"\n",(0,o.jsx)(n.h3,{id:"sent",children:(0,o.jsx)(n.code,{children:"sent(...)"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"(Action: SENDABLE_ACTION) => Inspector<ENTITY, SENDABLE_ACTION>"})})}),"\n",(0,o.jsxs)(n.p,{children:["Enables inspecting a sendable action call history (see the ",(0,o.jsx)(n.a,{href:"#inspector-methods",children:"inspector section"})," section for more details):"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'\n\nconst getInspector = entitySpy.sent(GetItemCommand)\n"})}),"\n",(0,o.jsx)(n.h3,{id:"reset",children:(0,o.jsx)(n.code,{children:"reset()"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"() => Spy<ENTITY>"})})}),"\n",(0,o.jsx)(n.p,{children:"Reset the call history for all actions:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"expect(getInspector.count()).toBe(1) // \u2705\n\nentitySpy.reset()\n\nexpect(getInspector.count()).toBe(0) // \u2705\n\n// The method returns the spy, so you can chain a new stub:\nentitySpy.reset().on(GetItemCommand).resolve({ Item: ... })\n"})}),"\n",(0,o.jsx)(n.h3,{id:"restore",children:(0,o.jsx)(n.code,{children:"restore()"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"() => void"})})}),"\n",(0,o.jsxs)(n.p,{children:["Stop spying the ",(0,o.jsx)(n.code,{children:"Entity"})," altogether:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"// After this point, the spy is not able to intercept any action\nentitySpy.restore()\n"})}),"\n",(0,o.jsx)(n.h2,{id:"stub-methods",children:"Stub Methods"}),"\n",(0,o.jsx)(n.h3,{id:"resolve",children:(0,o.jsx)(n.code,{children:"resolve(...)"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"(responseMock: Response<ACTION>) => Spy<ENTITY>"})})}),"\n",(0,o.jsxs)(n.p,{children:["Mocks the response of a sendable action ",(0,o.jsx)(n.code,{children:".send()"})," method:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"// \ud83d\ude4c Type-safe!\nentitySpy.on(GetItemCommand).resolve({ Item: pokeMock })\n\nconst { Item } = await PokemonEntity.build(GetItemCommand)\n  .key(key)\n  .send()\n\nexpect(Item).toStrictEqual(pokeMock) // \u2705\n"})}),"\n",(0,o.jsx)(n.h3,{id:"mock",children:(0,o.jsx)(n.code,{children:"mock(...)"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"(mock: ((...args: Args<ACTION>) => Promisable<Response<ACTION>> | undefined)) => Spy<ENTITY>"})})}),"\n",(0,o.jsxs)(n.p,{children:["Mocks the implementation of a sendable action ",(0,o.jsx)(n.code,{children:".send()"})," method (synchronously or asynchronously), enabling you to return dynamic responses:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"// \ud83d\ude4c Type-safe!\nentitySpy.on(GetItemCommand).mock((key, options) => {\n  if (key.pokemonId === 'pikachu') {\n    return { Item: pikachuMock }\n  }\n})\n\nconst { Item } = await PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu' })\n  .send()\n\nexpect(Item).toStrictEqual(pikachuMock) // \u2705\n"})}),"\n",(0,o.jsx)(n.admonition,{type:"info",children:(0,o.jsxs)(n.p,{children:["Returning ",(0,o.jsx)(n.code,{children:"undefined"})," is possible and lets the action proceed as usual."]})}),"\n",(0,o.jsx)(n.h3,{id:"reject",children:(0,o.jsx)(n.code,{children:"reject(...)"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"(error?: string | Error | AwsError) => Spy<ENTITY>"})})}),"\n",(0,o.jsxs)(n.p,{children:["Simulates an error during the execution of a sendable action ",(0,o.jsx)(n.code,{children:".send()"})," method:"]}),"\n",(0,o.jsxs)(i.A,{children:[(0,o.jsx)(a.A,{value:"any",label:"Any error",children:(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"entitySpy.on(GetItemCommand).reject()\n\nawait expect(() =>\n  PokemonEntity.build(GetItemCommand).key(key).send()\n).rejects.toThrow() // \u2705\n"})})}),(0,o.jsx)(a.A,{value:"message",label:"Message",children:(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"entitySpy.on(GetItemCommand).reject('Fake error')\n\nawait expect(() =>\n  PokemonEntity.build(GetItemCommand).key(key).send()\n).rejects.toThrow('Fake error') // \u2705\n"})})}),(0,o.jsx)(a.A,{value:"getter",label:"AWS Error",children:(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"entitySpy.on(GetItemCommand).reject({\n  Name: 'ServiceUnavailable',\n  Code: '503',\n  Message: 'Service is unable to handle request.',\n  $fault: 'server',\n  $service: 'DynamoDB'\n})\n\nawait expect(() =>\n  PokemonEntity.build(GetItemCommand).key(key).send()\n).rejects.toThrow({ Name: 'ServiceUnavailable' }) // \u2705\n"})})})]}),"\n",(0,o.jsxs)(n.admonition,{type:"info",children:[(0,o.jsx)(n.p,{children:"Stub methods return the original spy, so you can easily chain them:"}),(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"entitySpy\n  .on(GetItemCommand)\n  .resolve({ Item: ... })\n  .on(PutItemCommand)\n  .reject('Some error')\n"})})]}),"\n",(0,o.jsx)(n.h2,{id:"inspector-methods",children:"Inspector methods"}),"\n",(0,o.jsx)(n.h3,{id:"count",children:(0,o.jsx)(n.code,{children:"count()"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"() => number"})})}),"\n",(0,o.jsx)(n.p,{children:"Returns the number of times the action was sent:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"entitySpy.on(GetItemCommand).resolve({ Item: pokeMock })\n\nconst { Item } =\n  await PokemonEntity.build(GetItemCommand).send()\n\nconst count = entitySpy.sent(GetItemCommand).count()\n\nexpect(count).toBe(1) // \u2705\n"})}),"\n",(0,o.jsx)(n.h3,{id:"allargs",children:(0,o.jsx)(n.code,{children:"allArgs()"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"() => Args<ACTION>[]"})})}),"\n",(0,o.jsx)(n.p,{children:"Returns the arguments of the sendable action call history:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"entitySpy.on(GetItemCommand).resolve({})\n\nawait PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu' })\n  .options({ consistent: true })\n  .send()\nawait PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'charizard' })\n  .send()\n\nconst allArgs = entitySpy.sent(GetItemCommand).allArgs()\n\nexpect(allArgs).toStrictEqual([\n  // First call\n  [{ pokemonId: 'pikachu' }, { consistent: true }],\n  // Second call\n  [{ pokemoneId: 'charizard' }, {}]\n]) // \u2705\n"})}),"\n",(0,o.jsx)(n.h3,{id:"args",children:(0,o.jsx)(n.code,{children:"args(...)"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"(index: number) => Args<ACTION>"})})}),"\n",(0,o.jsx)(n.p,{children:"Returns the arguments of the n-th action of the call history:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"entitySpy.on(GetItemCommand).resolve({})\n\nawait PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'pikachu' })\n  .options({ consistent: true })\n  .send()\nawait PokemonEntity.build(GetItemCommand)\n  .key({ pokemonId: 'charizard' })\n  .send()\n\nconst firstArgs = entitySpy.sent(GetItemCommand).args(0)\n\nexpect(firstArgs).toStrictEqual([\n  { pokemonId: 'pikachu' },\n  { consistent: true }\n]) // \u2705\n"})}),"\n",(0,o.jsx)(n.admonition,{type:"note",children:(0,o.jsx)(n.p,{children:"Note that the index is zero-based."})})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(m,{...e})}):m(e)}},11470:(e,n,t)=>{t.d(n,{A:()=>I});var s=t(96540),o=t(18215),r=t(23104),i=t(56347),a=t(205),c=t(57485),l=t(31682),d=t(70679);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function m(e){const{values:n,children:t}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:s,default:o}}=e;return{value:n,label:t,attributes:s,default:o}}))}(t);return function(e){const n=(0,l.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function h(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:t}=e;const o=(0,i.W6)(),r=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,c.aZ)(r),(0,s.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(o.location.search);n.set(r,e),o.replace({...o.location,search:n.toString()})}),[r,o])]}function y(e){const{defaultValue:n,queryString:t=!1,groupId:o}=e,r=m(e),[i,c]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=t.find((e=>e.default))??t[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:r}))),[l,u]=p({queryString:t,groupId:o}),[y,x]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[o,r]=(0,d.Dv)(t);return[o,(0,s.useCallback)((e=>{t&&r.set(e)}),[t,r])]}({groupId:o}),j=(()=>{const e=l??y;return h({value:e,tabValues:r})?e:null})();(0,a.A)((()=>{j&&c(j)}),[j]);return{selectedValue:i,selectValue:(0,s.useCallback)((e=>{if(!h({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);c(e),u(e),x(e)}),[u,x,r]),tabValues:r}}var x=t(92303);const j={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var b=t(74848);function g(e){let{className:n,block:t,selectedValue:s,selectValue:i,tabValues:a}=e;const c=[],{blockElementScrollPositionUntilNextRender:l}=(0,r.a_)(),d=e=>{const n=e.currentTarget,t=c.indexOf(n),o=a[t].value;o!==s&&(l(n),i(o))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=c.indexOf(e.currentTarget)+1;n=c[t]??c[0];break}case"ArrowLeft":{const t=c.indexOf(e.currentTarget)-1;n=c[t]??c[c.length-1];break}}n?.focus()};return(0,b.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":t},n),children:a.map((e=>{let{value:n,label:t,attributes:r}=e;return(0,b.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>c.push(e),onKeyDown:u,onClick:d,...r,className:(0,o.A)("tabs__item",j.tabItem,r?.className,{"tabs__item--active":s===n}),children:t??n},n)}))})}function v(e){let{lazy:n,children:t,selectedValue:r}=e;const i=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:(0,o.A)("margin-top--md",e.props.className)}):null}return(0,b.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==r})))})}function f(e){const n=y(e);return(0,b.jsxs)("div",{className:(0,o.A)("tabs-container",j.tabList),children:[(0,b.jsx)(g,{...n,...e}),(0,b.jsx)(v,{...n,...e})]})}function I(e){const n=(0,x.A)();return(0,b.jsx)(f,{...e,children:u(e.children)},String(n))}},19365:(e,n,t)=>{t.d(n,{A:()=>i});t(96540);var s=t(18215);const o={tabItem:"tabItem_Ymn6"};var r=t(74848);function i(e){let{children:n,hidden:t,className:i}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.A)(o.tabItem,i),hidden:t,children:n})}},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>a});var s=t(96540);const o={},r=s.createContext(o);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);