import{F as e,H as t,N as n,O as r,P as i,R as a,c as o,g as s,h as c,j as l,l as u,m as d,n as f,o as p,ot as m,s as h,u as g,wt as _,xt as v}from"./runtime-core.esm-bundler-0R4Af90j.js";import{t as y}from"./loader-circle-EZoXhXR7.js";import{O as b,_ as x,i as S,n as C,r as w,s as T,x as E}from"./index-C9KqkUV-.js";import{t as D}from"./sleep-BiJfO1hT.js";var O=`shadow-[0_3px_10px_rgb(0,0,0,0.2)]`,k=s({__name:`Card`,props:{class:{type:[Boolean,null,String,Object,Array]}},setup(e){let t=e,n=`
[--card-spacing:calc(var(--spacing)*6)]
flex flex-col bg-card rounded-xl border overflow-hidden
${O}
`;return(e,r)=>(l(),g(`div`,{"data-slot":`card`,class:v(m(S)(n,t.class))},[i(e.$slots,`default`)],2))}}),A=`flex flex-col gap-1.5 px-(--card-spacing) mt-(--card-spacing)`,j=s({__name:`CardHeader`,props:{class:{type:[Boolean,null,String,Object,Array]}},setup(e){let t=e;return(e,n)=>(l(),g(`div`,{"data-slot":`card-header`,class:v(m(S)(A,t.class))},[i(e.$slots,`default`)],2))}}),M=`font-semibold`,N=s({__name:`CardTitle`,props:{class:{type:[Boolean,null,String,Object,Array]}},setup(e){let t=e;return(e,n)=>(l(),g(`div`,{"data-slot":`card-title`,class:v(m(S)(M,t.class))},[i(e.$slots,`default`)],2))}}),P=`text-muted text-sm`,F=s({__name:`CardDescription`,props:{class:{type:[Boolean,null,String,Object,Array]}},setup(e){let t=e;return(e,n)=>(l(),g(`div`,{"data-slot":`card-description`,class:v(m(S)(P,t.class))},[i(e.$slots,`default`)],2))}}),I=`px-(--card-spacing) my-(--card-spacing)`,L=s({__name:`CardContent`,props:{class:{type:[Boolean,null,String,Object,Array]}},setup(e){let t=e;return(e,n)=>(l(),g(`div`,{"data-slot":`card-content`,class:v(m(S)(I,t.class))},[i(e.$slots,`default`)],2))}}),R=`flex items-center justify-center px-(--card-spacing) mb-(--card-spacing) gap-2`,z=s({__name:`CardFooter`,props:{class:{type:[Boolean,null,String,Object,Array]}},setup(e){let t=e;return(e,n)=>(l(),g(`div`,{"data-slot":`card-footer`,class:v(m(S)(R,t.class))},[i(e.$slots,`default`)],2))}}),B=x({slots:{base:`
    rounded-md font-semibold inline-flex items-center 
    disabled:cursor-not-allowed disabled:opacity-75
    aria-disabled:cursor-not-allowed aria-disabled:opacity-75 
    transition-colors select-none
    `,label:`truncate`,leadingIcon:`shrink-0`,trailingIcon:`shrink-0 `},variants:{fieldGroup:{horizontal:`not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]`,vertical:`not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]`},color:{primary:``,secondary:``,success:``,info:``,warning:``,error:``,neutral:``},variant:{solid:``,outline:``,soft:``,subtle:``,ghost:``,link:``},size:{xs:{base:`px-2 py-1 text-xs gap-1`,leadingIcon:`size-4`,trailingIcon:`size-4`},sm:{base:`px-2.5 py-1.5 text-xs gap-1.5`,leadingIcon:`size-4`,trailingIcon:`size-4`},md:{base:`px-2.5 py-1.5 text-sm gap-1.5`,leadingIcon:`size-5`,trailingIcon:`size-5`},lg:{base:`px-3 py-2 text-sm gap-2`,leadingIcon:`size-5`,leadingAvatarSize:`2xs`,trailingIcon:`size-5`},xl:{base:`px-3 py-2 text-base gap-2`,leadingIcon:`size-6`,trailingIcon:`size-6`}},block:{true:{base:`w-full justify-center`,trailingIcon:`ms-auto`}},square:{true:``},leading:{true:``},trailing:{true:``},loading:{true:``},active:{true:{base:``},false:{base:``}}},compoundVariants:[{color:`primary`,variant:`solid`,class:`
      text-white
      bg-primary
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-primary)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-primary)_calc(l_+_0.1)_c_h)] 
      hover:bg-primary/85
      focus-visible:ring-[3px]
      focus-visible:ring-primary/50
      active:bg-primary/85
      disabled:bg-primary
      aria-disabled:bg-primary `},{color:`primary`,variant:`outline`,class:`
      text-primary 
      outline -outline-offset-1 outline-primary   
      hover:bg-primary 
      hover:outline-[oklch(from_var(--ui-primary)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-primary)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-primary/50
      active:bg-primary
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `},{color:`primary`,variant:`soft`,class:`
      text-primary bg-primary/10 hover:bg-primary/15
      active:bg-primary/15 outline-primary/25 
      focus-visible:outline-3 disabled:bg-primary/10
      aria-disabled:bg-primary/10
      `},{color:`primary`,variant:`subtle`,class:`text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary`},{color:`primary`,variant:`ghost`,class:`text-primary hover:bg-primary/10 active:bg-primary/10 outline-primary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`},{color:`primary`,variant:`link`,class:`text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary outline-primary/25 focus-visible:outline-3`},{color:`secondary`,variant:`solid`,class:`
      text-white
      bg-secondary
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-secondary)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-secondary)_calc(l_+_0.1)_c_h)] 
      hover:bg-secondary/85
      focus-visible:ring-[3px]
      focus-visible:ring-secondary/50
      active:bg-secondary/85
      disabled:bg-secondary
      aria-disabled:bg-secondary `},{color:`secondary`,variant:`outline`,class:`
      text-secondary 
      outline -outline-offset-1 outline-secondary   
      hover:bg-secondary 
      hover:outline-[oklch(from_var(--ui-secondary)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-secondary)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-secondary/50
      active:bg-secondary
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `},{color:`secondary`,variant:`soft`,class:`text-secondary bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 outline-secondary/25 focus-visible:outline-3 disabled:bg-secondary/10 aria-disabled:bg-secondary/10`},{color:`secondary`,variant:`subtle`,class:`text-secondary ring ring-inset ring-secondary/25 bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary`},{color:`secondary`,variant:`ghost`,class:`text-secondary hover:bg-secondary/10 active:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`},{color:`secondary`,variant:`link`,class:`text-secondary hover:text-secondary/75 active:text-secondary/75 disabled:text-secondary aria-disabled:text-secondary outline-secondary/25 focus-visible:outline-3`},{color:`success`,variant:`solid`,class:`
      text-white
      bg-success
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-success)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-success)_calc(l_+_0.1)_c_h)] 
      hover:bg-success/85
      focus-visible:ring-[3px]
      focus-visible:ring-success/50
      active:bg-success/85
      disabled:bg-success
      aria-disabled:bg-success `},{color:`success`,variant:`outline`,class:`
      text-success 
      outline -outline-offset-1 outline-success   
      hover:bg-success 
      hover:outline-[oklch(from_var(--ui-success)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-success)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-success/50
      active:bg-success
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `},{color:`success`,variant:`soft`,class:`text-success bg-success/10 hover:bg-success/15 active:bg-success/15 outline-success/25 focus-visible:outline-3 disabled:bg-success/10 aria-disabled:bg-success/10`},{color:`success`,variant:`subtle`,class:`text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 outline-success/25 focus-visible:outline-3 focus-visible:ring-success`},{color:`success`,variant:`ghost`,class:`text-success hover:bg-success/10 active:bg-success/10 outline-success/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`},{color:`success`,variant:`link`,class:`text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success outline-success/25 focus-visible:outline-3`},{color:`info`,variant:`solid`,class:`
      text-white
      bg-info
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-info)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-info)_calc(l_+_0.1)_c_h)] 
      hover:bg-info/85
      focus-visible:ring-[3px]
      focus-visible:ring-info/50
      active:bg-info/85
      disabled:bg-info
      aria-disabled:bg-info `},{color:`info`,variant:`outline`,class:`
      text-info 
      outline -outline-offset-1 outline-info   
      hover:bg-info 
      hover:outline-[oklch(from_var(--ui-info)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-info)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-info/50
      active:bg-info
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `},{color:`info`,variant:`soft`,class:`text-info bg-info/10 hover:bg-info/15 active:bg-info/15 outline-info/25 focus-visible:outline-3 disabled:bg-info/10 aria-disabled:bg-info/10`},{color:`info`,variant:`subtle`,class:`text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 outline-info/25 focus-visible:outline-3 focus-visible:ring-info`},{color:`info`,variant:`ghost`,class:`text-info hover:bg-info/10 active:bg-info/10 outline-info/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`},{color:`info`,variant:`link`,class:`text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info outline-info/25 focus-visible:outline-3`},{color:`warning`,variant:`solid`,class:`
      text-white
      bg-warning
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-warning)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-warning)_calc(l_+_0.1)_c_h)] 
      hover:bg-warning/85
      focus-visible:ring-[3px]
      focus-visible:ring-warning/50
      active:bg-warning/85
      disabled:bg-warning
      aria-disabled:bg-warning `},{color:`warning`,variant:`outline`,class:`
      text-warning 
      outline -outline-offset-1 outline-warning   
      hover:bg-warning 
      hover:outline-[oklch(from_var(--ui-warning)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-warning)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-warning/50
      active:bg-warning
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `},{color:`warning`,variant:`soft`,class:`text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 outline-warning/25 focus-visible:outline-3 disabled:bg-warning/10 aria-disabled:bg-warning/10`},{color:`warning`,variant:`subtle`,class:`text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning`},{color:`warning`,variant:`ghost`,class:`text-warning hover:bg-warning/10 active:bg-warning/10 outline-warning/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`},{color:`warning`,variant:`link`,class:`text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning outline-warning/25 focus-visible:outline-3`},{color:`error`,variant:`solid`,class:`
      text-white
      bg-error
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-error)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-error)_calc(l_+_0.1)_c_h)] 
      hover:bg-error/85
      focus-visible:ring-[3px]
      focus-visible:ring-error/50
      active:bg-error/85
      disabled:bg-error
      aria-disabled:bg-error `},{color:`error`,variant:`outline`,class:`
      text-error 
      outline -outline-offset-1 outline-error   
      hover:bg-error 
      hover:outline-[oklch(from_var(--ui-error)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-error)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-error/50
      active:bg-error
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `},{color:`error`,variant:`soft`,class:`text-error bg-error/10 hover:bg-error/15 active:bg-error/15 outline-error/25 focus-visible:outline-3 disabled:bg-error/10 aria-disabled:bg-error/10`},{color:`error`,variant:`subtle`,class:`text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 outline-error/25 focus-visible:outline-3 focus-visible:ring-error`},{color:`error`,variant:`ghost`,class:`text-error hover:bg-error/10 active:bg-error/10 outline-error/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`},{color:`error`,variant:`link`,class:`text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error outline-error/25 focus-visible:outline-3`},{color:`neutral`,variant:`solid`,class:`
      text-inverted
      bg-[oklch(from_var(--ui-bg-inverted)_calc(l_+_0.15)_c_h)] dark:bg-[oklch(from_var(--ui-bg-inverted)_calc(l_-_0.025)_c_h)]
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-bg-inverted)_calc(l_-_0.1)_c_h)]
      dark:outline-white
      hover:bg-inverted/75
      focus-visible:ring-[3px]
      focus-visible:ring-inverted/50
      active:bg-inverted/75
      disabled:bg-inverted
      aria-disabled:bg-inverted
      `},{color:`neutral`,variant:`outline`,class:`
      text-highlighted
      outline -outline-offset-1 outline-inverted  
      hover:bg-[oklch(from_var(--ui-bg-inverted)_calc(l_+_0.15)_c_h)]
      dark:hover:bg-[oklch(from_var(--ui-bg-inverted)_calc(l_-_0.025)_c_h)]
      hover:outline-[oklch(from_var(--ui-bg-inverted)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-white
      hover:text-inverted
      focus-visible:ring-[3px]
      focus-visible:ring-inverted/50
      active:bg-inverted
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `},{color:`neutral`,variant:`soft`,class:`text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 outline-inverted/25 focus-visible:outline-3 disabled:bg-elevated aria-disabled:bg-elevated`},{color:`neutral`,variant:`subtle`,class:`ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted`},{color:`neutral`,variant:`ghost`,class:`text-default hover:bg-elevated active:bg-elevated outline-inverted/25 focus-visible:outline-3 hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent`},{color:`neutral`,variant:`link`,class:`text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted outline-inverted/25 focus-visible:outline-3`},{size:`xs`,square:!0,class:`p-1`},{size:`sm`,square:!0,class:`p-1.5`},{size:`md`,square:!0,class:`p-1.5`},{size:`lg`,square:!0,class:`p-2`},{size:`xl`,square:!0,class:`p-2`},{loading:!0,leading:!0,class:{leadingIcon:`animate-spin`}},{loading:!0,leading:!1,trailing:!0,class:{trailingIcon:`animate-spin`}}],defaultVariants:{color:`primary`,variant:`solid`,size:`md`}}),V=[`role`],H=[`href`,`aria-disabled`,`role`,`tabindex`],U=[`type`,`disabled`,`aria-busy`],W=s({__name:`index`,props:{to:{},href:{},block:{type:Boolean},class:{},color:{default:`primary`},disabled:{type:Boolean},label:{},leadingIcon:{},loading:{type:Boolean},size:{default:`md`},square:{type:Boolean},trailing:{type:Boolean,default:!1},trailingIcon:{},type:{default:`button`},ui:{},variant:{default:`solid`}},setup(n){let r=a(),s=p(()=>n.to!==void 0&&n.to!==null&&n.to!==``),c=p(()=>typeof n.href==`string`&&n.href!==``),d=p(()=>n.loading===!0&&!c.value&&!s.value),f=p(()=>{let e=B({color:n.color,variant:n.variant,size:n.size,loading:d.value,block:n.block,square:n.square||!r.default&&!n.label,leading:!n.trailing,trailing:n.trailing}),t={};for(let r of Object.keys(e)){let i=e[r];t[r]=e=>{let t=n.ui?.[r],a=e?.class;return i({class:[t,a]})}}return t}),h=e=>{n.disabled===!0&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation())};return(r,a)=>n.to!==void 0&&s.value&&!n.disabled?(l(),o(m(E),{key:0,to:n.to,"data-slot":`button`,"aria-disabled":n.disabled||void 0,tabindex:n.disabled?-1:void 0,class:v(f.value.base({class:n.class})),onClickCapture:h},{default:t(()=>[i(r.$slots,`leading`,{ui:f.value},()=>[n.leadingIcon?(l(),o(e(n.leadingIcon),{key:0,"data-slot":`leading-icon`,"aria-hidden":`true`,class:v(f.value.leadingIcon())},null,8,[`class`])):u(``,!0)]),i(r.$slots,`default`,{ui:f.value},()=>[n.label!==void 0&&n.label!==null?(l(),g(`span`,{key:0,"data-slot":`label`,class:v(f.value.label())},_(n.label),3)):u(``,!0)]),i(r.$slots,`trailing`,{ui:f.value},()=>[n.trailingIcon?(l(),o(e(n.trailingIcon),{key:0,"data-slot":`trailing-icon`,"aria-hidden":`true`,class:v(f.value.trailingIcon())},null,8,[`class`])):u(``,!0)])]),_:3},8,[`to`,`aria-disabled`,`tabindex`,`class`])):s.value&&n.disabled?(l(),g(`a`,{key:1,"data-slot":`button`,"aria-disabled":!0,tabindex:-1,role:n.disabled?`link`:void 0,class:v(f.value.base({class:n.class})),onClickCapture:h},[i(r.$slots,`leading`,{ui:f.value},()=>[n.leadingIcon?(l(),o(e(n.leadingIcon),{key:0,"data-slot":`leading-icon`,"aria-hidden":`true`,class:v(f.value.leadingIcon())},null,8,[`class`])):u(``,!0)]),i(r.$slots,`default`,{ui:f.value},()=>[n.label!==void 0&&n.label!==null?(l(),g(`span`,{key:0,"data-slot":`label`,class:v(f.value.label())},_(n.label),3)):u(``,!0)]),i(r.$slots,`trailing`,{ui:f.value},()=>[n.trailingIcon?(l(),o(e(n.trailingIcon),{key:0,"data-slot":`trailing-icon`,"aria-hidden":`true`,class:v(f.value.trailingIcon())},null,8,[`class`])):u(``,!0)])],42,V)):c.value?(l(),g(`a`,{key:2,href:n.disabled?void 0:n.href,"data-slot":`button`,"aria-disabled":n.disabled||void 0,role:n.disabled?`link`:void 0,tabindex:n.disabled?-1:void 0,class:v(f.value.base({class:n.class})),onClickCapture:h},[i(r.$slots,`leading`,{ui:f.value},()=>[n.leadingIcon?(l(),o(e(n.leadingIcon),{key:0,"data-slot":`leading-icon`,"aria-hidden":`true`,class:v(f.value.leadingIcon())},null,8,[`class`])):u(``,!0)]),i(r.$slots,`default`,{ui:f.value},()=>[n.label!==void 0&&n.label!==null?(l(),g(`span`,{key:0,"data-slot":`label`,class:v(f.value.label())},_(n.label),3)):u(``,!0)]),i(r.$slots,`trailing`,{ui:f.value},()=>[n.trailingIcon?(l(),o(e(n.trailingIcon),{key:0,"data-slot":`trailing-icon`,"aria-hidden":`true`,class:v(f.value.trailingIcon())},null,8,[`class`])):u(``,!0)])],42,H)):(l(),g(`button`,{key:3,"data-slot":`button`,type:n.type,disabled:n.disabled||d.value,"aria-busy":d.value||void 0,class:v(f.value.base({class:n.class}))},[d.value&&!n.trailing?(l(),o(m(y),{key:0,"data-slot":`leading-icon`,"aria-hidden":`true`,class:v(f.value.leadingIcon())},null,8,[`class`])):i(r.$slots,`leading`,{ui:f.value},()=>[n.leadingIcon?(l(),o(e(n.leadingIcon),{key:0,"data-slot":`leading-icon`,"aria-hidden":`true`,class:v(f.value.leadingIcon())},null,8,[`class`])):u(``,!0)],void 0,1),i(r.$slots,`default`,{ui:f.value},()=>[n.label!==void 0&&n.label!==null?(l(),g(`span`,{key:0,"data-slot":`label`,class:v(f.value.label())},_(n.label),3)):u(``,!0)]),d.value&&n.trailing?(l(),o(m(y),{key:2,"data-slot":`trailing-icon`,"aria-hidden":`true`,class:v(f.value.trailingIcon())},null,8,[`class`])):i(r.$slots,`trailing`,{ui:f.value},()=>[n.trailingIcon?(l(),o(e(n.trailingIcon),{key:0,"data-slot":`trailing-icon`,"aria-hidden":`true`,class:v(f.value.trailingIcon())},null,8,[`class`])):u(``,!0)],void 0,3)],10,U))}}),G={class:`mx-auto grid grid-cols-[repeat(auto-fill,minmax(300px,400px))] justify-center gap-6`},K=[`src`],q=s({__name:`CardDemo`,setup(e){let r=[`https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2`,`https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2`,`https://images.pexels.com/photos/736530/pexels-photo-736530.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2`,`https://images.pexels.com/photos/248350/pexels-photo-248350.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2`,`https://images.pexels.com/photos/1120049/pexels-photo-1120049.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2`,`https://images.pexels.com/photos/1444321/pexels-photo-1444321.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2`,`https://images.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2`,`https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2`];return(e,i)=>(l(),g(`section`,G,[(l(),g(f,null,n(r,(e,n)=>c(m(k),{class:`[--card-spacing:calc(var(--spacing)*6)]`,key:n},{default:t(()=>[h(`img`,{class:`block h-50 object-cover`,src:e,alt:``},null,8,K),c(m(j),null,{default:t(()=>[c(m(N),null,{default:t(()=>[...i[0]||=[d(`Card Title`,-1)]]),_:1}),c(m(F),null,{default:t(()=>[...i[1]||=[d(`Card Description...`,-1)]]),_:1})]),_:1}),c(m(L),null,{default:t(()=>[...i[2]||=[h(`p`,null,` Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore repudiandae fuga perferendis voluptatum commodi, qui sed molestiae iure ad fugiat nulla! Alias voluptates quia quod quisquam natus laboriosam expedita ducimus consequuntur. Aliquid, maiores mollitia exercitationem facere laborum iste corrupti quas sed eveniet deleniti suscipit, fugiat quod ut molestiae temporibus harum? `,-1)]]),_:1}),c(m(z),{class:``},{default:t(()=>[c(W,{class:`min-w-25 justify-center`},{default:t(()=>[...i[3]||=[d(`Cancel`,-1)]]),_:1}),c(W,{class:`min-w-25 justify-center`,color:`secondary`,type:`button`},{default:t(()=>[...i[4]||=[d(` Confirm `,-1)]]),_:1})]),_:1})]),_:2},1024)),64))]))}}),J={class:`text-secondary-500 dark:text-primary-500 mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase`},Y=s({__name:`index`,setup(e){return b(`Test Page`),r(async()=>{try{await D(1500)}catch{}}),(e,n)=>(l(),o(w,null,{default:t(()=>[c(C,null,{default:t(()=>[h(`h1`,J,[n[0]||=d(` _Test `,-1),c(m(T),{class:`size-[1em]`,"stroke-width":`1`})]),c(q)]),_:1})]),_:1}))}});export{Y as default};