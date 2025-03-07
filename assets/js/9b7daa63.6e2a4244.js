"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[1708],{28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>r});var s=t(96540);const o={},a=s.createContext(o);function i(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(a.Provider,{value:n},e.children)}},46079:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>l,frontMatter:()=>i,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"entities/actions/parse-paths/index","title":"ParsePaths","description":"Builds a Projection Expression that can be used to filter the returned attributes of a read operation like a GetItem, Query or Scan:","source":"@site/versioned_docs/version-v1/3-entities/4-actions/19-parse-paths/index.md","sourceDirName":"3-entities/4-actions/19-parse-paths","slug":"/entities/actions/parse-paths/","permalink":"/docs/v1/entities/actions/parse-paths/","draft":false,"unlisted":false,"tags":[],"version":"v1","frontMatter":{"title":"ParsePaths","sidebar_custom_props":{"sidebarActionType":"util"}},"sidebar":"tutorialSidebar","previous":{"title":"ParseCondition","permalink":"/docs/v1/entities/actions/parse-condition/"},"next":{"title":"Format","permalink":"/docs/v1/entities/actions/format/"}}');var o=t(74848),a=t(28453);const i={title:"ParsePaths",sidebar_custom_props:{sidebarActionType:"util"}},r="PathParser",d={},c=[{value:"Methods",id:"methods",level:2},{value:"<code>parse(...)</code>",id:"parse",level:3},{value:"<code>toCommandOptions()</code>",id:"tocommandoptions",level:3},{value:"<code>setId(...)</code>",id:"setid",level:3},{value:"Paths",id:"paths",level:2}];function h(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"pathparser",children:"PathParser"})}),"\n",(0,o.jsxs)(n.p,{children:["Builds a ",(0,o.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html",children:"Projection Expression"})," that can be used to filter the returned attributes of a read operation like a ",(0,o.jsx)(n.a,{href:"/docs/v1/entities/actions/get-item/",children:"GetItem"}),", ",(0,o.jsx)(n.a,{href:"/docs/v1/tables/actions/query/",children:"Query"})," or ",(0,o.jsx)(n.a,{href:"/docs/v1/tables/actions/scan/",children:"Scan"}),":"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import { PathParser } from 'dynamodb-toolbox/entity/actions/parsePaths'\n\n// \ud83d\udc47 To be used in DynamoDB commands\nconst { ProjectionExpression, ExpressionAttributeNames } =\n  PokemonEntity.build(PathParser)\n    .parse(['name', 'level'])\n    .toCommandOptions()\n"})}),"\n",(0,o.jsx)(n.h2,{id:"methods",children:"Methods"}),"\n",(0,o.jsx)(n.h3,{id:"parse",children:(0,o.jsx)(n.code,{children:"parse(...)"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"(paths: Path<ENTITY>[]) => PathParser"})})}),"\n",(0,o.jsxs)(n.p,{children:["Parses a list of paths. Throws an ",(0,o.jsx)(n.code,{children:"invalidExpressionAttributePath"})," error if a path is invalid:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"PokemonEntity.build(PathParser).parse(['name', 'level'])\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Note that the ",(0,o.jsx)(n.code,{children:"parse"})," method should only be used once per instance (for now). See ",(0,o.jsx)(n.a,{href:"#paths",children:"Paths"})," for more details on how to write paths."]}),"\n",(0,o.jsx)(n.h3,{id:"tocommandoptions",children:(0,o.jsx)(n.code,{children:"toCommandOptions()"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"() => CommandOptions"})})}),"\n",(0,o.jsxs)(n.p,{children:["Collapses the ",(0,o.jsx)(n.code,{children:"PathParser"})," state to a set of options that can be used in a DynamoDB command:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"const { ProjectionExpression, ExpressionAttributeNames } =\n  PokemonEntity.build(PathParser)\n    .parse(['name', 'level'])\n    .toCommandOptions()\n"})}),"\n",(0,o.jsx)(n.h3,{id:"setid",children:(0,o.jsx)(n.code,{children:"setId(...)"})}),"\n",(0,o.jsx)("p",{style:{marginTop:"-15px"},children:(0,o.jsx)("i",{children:(0,o.jsx)("code",{children:"(id: string) => ConditionParser"})})}),"\n",(0,o.jsx)(n.p,{children:"Adds a prefix to expression attribute keys. Useful to avoid conflicts when using several expressions in a single command:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"PokemonEntity.build(PathParser)\n  .parse(['name', 'level'])\n  .toCommandOptions()\n// => {\n//   ProjectionExpression: '#p_1, #p_2',\n//   ExpressionAttributeNames: {\n//     '#p_1': 'name',\n//     '#p_2': 'level'\n//   }\n// }\n\nPokemonEntity.build(PathParser)\n  .setId('0')\n  .parse(['name', 'level'])\n  .toCommandOptions()\n// => {\n//   ProjectionExpression: '#p0_1, #p0_2',\n//   ExpressionAttributeNames: {\n//     '#p0_1': 'name',\n//     '#p0_2': 'level'\n//   }\n// }\n"})}),"\n",(0,o.jsx)(n.h2,{id:"paths",children:"Paths"}),"\n",(0,o.jsxs)(n.p,{children:["The path syntax from DynamoDB-Toolbox follows the ",(0,o.jsx)(n.a,{href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html",children:"DynamoDB specifications"}),", while making it ",(0,o.jsx)(n.strong,{children:"type-safe"})," and ",(0,o.jsx)(n.strong,{children:"simpler"}),":"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import type {\n  Path,\n  PathIntersection\n} from 'dynamodb-toolbox/entity/actions/parsePaths'\n\ntype PokemonPath = Path<typeof PokemonEntity>\n\nconst namePath: PokemonPath = 'name'\n\nconst deepListPath: PokemonPath = 'pokeTypes[0]'\n\nconst deepMapOrRecordPath: PokemonPath = 'weaknesses.fire'\n// \ud83d\udc47 Similar to\nconst deepMapOrRecordPath: PokemonPath = `weaknesses['fire']`\n\n// \ud83d\udc47 Use this syntax to escape special chars (e.g. in `records`)\nconst deepRecordPath: PokemonPath = `meta['any[char]-you.want!']`\n\n// Path common to both entities\ntype PokemonAndTrainerPath = PathIntersection<\n  [typeof PokemonEntity, typeof TrainerEntity]\n>\nconst commonPath: PokemonAndTrainerPath = 'name'\n"})})]})}function l(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}}}]);