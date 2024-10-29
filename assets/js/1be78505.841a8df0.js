"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8714,1774],{62688:(e,t,n)=>{n.r(t),n.d(t,{default:()=>ve});var a=n(96540),o=n(20053),l=n(69024),r=n(17559),c=n(2967),i=n(84142),s=n(32252),d=n(26588),m=n(78511),u=n(21312),b=n(23104),p=n(75062);const h={backToTopButton:"backToTopButton_sjWU",backToTopButtonShow:"backToTopButtonShow_xfvO"};function E(){const{shown:e,scrollToTop:t}=function(e){let{threshold:t}=e;const[n,o]=(0,a.useState)(!1),l=(0,a.useRef)(!1),{startScroll:r,cancelScroll:c}=(0,b.gk)();return(0,b.Mq)(((e,n)=>{let{scrollY:a}=e;const r=n?.scrollY;r&&(l.current?l.current=!1:a>=r?(c(),o(!1)):a<t?o(!1):a+window.innerHeight<document.documentElement.scrollHeight&&o(!0))})),(0,p.$)((e=>{e.location.hash&&(l.current=!0,o(!1))})),{shown:n,scrollToTop:()=>r(0)}}({threshold:300});return a.createElement("button",{"aria-label":(0,u.T)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,o.A)("clean-btn",r.G.common.backToTopButton,h.backToTopButton,e&&h.backToTopButtonShow),type:"button",onClick:t})}var f=n(53109),g=n(56347),v=n(24581),_=n(6342),A=n(23465),C=n(58168);function k(e){return a.createElement("svg",(0,C.A)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}const S={collapseSidebarButton:"collapseSidebarButton_PEFL",collapseSidebarButtonIcon:"collapseSidebarButtonIcon_kv0_"};function T(e){let{onClick:t}=e;return a.createElement("button",{type:"button",title:(0,u.T)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,u.T)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,o.A)("button button--secondary button--outline",S.collapseSidebarButton),onClick:t},a.createElement(k,{className:S.collapseSidebarButtonIcon}))}var N=n(65041),I=n(89532);const x=Symbol("EmptyContext"),y=a.createContext(x);function B(e){let{children:t}=e;const[n,o]=(0,a.useState)(null),l=(0,a.useMemo)((()=>({expandedItem:n,setExpandedItem:o})),[n]);return a.createElement(y.Provider,{value:l},t)}var w=n(41422),L=n(99169),M=n(75489),P=n(92303);function H(e){let{categoryLabel:t,onClick:n}=e;return a.createElement("button",{"aria-label":(0,u.T)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:t}),type:"button",className:"clean-btn menu__caret",onClick:n})}function G(e){let{item:t,onItemClick:n,activePath:l,level:c,index:s,...d}=e;const{items:m,label:u,collapsible:b,className:p,href:h}=t,{docs:{sidebar:{autoCollapseCategories:E}}}=(0,_.p)(),f=function(e){const t=(0,P.A)();return(0,a.useMemo)((()=>e.href?e.href:!t&&e.collapsible?(0,i._o)(e):void 0),[e,t])}(t),g=(0,i.w8)(t,l),v=(0,L.ys)(h,l),{collapsed:A,setCollapsed:k}=(0,w.u)({initialState:()=>!!b&&(!g&&t.collapsed)}),{expandedItem:S,setExpandedItem:T}=function(){const e=(0,a.useContext)(y);if(e===x)throw new I.dV("DocSidebarItemsExpandedStateProvider");return e}(),N=function(e){void 0===e&&(e=!A),T(e?null:s),k(e)};return function(e){let{isActive:t,collapsed:n,updateCollapsed:o}=e;const l=(0,I.ZC)(t);(0,a.useEffect)((()=>{t&&!l&&n&&o(!1)}),[t,l,n,o])}({isActive:g,collapsed:A,updateCollapsed:N}),(0,a.useEffect)((()=>{b&&null!=S&&S!==s&&E&&k(!0)}),[b,S,s,k,E]),a.createElement("li",{className:(0,o.A)(r.G.docs.docSidebarItemCategory,r.G.docs.docSidebarItemCategoryLevel(c),"menu__list-item",{"menu__list-item--collapsed":A},p)},a.createElement("div",{className:(0,o.A)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":v})},a.createElement(M.A,(0,C.A)({className:(0,o.A)("menu__link",{"menu__link--sublist":b,"menu__link--sublist-caret":!h&&b,"menu__link--active":g}),onClick:b?e=>{n?.(t),h?N(!1):(e.preventDefault(),N())}:()=>{n?.(t)},"aria-current":v?"page":void 0,"aria-expanded":b?!A:void 0,href:b?f??"#":f},d),u),h&&b&&a.createElement(H,{categoryLabel:u,onClick:e=>{e.preventDefault(),N()}})),a.createElement(w.N,{lazy:!0,as:"ul",className:"menu__list",collapsed:A},a.createElement(q,{items:m,tabIndex:A?-1:0,onItemClick:n,activePath:l,level:c+1})))}var F=n(16654),W=n(43186);const D={menuExternalLink:"menuExternalLink_NmtK"};function V(e){let{item:t,onItemClick:n,activePath:l,level:c,index:s,...d}=e;const{href:m,label:u,className:b,autoAddBaseUrl:p}=t,h=(0,i.w8)(t,l),E=(0,F.A)(m);return a.createElement("li",{className:(0,o.A)(r.G.docs.docSidebarItemLink,r.G.docs.docSidebarItemLinkLevel(c),"menu__list-item",b),key:u},a.createElement(M.A,(0,C.A)({className:(0,o.A)("menu__link",!E&&D.menuExternalLink,{"menu__link--active":h}),autoAddBaseUrl:p,"aria-current":h?"page":void 0,to:m},E&&{onClick:n?()=>n(t):void 0},d),u,!E&&a.createElement(W.A,null)))}const z={menuHtmlItem:"menuHtmlItem_M9Kj"};function R(e){let{item:t,level:n,index:l}=e;const{value:c,defaultStyle:i,className:s}=t;return a.createElement("li",{className:(0,o.A)(r.G.docs.docSidebarItemLink,r.G.docs.docSidebarItemLinkLevel(n),i&&[z.menuHtmlItem,"menu__list-item"],s),key:l,dangerouslySetInnerHTML:{__html:c}})}function U(e){let{item:t,...n}=e;switch(t.type){case"category":return a.createElement(G,(0,C.A)({item:t},n));case"html":return a.createElement(R,(0,C.A)({item:t},n));default:return a.createElement(V,(0,C.A)({item:t},n))}}function j(e){let{item:t,...n}=e;const o=[t.className],l={};let r=t.label;return t.customProps?.sidebarActionTitle&&o.push("sidebar-action-title"),void 0!==t.customProps?.sidebarActionType&&(r=a.createElement("div",{className:["sidebar-action-item",`sidebar-action-item-${t.customProps.sidebarActionType}`].join(" ")},r),l.padding="1px 6px"),!0===t.customProps?.code&&(r=a.createElement("code",null,r)),a.createElement(U,(0,C.A)({item:{...t,className:o.filter(Boolean).join(" "),label:r}},n,{style:l}))}function K(e){let{items:t,...n}=e;return a.createElement(B,null,t.map(((e,t)=>a.createElement(j,(0,C.A)({key:t,item:e,index:t},n)))))}const q=(0,a.memo)(K),O={menu:"menu_SIkG",menuWithAnnouncementBar:"menuWithAnnouncementBar_GW3s"};function X(e){let{path:t,sidebar:n,className:l}=e;const c=function(){const{isActive:e}=(0,N.Mj)(),[t,n]=(0,a.useState)(e);return(0,b.Mq)((t=>{let{scrollY:a}=t;e&&n(0===a)}),[e]),e&&t}();return a.createElement("nav",{"aria-label":(0,u.T)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,o.A)("menu thin-scrollbar",O.menu,c&&O.menuWithAnnouncementBar,l)},a.createElement("ul",{className:(0,o.A)(r.G.docs.docSidebarMenu,"menu__list")},a.createElement(q,{items:n,activePath:t,level:1})))}const Y="sidebar_njMd",$="sidebarWithHideableNavbar_wUlq",Z="sidebarHidden_VK0M",J="sidebarLogo_isFc";function Q(e){let{path:t,sidebar:n,onCollapse:l,isHidden:r}=e;const{navbar:{hideOnScroll:c},docs:{sidebar:{hideable:i}}}=(0,_.p)();return a.createElement("div",{className:(0,o.A)(Y,c&&$,r&&Z)},c&&a.createElement(A.A,{tabIndex:-1,className:J}),a.createElement(X,{path:t,sidebar:n}),i&&a.createElement(T,{onClick:l}))}const ee=a.memo(Q);var te=n(75600),ne=n(22069);const ae=e=>{let{sidebar:t,path:n}=e;const l=(0,ne.M)();return a.createElement("ul",{className:(0,o.A)(r.G.docs.docSidebarMenu,"menu__list")},a.createElement(q,{items:t,activePath:n,onItemClick:e=>{"category"===e.type&&e.href&&l.toggle(),"link"===e.type&&l.toggle()},level:1}))};function oe(e){return a.createElement(te.GX,{component:ae,props:e})}const le=a.memo(oe);function re(e){const t=(0,v.l)(),n="desktop"===t||"ssr"===t,o="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(ee,e),o&&a.createElement(le,e))}const ce={expandButton:"expandButton_m80_",expandButtonIcon:"expandButtonIcon_BlDH"};function ie(e){let{toggleSidebar:t}=e;return a.createElement("div",{className:ce.expandButton,title:(0,u.T)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,u.T)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t},a.createElement(k,{className:ce.expandButtonIcon}))}const se={docSidebarContainer:"docSidebarContainer_b6E3",docSidebarContainerHidden:"docSidebarContainerHidden_b3ry",sidebarViewport:"sidebarViewport_Xe31"};function de(e){let{children:t}=e;const n=(0,d.t)();return a.createElement(a.Fragment,{key:n?.name??"noSidebar"},t)}function me(e){let{sidebar:t,hiddenSidebarContainer:n,setHiddenSidebarContainer:l}=e;const{pathname:c}=(0,g.zy)(),[i,s]=(0,a.useState)(!1),d=(0,a.useCallback)((()=>{i&&s(!1),!i&&(0,f.O)()&&s(!0),l((e=>!e))}),[l,i]);return a.createElement("aside",{className:(0,o.A)(r.G.docs.docSidebarContainer,se.docSidebarContainer,n&&se.docSidebarContainerHidden),onTransitionEnd:e=>{e.currentTarget.classList.contains(se.docSidebarContainer)&&n&&s(!0)}},a.createElement(de,null,a.createElement("div",{className:(0,o.A)(se.sidebarViewport,i&&se.sidebarViewportHidden)},a.createElement(re,{sidebar:t,path:c,onCollapse:d,isHidden:i}),i&&a.createElement(ie,{toggleSidebar:d}))))}const ue={docMainContainer:"docMainContainer_gTbr",docMainContainerEnhanced:"docMainContainerEnhanced_Uz_u",docItemWrapperEnhanced:"docItemWrapperEnhanced_czyv"};function be(e){let{hiddenSidebarContainer:t,children:n}=e;const l=(0,d.t)();return a.createElement("main",{className:(0,o.A)(ue.docMainContainer,(t||!l)&&ue.docMainContainerEnhanced)},a.createElement("div",{className:(0,o.A)("container padding-top--md padding-bottom--lg",ue.docItemWrapper,t&&ue.docItemWrapperEnhanced)},n))}const pe={docPage:"docPage__5DB",docsWrapper:"docsWrapper_BCFX"};function he(e){let{children:t}=e;const n=(0,d.t)(),[o,l]=(0,a.useState)(!1);return a.createElement(m.A,{wrapperClassName:pe.docsWrapper},a.createElement(E,null),a.createElement("div",{className:pe.docPage},n&&a.createElement(me,{sidebar:n.items,hiddenSidebarContainer:o,setHiddenSidebarContainer:l}),a.createElement(be,{hiddenSidebarContainer:o},t)))}var Ee=n(81774),fe=n(41463);function ge(e){const{versionMetadata:t}=e;return a.createElement(a.Fragment,null,a.createElement(fe.A,{version:t.version,tag:(0,c.tU)(t.pluginId,t.version)}),a.createElement(l.be,null,t.noIndex&&a.createElement("meta",{name:"robots",content:"noindex, nofollow"})))}function ve(e){const{versionMetadata:t}=e,n=(0,i.mz)(e);if(!n)return a.createElement(Ee.default,null);const{docElement:c,sidebarName:m,sidebarItems:u}=n;return a.createElement(a.Fragment,null,a.createElement(ge,e),a.createElement(l.e3,{className:(0,o.A)(r.G.wrapper.docsPages,r.G.page.docsDocPage,e.versionMetadata.className)},a.createElement(s.n,{version:t},a.createElement(d.V,{name:m,items:u},a.createElement(he,null,c)))))}},81774:(e,t,n)=>{n.r(t),n.d(t,{default:()=>c});var a=n(96540),o=n(21312),l=n(69024),r=n(78511);function c(){return a.createElement(a.Fragment,null,a.createElement(l.be,{title:(0,o.T)({id:"theme.NotFound.title",message:"Page Not Found"})}),a.createElement(r.A,null,a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(o.A,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(o.A,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(o.A,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))))}},32252:(e,t,n)=>{n.d(t,{n:()=>r,r:()=>c});var a=n(96540),o=n(89532);const l=a.createContext(null);function r(e){let{children:t,version:n}=e;return a.createElement(l.Provider,{value:n},t)}function c(){const e=(0,a.useContext)(l);if(null===e)throw new o.dV("DocsVersionProvider");return e}}}]);