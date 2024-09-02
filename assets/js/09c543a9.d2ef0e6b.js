"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8935],{15680:(e,t,a)=>{a.d(t,{xA:()=>l,yg:()=>u});var n=a(96540);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var m=n.createContext({}),p=function(e){var t=n.useContext(m),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},l=function(e){var t=p(e.components);return n.createElement(m.Provider,{value:t},e.children)},g="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,m=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),g=p(a),c=r,u=g["".concat(m,".").concat(c)]||g[c]||y[c]||o;return a?n.createElement(u,s(s({ref:t},l),{},{components:a})):n.createElement(u,s({ref:t},l))}));function u(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,s=new Array(o);s[0]=c;var i={};for(var m in t)hasOwnProperty.call(t,m)&&(i[m]=t[m]);i.originalType=e,i[g]="string"==typeof e?e:r,s[1]=i;for(var p=2;p<o;p++)s[p]=a[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},61810:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>s,default:()=>y,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var n=a(58168),r=(a(96540),a(15680));const o={title:"Usage"},s="Schema",i={unversionedId:"schemas/usage/index",id:"schemas/usage/index",title:"Usage",description:"A Schema is a list of attributes that describe the items of an Entity:",source:"@site/docs/4-schemas/1-usage/index.md",sourceDirName:"4-schemas/1-usage",slug:"/schemas/usage/",permalink:"/docs/schemas/usage/",draft:!1,tags:[],version:"current",frontMatter:{title:"Usage"},sidebar:"tutorialSidebar",previous:{title:"Spy",permalink:"/docs/entities/actions/spy/"},next:{title:"Warm vs Frozen",permalink:"/docs/schemas/warm-vs-frozen/"}},m={},p=[{value:"Attribute Types",id:"attribute-types",level:2},{value:"Fine-Tuning Attributes",id:"fine-tuning-attributes",level:2}],l={toc:p},g="wrapper";function y(e){let{components:t,...a}=e;return(0,r.yg)(g,(0,n.A)({},l,a,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"schema"},"Schema"),(0,r.yg)("p",null,"A ",(0,r.yg)("inlineCode",{parentName:"p"},"Schema")," is a list of attributes that describe the items of an ",(0,r.yg)("a",{parentName:"p",href:"/docs/entities/usage/"},(0,r.yg)("inlineCode",{parentName:"a"},"Entity")),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { schema } from 'dynamodb-toolbox/schema'\nimport { string } from 'dynamodb-toolbox/attributes/string'\nimport { number } from 'dynamodb-toolbox/attributes/number'\n\nconst pokemonSchema = schema({\n  pokemonId: string().key(),\n  level: number().default(1),\n  pokeType: string()\n    .enum('fire', 'water', 'grass')\n    .optional()\n})\n\nconst PokemonEntity = new Entity({\n  ...,\n  schema: pokemonSchema\n})\n")),(0,r.yg)("p",null,"Schemas always start with a ",(0,r.yg)("strong",{parentName:"p"},"root object"),", listing ",(0,r.yg)("a",{parentName:"p",href:"#attributes"},(0,r.yg)("strong",{parentName:"a"},"attributes"))," by their names."),(0,r.yg)("h2",{id:"attribute-types"},"Attribute Types"),(0,r.yg)("p",null,"Schema attributes can be imported by their ",(0,r.yg)("strong",{parentName:"p"},"dedicated exports"),", or through the ",(0,r.yg)("inlineCode",{parentName:"p"},"attribute")," or ",(0,r.yg)("inlineCode",{parentName:"p"},"attr")," shorthands. For instance, those declarations output the same attribute:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"// \ud83d\udc47 More tree-shakable\nimport { string } from 'dynamodb-toolbox/attributes/string'\n\nconst nameAttr = string()\n\n// \ud83d\udc47 Less tree-shakable, but single import\nimport {\n  attribute,\n  attr\n} from 'dynamodb-toolbox/attributes'\n\nconst nameAttr = attribute.string()\nconst nameAttr = attr.string()\n")),(0,r.yg)("p",null,"Available attribute types are:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/any/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"any")))," - Contains any value"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/null/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"null")))," - Contains ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"null")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/boolean/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"boolean")))," - Contains ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"booleans")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/number/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"number"))),": Contains ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"numbers")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/string/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"string"))),": Contains ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"strings")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/binary/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"binary"))),": Contains ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"binaries")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/set/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"set"))),": Contains ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"sets")," of either ",(0,r.yg)("inlineCode",{parentName:"li"},"number"),", ",(0,r.yg)("inlineCode",{parentName:"li"},"string"),", or ",(0,r.yg)("inlineCode",{parentName:"li"},"binary")," elements"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/list/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"list"))),": Contains ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"lists")," of elements of any type"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/map/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"map"))),": Contains ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"maps"),", i.e. a finite list of key-value pairs, values being child attributes of any type"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/record/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"record"))),": Contains a different kind of ",(0,r.yg)("a",{parentName:"li",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"maps")," - Records differ from ",(0,r.yg)("inlineCode",{parentName:"li"},"maps")," as they have a non-explicit (potentially infinite) range of keys, but with a single value type"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/docs/schemas/any/"},(0,r.yg)("strong",{parentName:"a"},(0,r.yg)("inlineCode",{parentName:"strong"},"anyOf"))),": Contains a finite ",(0,r.yg)("strong",{parentName:"li"},"union")," of possible attributes")),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"DynamoDB-Toolbox attribute types closely mirror the capabilities of DynamoDB. See the ",(0,r.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes"},"DynamoDB documentation")," for more details.")),(0,r.yg)("p",null,"Note that some attribute types can be ",(0,r.yg)("strong",{parentName:"p"},"nested"),", i.e. defined with other attributes. For instance, here's a list of string:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const nameAttr = string()\nconst namesAttr = list(nameAttr)\n")),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"Schemas are a standalone feature of DynamoDB-Toolbox (you can use them separately to ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/actions/parse"},"parse")," and ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/actions/format"},"format")," data for instance) and might even be moved into a separate library one day.")),(0,r.yg)("h2",{id:"fine-tuning-attributes"},"Fine-Tuning Attributes"),(0,r.yg)("p",null,"You can update attribute properties by using ",(0,r.yg)("strong",{parentName:"p"},"dedicated methods")," or by providing ",(0,r.yg)("strong",{parentName:"p"},"option objects"),"."),(0,r.yg)("p",null,"The former provides a ",(0,r.yg)("strong",{parentName:"p"},"slick devX")," with autocomplete and shorthands, while the latter theoretically requires ",(0,r.yg)("strong",{parentName:"p"},"less compute time and memory usage")," (although it should be negligible):"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"// Using methods\nconst pokemonName = string().required('always')\n// Using options\nconst pokemonName = string({ required: 'always' })\n")),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"Attribute methods do not mute the origin attribute, but ",(0,r.yg)("strong",{parentName:"p"},"return a new attribute")," (hence the impact in memory usage).")),(0,r.yg)("p",null,"The output of an attribute method ",(0,r.yg)("strong",{parentName:"p"},"is also an attribute"),", so you can ",(0,r.yg)("strong",{parentName:"p"},"chain methods"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const pokeTypeAttr = string()\n  .required('always')\n  .enum('fire', 'water', 'grass')\n  .savedAs('t')\n")),(0,r.yg)("p",null,"See each ",(0,r.yg)("a",{parentName:"p",href:"#attribute-types"},"attribute type")," documentation (for instance the ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/string/"},(0,r.yg)("inlineCode",{parentName:"a"},"string"))," page) to learn about available options."),(0,r.yg)("p",null,"Finally, note that once ",(0,r.yg)("inlineCode",{parentName:"p"},"schema")," is applied, attributes ",(0,r.yg)("strong",{parentName:"p"},"cannot be modified")," anymore (check the ",(0,r.yg)("a",{parentName:"p",href:"/docs/schemas/warm-vs-frozen/"},"Warm vs Frozen")," section for more details):"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"const pokemonSchema = schema({\n  name: string().required('always'),\n  ...\n})\n\npokemonSchema.attributes.name.required\n// => 'always'\n\npokemonSchema.attributes.name.required('atLeastOnce')\n// => \u274c `required` is not a function\n")))}y.isMDXComponent=!0}}]);