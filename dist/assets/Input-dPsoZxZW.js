import{d as e,g as t,j as n,ot as r,t as i,xt as a}from"./createLucideIcon-WPs65NTg.js";import{n as o}from"./index-BT6shJN9.js";var s=i({name:`rotate-ccw`,size:24,node:[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,key:`1357e3`}],[`path`,{d:`M3 3v5h5`,key:`1xhq8a`}]]}),c=i({name:`send`,size:24,node:[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`,key:`1ffxy3`}],[`path`,{d:`m21.854 2.147-10.94 10.939`,key:`12cjpa`}]]}),l=i({name:`triangle-alert`,size:24,node:[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,key:`wmoenq`}],[`path`,{d:`M12 9v4`,key:`juzpu7`}],[`path`,{d:`M12 17h.01`,key:`p32p05`}]],aliases:[`alert-triangle`]}),u=[`data-valid`,`data-invalid`],d=`
focus-visible:shadow-none
focus-visible:ring-[3px]
focus-visible:ring-secondary/40
focus-visible:border-secondary
`,f=`
not-disabled:data-invalid:border-error
data-invalid:focus-visible:border-error
data-invalid:focus-visible:ring-error/40
`,p=`
not-disabled:data-valid:border-success
focus-visible:data-valid:border-success
focus-visible:data-valid:ring-success/40
`,m=`
disabled:cursor-not-allowed
disabled:border-neutral-400
`,h=t({__name:`Input`,props:{class:{type:[Boolean,null,String,Object,Array]},invalid:{type:Boolean}},setup(t){let i=`
text-sm
flex bg-card-accented
w-full min-w-0
[&:not([type='file'])]:px-[0.5em]
[&:not([type='file'])]:py-[0.25em]
rounded-[0.375em]
border outline-hidden
placeholder:text-muted-foreground
placeholder:italic
shadow-xs 
${d}
${m}
${f}
${p}
`,s=t;return(c,l)=>(n(),e(`input`,{"data-valid":t.invalid===!1?``:void 0,"data-invalid":t.invalid===!0?``:void 0,class:a(r(o)(i,s.class))},null,10,u))}});export{s as i,l as n,c as r,h as t};