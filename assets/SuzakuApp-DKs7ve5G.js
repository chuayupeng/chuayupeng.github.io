import{c as x,r as b,j as e,b as h,a as g}from"./index-CSUY36Q5.js";import{D as f,P as v}from"./plus-CZ2dKspC.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=x("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=x("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]),n={id:"cmp_7f3a92",name:"Q2 Security Awareness — Wave 1",status:"live",platform:"outlook",lure_type:"teams"},i={sent:512,email_opens:268,clicks:134,cred_captures:61,reported:43,by_department:{Finance:{click:34,cred:18},Sales:{click:31,cred:15},Operations:{click:24,cred:11},Engineering:{click:18,cred:6},HR:{click:16,cred:7},Support:{click:11,cred:4}}},d=[{ts:"14:32:11",email:"j.tan@northwind.local",dept:"Finance",type:"cred_submit",ua:"Chrome/124"},{ts:"14:31:58",email:"m.santos@northwind.local",dept:"Sales",type:"click",ua:"Safari/17"},{ts:"14:30:42",email:"a.okafor@northwind.local",dept:"Operations",type:"reported",ua:"Outlook/16"},{ts:"14:29:19",email:"r.iyer@northwind.local",dept:"Finance",type:"click",ua:"Edge/124"},{ts:"14:27:50",email:"l.dubois@northwind.local",dept:"HR",type:"email_open",ua:"Chrome/124"},{ts:"14:26:33",email:"k.nakamura@northwind.local",dept:"Engineering",type:"cred_submit",ua:"Firefox/126"},{ts:"14:25:07",email:"s.petrov@northwind.local",dept:"Sales",type:"click",ua:"Chrome/124"},{ts:"14:23:44",email:"b.adeyemi@northwind.local",dept:"Support",type:"email_open",ua:"Mobile/Safari"},{ts:"14:22:10",email:"c.rossi@northwind.local",dept:"Operations",type:"reported",ua:"Outlook/16"},{ts:"14:20:58",email:"d.kim@northwind.local",dept:"Finance",type:"cred_submit",ua:"Chrome/123"},{ts:"14:19:31",email:"f.haddad@northwind.local",dept:"Sales",type:"email_open",ua:"Edge/124"},{ts:"14:18:02",email:"g.muller@northwind.local",dept:"HR",type:"click",ua:"Chrome/124"},{ts:"14:16:47",email:"p.nguyen@northwind.local",dept:"Engineering",type:"email_open",ua:"Safari/17"},{ts:"14:15:20",email:"v.silva@northwind.local",dept:"Operations",type:"click",ua:"Chrome/124"}],c=[{email:"j.tan@northwind.local",name:"Jia Tan",dept:"Finance",sent:!0},{email:"m.santos@northwind.local",name:"Marco Santos",dept:"Sales",sent:!0},{email:"a.okafor@northwind.local",name:"Ada Okafor",dept:"Operations",sent:!0},{email:"r.iyer@northwind.local",name:"Rohan Iyer",dept:"Finance",sent:!0},{email:"l.dubois@northwind.local",name:"Léa Dubois",dept:"HR",sent:!0},{email:"k.nakamura@northwind.local",name:"Kenji Nakamura",dept:"Engineering",sent:!0},{email:"s.petrov@northwind.local",name:"Sofia Petrov",dept:"Sales",sent:!0},{email:"b.adeyemi@northwind.local",name:"Bola Adeyemi",dept:"Support",sent:!1},{email:"c.rossi@northwind.local",name:"Carla Rossi",dept:"Operations",sent:!1}],j={email_open:"#a78bfa",click:"#f59e0b",cred_submit:"#ef4444",reported:"#22c55e"},y={email_open:"Opened",click:"Clicked",cred_submit:"Creds Captured",reported:"Reported"},p=t=>Math.round(t/i.sent*100);function w(){const t=[{label:"Sent",value:i.sent,color:"#52525b"},{label:"Email Opened",value:i.email_opens,color:"#a78bfa"},{label:"Link Clicked",value:i.clicks,color:"#f59e0b"},{label:"Creds Captured",value:i.cred_captures,color:"#ef4444"},{label:"Reported",value:i.reported,color:"#22c55e"}];return e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"label",children:"Attack Funnel"}),t.map((s,a)=>e.jsxs("div",{style:{marginBottom:a<t.length-1?14:0},children:[e.jsxs("div",{className:"fn-row",children:[e.jsx("span",{className:"fn-name",children:s.label}),e.jsxs("span",{className:"fn-val mono",style:{color:s.color},children:[s.value,e.jsxs("span",{className:"fn-pct",children:["(",p(s.value),"%)"]})]})]}),e.jsx("div",{className:"fn-track",children:e.jsx("div",{className:"fn-fill",style:{background:s.color,width:`${p(s.value)}%`}})})]},s.label))]})}const u=["#3b82f6","#22c55e","#f59e0b","#ef4444","#06b6d4","#a78bfa"];function N(){const t=Object.entries(i.by_department).map(([a,l])=>({dept:a,click:l.click,cred:l.cred})).sort((a,l)=>l.click+l.cred-(a.click+a.cred)),s=Math.max(...t.map(a=>a.click+a.cred),1);return e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"label",children:"By Department"}),e.jsx("div",{className:"dc",children:t.map((a,l)=>e.jsxs("div",{className:"dc-col",children:[e.jsxs("div",{className:"dc-bars",children:[e.jsx("div",{className:"dc-bar",style:{height:`${a.click/s*100}%`,background:"#f59e0b"},title:`${a.dept} — clicked ${a.click}`}),e.jsx("div",{className:"dc-bar",style:{height:`${a.cred/s*100}%`,background:"#ef4444"},title:`${a.dept} — creds ${a.cred}`})]}),e.jsx("div",{className:"dc-label",style:{color:u[l%u.length]},children:a.dept.slice(0,4)})]},a.dept))}),e.jsxs("div",{className:"dc-legend",children:[e.jsxs("span",{children:[e.jsx("i",{style:{background:"#f59e0b"}})," Clicked"]}),e.jsxs("span",{children:[e.jsx("i",{style:{background:"#ef4444"}})," Creds captured"]})]})]})}function m({rows:t}){return e.jsxs("div",{className:"card span-2",children:[e.jsxs("div",{className:"label",children:["Event Stream (",t.length,")"]}),e.jsxs("div",{className:"ev-head",children:[e.jsx("span",{children:"Time"}),e.jsx("span",{children:"Email"}),e.jsx("span",{children:"Dept"}),e.jsx("span",{children:"Event"}),e.jsx("span",{children:"Client"})]}),e.jsx("div",{className:"ev-body",children:t.map((s,a)=>e.jsxs("div",{className:"ev-row",style:{background:s.type==="cred_submit"?"rgba(239,68,68,.05)":"transparent"},children:[e.jsx("span",{className:"ev-time mono",children:s.ts}),e.jsx("span",{className:"ev-email",children:s.email}),e.jsx("span",{className:"ev-dept",children:s.dept}),e.jsx("span",{className:"ev-type",style:{color:j[s.type]},children:y[s.type]}),e.jsx("span",{className:"ev-ua",children:s.ua})]},a))})]})}function E(){const[t,s]=b.useState("overview"),a=Math.round(i.cred_captures/i.sent*100),l=a>=20?["HIGH","#ef4444"]:a>=10?["MEDIUM","#f59e0b"]:["LOW","#22c55e"],o="#22c55e";return e.jsxs("div",{className:"suzaku",children:[e.jsx("style",{children:S}),e.jsxs("header",{className:"header-bar",children:[e.jsxs("div",{className:"hb-left",children:[e.jsxs("button",{className:"btn-ghost btn-sm",children:[e.jsx(h,{size:12})," Back"]}),e.jsx("div",{className:"divider-v"}),e.jsxs("div",{children:[e.jsx("div",{className:"hb-title",children:n.name}),e.jsxs("div",{className:"hb-sub mono",children:[n.id," · ",n.platform," · ",n.lure_type]})]}),e.jsx("span",{className:"tag",style:{background:o+"18",color:o,borderColor:o+"30"},children:n.status}),e.jsxs("span",{className:"tag",style:{background:l[1]+"18",color:l[1],borderColor:l[1]+"30"},children:[l[0]," RISK"]})]}),e.jsxs("div",{className:"hb-right",children:[e.jsxs("button",{className:"btn-ghost btn-sm",children:[e.jsx(k,{size:11})," Refresh"]}),e.jsxs("button",{className:"btn-ghost btn-sm",children:[e.jsx(f,{size:11})," CSV"]}),e.jsxs("button",{className:"btn-primary btn-sm",children:[e.jsx(z,{size:11})," Launch"]})]})]}),e.jsxs("div",{className:"demo-note",children:[e.jsx(g,{size:13}),"UI mockup for portfolio display — sample data, no live sending or capture."]}),e.jsx("div",{className:"tab-bar",children:["overview","targets","events"].map(r=>e.jsx("button",{onClick:()=>s(r),className:`tab-btn ${t===r?"active":""}`,children:r},r))}),e.jsxs("main",{className:"su-main",children:[t==="overview"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"stat-row",children:[{l:"Sent",v:i.sent,c:"#a1a1aa"},{l:"Opened",v:i.email_opens,c:"#a78bfa"},{l:"Clicked",v:i.clicks,c:"#f59e0b"},{l:"Creds",v:i.cred_captures,c:"#ef4444"},{l:"Reported",v:i.reported,c:"#22c55e"}].map(r=>e.jsxs("div",{className:"card stat-tile",style:{borderTop:`2px solid ${r.c}`},children:[e.jsx("div",{className:"value mono",style:{color:r.c},children:r.v}),e.jsx("div",{className:"label tile-label",children:r.l})]},r.l))}),e.jsxs("div",{className:"ov-grid",children:[e.jsx(w,{}),e.jsx(N,{}),e.jsx(m,{rows:d.slice(0,8)})]})]}),t==="targets"&&e.jsxs("div",{className:"card span-2",children:[e.jsxs("div",{className:"label",children:["Targets (",c.length,")"]}),e.jsxs("div",{className:"tg-head",children:[e.jsx("span",{children:"Email"}),e.jsx("span",{children:"Name"}),e.jsx("span",{children:"Department"}),e.jsx("span",{children:"Sent"})]}),e.jsx("div",{className:"tg-body",children:c.map(r=>e.jsxs("div",{className:"tg-row",children:[e.jsx("span",{className:"tg-email",children:r.email}),e.jsx("span",{className:"tg-muted",children:r.name}),e.jsx("span",{className:"tg-muted",children:r.dept}),e.jsx("span",{style:{color:r.sent?"#22c55e":"#52525b",fontSize:11},children:r.sent?"✓":"–"})]},r.email))}),e.jsxs("div",{className:"tg-add",children:[e.jsx("div",{className:"tg-add-label",children:"Paste targets — one per line: email, name, department (CSV)"}),e.jsx("textarea",{rows:3,readOnly:!0,placeholder:`j.chen@corp.local, Jane Chen, Finance
m.lee@corp.local, Marcus Lee, Engineering`}),e.jsxs("button",{className:"btn-primary btn-sm",style:{marginTop:10},children:[e.jsx(v,{size:12})," Add targets"]})]})]}),t==="events"&&e.jsx(m,{rows:d})]})]})}const S=`
.suzaku{
  --bg:#09090b; --surface:#111114; --surface-2:#18181b; --dim:#1e1e22;
  --border:#27272a; --border-hover:#3f3f46; --text:#d4d4d8; --subtle:#a1a1aa;
  --muted:#52525b; --bright:#fafafa; --blue:#3b82f6; --blue-muted:#2563eb;
  --green:#22c55e; --amber:#f59e0b; --red:#ef4444; --purple:#a78bfa;
  --radius:8px; --radius-lg:12px;
  background:var(--bg); color:var(--text);
  font-family:'Inter',system-ui,-apple-system,sans-serif; font-size:13px; line-height:1.5;
  -webkit-font-smoothing:antialiased; min-height:560px;
}
.suzaku *{box-sizing:border-box; margin:0; padding:0;}
.suzaku .mono{font-family:'JetBrains Mono',ui-monospace,monospace;}

.suzaku .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;transition:border-color .2s;}
.suzaku .card:hover{border-color:var(--border-hover);}
.suzaku .span-2{grid-column:1/-1;}
.suzaku .label{font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
.suzaku .tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:10px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;border:1px solid transparent;}

.suzaku .header-bar{border-bottom:1px solid var(--border);padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(9,9,11,.85);backdrop-filter:blur(12px);flex-wrap:wrap;}
.suzaku .hb-left{display:flex;align-items:center;gap:12px;flex-wrap:wrap;min-width:0;}
.suzaku .hb-right{display:flex;gap:8px;flex-wrap:wrap;}
.suzaku .hb-title{color:var(--bright);font-weight:600;font-size:14px;}
.suzaku .hb-sub{font-size:10px;color:var(--muted);}
.suzaku .divider-v{width:1px;height:24px;background:var(--border);}

.suzaku button{font-family:inherit;font-size:12px;font-weight:500;cursor:pointer;border-radius:var(--radius);border:none;display:inline-flex;align-items:center;gap:6px;transition:all .15s ease;}
.suzaku .btn-primary{background:var(--blue);color:#fff;padding:7px 16px;font-weight:600;box-shadow:0 1px 3px rgba(59,130,246,.25);}
.suzaku .btn-primary:hover{background:var(--blue-muted);transform:translateY(-1px);}
.suzaku .btn-ghost{background:transparent;color:var(--subtle);border:1px solid var(--border);padding:7px 14px;}
.suzaku .btn-ghost:hover{background:var(--dim);color:var(--text);border-color:var(--border-hover);}
.suzaku .btn-sm{padding:5px 10px;font-size:11px;}

.suzaku .demo-note{display:flex;align-items:center;gap:7px;padding:8px 18px;font-size:11px;color:var(--amber);background:rgba(245,158,11,.06);border-bottom:1px solid var(--border);}

.suzaku .tab-bar{border-bottom:1px solid var(--border);background:var(--surface);padding:0 18px;display:flex;gap:0;}
.suzaku .tab-btn{background:transparent;border:none;border-bottom:2px solid transparent;color:var(--muted);padding:11px 18px;border-radius:0;text-transform:capitalize;letter-spacing:.03em;font-size:12px;font-weight:500;transition:color .15s,border-color .15s;}
.suzaku .tab-btn:hover{color:var(--subtle);}
.suzaku .tab-btn.active{border-bottom-color:var(--blue);color:var(--bright);}

.suzaku .su-main{padding:18px;}
.suzaku .stat-row{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:14px;}
.suzaku .stat-tile{text-align:center;padding:16px 12px;}
.suzaku .stat-tile .value{font-size:26px;font-weight:700;line-height:1.1;}
.suzaku .tile-label{font-size:10px;margin-bottom:0;margin-top:4px;}
.suzaku .ov-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
@media(max-width:680px){.suzaku .stat-row{grid-template-columns:repeat(2,1fr);}.suzaku .ov-grid{grid-template-columns:1fr;}}

.suzaku .fn-row{display:flex;justify-content:space-between;margin-bottom:6px;}
.suzaku .fn-name{color:var(--text);font-size:12px;}
.suzaku .fn-val{font-weight:600;font-size:13px;}
.suzaku .fn-pct{color:var(--muted);font-weight:400;font-size:10px;margin-left:6px;}
.suzaku .fn-track{background:var(--dim);border-radius:99px;height:5px;overflow:hidden;}
.suzaku .fn-fill{height:100%;border-radius:99px;transition:width .5s ease;}

.suzaku .dc{display:flex;align-items:flex-end;justify-content:space-around;gap:6px;height:150px;padding-top:8px;}
.suzaku .dc-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:6px;}
.suzaku .dc-bars{display:flex;align-items:flex-end;gap:3px;height:100%;}
.suzaku .dc-bar{width:11px;border-radius:3px 3px 0 0;transition:height .5s ease;min-height:2px;}
.suzaku .dc-label{font-size:10px;font-weight:600;}
.suzaku .dc-legend{display:flex;gap:14px;margin-top:12px;font-size:10px;color:var(--muted);}
.suzaku .dc-legend span{display:inline-flex;align-items:center;gap:5px;}
.suzaku .dc-legend i{width:8px;height:8px;border-radius:2px;display:inline-block;}

.suzaku .ev-head,.suzaku .ev-row{display:grid;grid-template-columns:72px 1fr 96px 120px 96px;gap:10px;}
.suzaku .ev-head{padding:6px 8px;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--border);margin-bottom:4px;}
.suzaku .ev-body{max-height:300px;overflow-y:auto;}
.suzaku .ev-row{padding:8px;font-size:11px;border-bottom:1px solid var(--border);align-items:center;}
.suzaku .ev-time{color:var(--muted);font-size:10px;}
.suzaku .ev-email{color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.suzaku .ev-dept{color:var(--muted);font-size:10px;}
.suzaku .ev-type{font-weight:600;font-size:10px;}
.suzaku .ev-ua{color:var(--muted);font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
@media(max-width:680px){.suzaku .ev-head{display:none;}.suzaku .ev-row{grid-template-columns:1fr auto;gap:4px 10px;}.suzaku .ev-dept,.suzaku .ev-ua{display:none;}}

.suzaku .tg-head,.suzaku .tg-row{display:grid;grid-template-columns:1fr 140px 120px 56px;gap:8px;}
.suzaku .tg-head{padding:5px 6px;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--border);margin-bottom:4px;}
.suzaku .tg-body{max-height:280px;overflow-y:auto;margin-bottom:16px;}
.suzaku .tg-row{padding:7px 6px;font-size:11px;border-bottom:1px solid var(--border);align-items:center;}
.suzaku .tg-email{color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.suzaku .tg-muted{color:var(--muted);}
@media(max-width:680px){.suzaku .tg-head{grid-template-columns:1fr 56px;}.suzaku .tg-row{grid-template-columns:1fr 56px;}.suzaku .tg-muted{display:none;}}
.suzaku .tg-add-label{font-size:10px;color:var(--muted);margin-bottom:6px;}
.suzaku textarea{background:var(--dim);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-family:'JetBrains Mono',monospace;font-size:12px;padding:9px 12px;width:100%;resize:vertical;}
.suzaku textarea:focus{outline:none;border-color:var(--blue);}
.suzaku ::-webkit-scrollbar{width:5px;height:5px;}
.suzaku ::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}
`;export{E as default};
