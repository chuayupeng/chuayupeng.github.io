import{c as n,j as e}from"./index-CSUY36Q5.js";import{S as a,W as t,A as s,T as l,L as o}from"./wallet-E12SrVbd.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=n("ArrowDownRight",[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]]),p=[{kind:"savings",label:"Savings",creature:"Phoenix",name:"Sprout",img:"/finrpg/phoenix.png",level:7,moodWord:"Thriving",xp:1240,next:1500,pct:.83,grad:"linear-gradient(135deg, hsl(20 90% 82% / .65), hsl(42 95% 62% / .35))"},{kind:"networth",label:"Net Worth",creature:"Dragon",name:"Atlas",img:"/finrpg/dragon.png",level:5,moodWord:"Content",xp:880,next:1e3,pct:.88,grad:"linear-gradient(135deg, hsl(260 75% 85% / .65), hsl(200 85% 80% / .4))"},{kind:"debt",label:"Debt",creature:"Tortoise",name:"Shell",img:"/finrpg/tortoise.png",level:4,moodWord:"Serene",xp:610,next:750,pct:.81,grad:"linear-gradient(135deg, hsl(152 60% 85% / .7), hsl(174 70% 38% / .3))"},{kind:"guardian",label:"Owned Assets",creature:"Tiger",name:"Fang",img:"/finrpg/tiger.png",level:6,moodWord:"Alert",xp:1020,next:1250,pct:.82,grad:"linear-gradient(135deg, hsl(45 93% 88% / .75), hsl(28 80% 52% / .32))"}],d=[{label:"Net worth",value:"$12,450",icon:t,tone:"positive",sub:"$28,900 − $16,450"},{label:"Savings rate",value:"18%",icon:a,tone:"positive",sub:"+$936 this month"},{label:"Income",value:"$5,200",icon:s,tone:"positive",sub:"this month"},{label:"Spending",value:"$4,264",icon:c,tone:"negative",sub:"this month"},{label:"Total debt",value:"$16,450",icon:l,tone:"negative",sub:"Good $14,200 · Bad $2,250"},{label:"Owned",value:"$22,600",icon:o,tone:"positive",sub:"3 assets"}],f=[{merchant:"Sheng Siong",cat:"Groceries",emoji:"🛒",color:"160 60% 78%",date:"Jun 12",amount:"−$84.20",income:!1},{merchant:"Monthly salary",cat:"Income",emoji:"💰",color:"150 55% 70%",date:"Jun 11",amount:"+$5,200.00",income:!0},{merchant:"Grab",cat:"Transport",emoji:"🚗",color:"200 85% 80%",date:"Jun 11",amount:"−$18.50",income:!1},{merchant:"Spotify",cat:"Fun",emoji:"🎵",color:"260 75% 85%",date:"Jun 10",amount:"−$11.98",income:!1},{merchant:"Guardian",cat:"Health",emoji:"💊",color:"20 90% 82%",date:"Jun 9",amount:"−$32.40",income:!1}],g=[{icon:"🏷️",label:"Categories"},{icon:"🏦",label:"Accounts"},{icon:"🎯",label:"Budgets"}];function u(){return e.jsxs("div",{className:"finrpg",children:[e.jsx("style",{children:x}),e.jsxs("div",{className:"fr-app",children:[e.jsxs("header",{className:"fr-header",children:[e.jsxs("div",{children:[e.jsx("div",{className:"fr-date",children:"Thursday, 12 Jun"}),e.jsx("h1",{className:"fr-title",children:"FinRPG"})]}),e.jsx("div",{className:"fr-avatar",children:e.jsx(a,{size:18})})]}),e.jsx("section",{className:"fr-pets",children:p.map(r=>e.jsxs("div",{className:"fr-pet",style:{background:r.grad},children:[e.jsxs("div",{className:"fr-pet-top",children:[e.jsx("div",{className:"fr-pet-art",children:e.jsx("img",{src:r.img,alt:r.creature,className:"fr-pet-img",draggable:!1})}),e.jsxs("div",{className:"fr-pet-meta",children:[e.jsx("div",{className:"fr-pet-label",children:r.label}),e.jsx("div",{className:"fr-pet-name",children:r.name}),e.jsxs("div",{className:"fr-pet-mood",children:["Lv ",r.level," · ",r.moodWord]})]})]}),e.jsxs("div",{className:"fr-pet-xp",children:[e.jsxs("div",{className:"fr-xp-row",children:[e.jsxs("span",{children:["XP ",r.xp]}),e.jsxs("span",{children:["→ ",r.next]})]}),e.jsx("div",{className:"fr-xp-track",children:e.jsx("div",{className:"fr-xp-fill",style:{width:`${Math.round(r.pct*100)}%`}})})]})]},r.kind))}),e.jsx("section",{className:"fr-stats",children:d.map(r=>{const i=r.icon;return e.jsxs("div",{className:"fr-card fr-stat",children:[e.jsxs("div",{className:"fr-stat-label",children:[e.jsx(i,{size:14})," ",r.label]}),e.jsx("div",{className:`fr-stat-value ${r.tone}`,children:r.value}),e.jsx("div",{className:"fr-stat-sub",children:r.sub})]},r.label)})}),e.jsxs("section",{className:"fr-recent-wrap",children:[e.jsxs("div",{className:"fr-section-head",children:[e.jsx("h2",{children:"Recent"}),e.jsx("span",{className:"fr-link",children:"View all"})]}),e.jsx("div",{className:"fr-card fr-recent",children:f.map(r=>e.jsxs("div",{className:"fr-txn",children:[e.jsx("div",{className:"fr-txn-icon",style:{background:`hsl(${r.color} / .5)`},children:r.emoji}),e.jsxs("div",{className:"fr-txn-body",children:[e.jsx("div",{className:"fr-txn-merchant",children:r.merchant}),e.jsxs("div",{className:"fr-txn-cat",children:[r.cat," · ",r.date]})]}),e.jsx("div",{className:`fr-txn-amt ${r.income?"income":""}`,children:r.amount})]},r.merchant))})]}),e.jsx("section",{className:"fr-quick",children:g.map(r=>e.jsxs("div",{className:"fr-card fr-quicklink",children:[e.jsx("div",{className:"fr-quick-icon",children:r.icon}),e.jsx("div",{className:"fr-quick-label",children:r.label})]},r.label))})]})]})}const x=`
.finrpg{
  --bg:250 100% 99%; --card:0 0% 100%; --ink:240 30% 18%; --muted:240 10% 50%;
  --border:240 20% 90%; --danger:352 80% 62%; --success:150 55% 48%;
  background:
    radial-gradient(ellipse 80% 55% at 50% -8%, hsl(260 75% 85% / .5), transparent 70%),
    radial-gradient(ellipse 60% 40% at 100% 108%, hsl(160 60% 78% / .4), transparent 70%),
    hsl(var(--bg));
  color:hsl(var(--ink));
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  min-height:560px; padding:20px 14px;
  -webkit-font-smoothing:antialiased;
}
.finrpg *{box-sizing:border-box;margin:0;padding:0;}
.finrpg .fr-app{max-width:440px;margin:0 auto;}

.finrpg .fr-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.finrpg .fr-date{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:hsl(var(--muted));}
.finrpg .fr-title{font-size:26px;font-weight:900;letter-spacing:-.02em;color:hsl(var(--ink));}
.finrpg .fr-avatar{width:40px;height:40px;border-radius:999px;background:hsl(var(--card));box-shadow:0 4px 14px rgba(30,27,75,.1);display:flex;align-items:center;justify-content:center;color:hsl(var(--ink));}

.finrpg .fr-card{background:hsl(var(--card));border-radius:18px;box-shadow:0 4px 14px rgba(30,27,75,.07);border:1px solid hsl(var(--border) / .6);}

.finrpg .fr-pets{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;}
.finrpg .fr-pet{border-radius:24px;padding:13px;box-shadow:0 6px 18px rgba(30,27,75,.08);display:flex;flex-direction:column;gap:10px;}
.finrpg .fr-pet-top{display:flex;align-items:flex-start;gap:9px;}
.finrpg .fr-pet-art{width:60px;height:60px;flex-shrink:0;animation:fr-float 2.8s ease-in-out infinite;}
.finrpg .fr-pet-img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 5px 7px rgba(30,27,75,.28));}
.finrpg .fr-pet-meta{min-width:0;flex:1;}
.finrpg .fr-pet-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:hsl(var(--ink) / .6);}
.finrpg .fr-pet-name{font-size:17px;font-weight:900;line-height:1.1;color:hsl(var(--ink));}
.finrpg .fr-pet-mood{font-size:11px;color:hsl(var(--ink) / .7);}
.finrpg .fr-xp-row{display:flex;justify-content:space-between;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:hsl(var(--ink) / .55);margin-bottom:4px;}
.finrpg .fr-xp-track{height:7px;border-radius:99px;background:rgba(255,255,255,.6);overflow:hidden;}
.finrpg .fr-xp-fill{height:100%;border-radius:99px;background:hsl(var(--ink));transition:width .6s cubic-bezier(.2,.7,.2,1);}

@keyframes fr-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
@media(prefers-reduced-motion:reduce){.finrpg .fr-pet-art{animation:none;}}

.finrpg .fr-stats{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:22px;}
.finrpg .fr-stat{padding:13px;}
.finrpg .fr-stat-label{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:hsl(var(--muted));}
.finrpg .fr-stat-value{margin-top:4px;font-size:19px;font-weight:900;letter-spacing:-.01em;}
.finrpg .fr-stat-value.positive{color:hsl(var(--success));}
.finrpg .fr-stat-value.negative{color:hsl(var(--danger));}
.finrpg .fr-stat-value.neutral{color:hsl(var(--ink));}
.finrpg .fr-stat-sub{margin-top:2px;font-size:11px;color:hsl(var(--muted));}

.finrpg .fr-section-head{display:flex;align-items:center;justify-content:space-between;padding:0 4px;margin-bottom:8px;}
.finrpg .fr-section-head h2{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:hsl(var(--muted));}
.finrpg .fr-link{font-size:12px;font-weight:700;color:hsl(var(--ink) / .8);}
.finrpg .fr-recent{overflow:hidden;}
.finrpg .fr-txn{display:flex;align-items:center;gap:12px;padding:12px;border-top:1px solid hsl(var(--border) / .5);}
.finrpg .fr-txn:first-child{border-top:none;}
.finrpg .fr-txn-icon{width:40px;height:40px;flex-shrink:0;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:18px;}
.finrpg .fr-txn-body{min-width:0;flex:1;}
.finrpg .fr-txn-merchant{font-weight:700;color:hsl(var(--ink));overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.finrpg .fr-txn-cat{font-size:11px;color:hsl(var(--muted));overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.finrpg .fr-txn-amt{font-size:15px;font-weight:800;color:hsl(var(--ink));white-space:nowrap;}
.finrpg .fr-txn-amt.income{color:hsl(var(--success));}

.finrpg .fr-quick{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:18px;}
.finrpg .fr-quicklink{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;text-align:center;}
.finrpg .fr-quick-icon{font-size:23px;}
.finrpg .fr-quick-label{font-size:12px;font-weight:700;color:hsl(var(--ink));}
`;export{u as default};
