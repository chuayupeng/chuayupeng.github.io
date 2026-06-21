/* af.fluent design system — one scoped stylesheet, injected once by the shell. */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

.affluent{
  --paper:#ECEDE5; --ink:#13181A; --muted:#5A6B6D; --faint:#8A9794;
  --deep:#0F3138; --deep2:#0A242A; --coral:#DD5C36; --jade:#2F7F66;
  --deepbg:#0F3138; --deepbg2:#0A242A;   /* constant-dark surfaces: hero cards, selected nav, toast */
  --gold:#C28B4B; --sky:#4E8A93;
  --ok:#2F7F66; --warn:#C8861F; --bad:#C44A2C;
  --line:rgba(15,49,56,.12); --line2:rgba(15,49,56,.20);
  --card:#F7F8F3; --card2:#FBFCF8; --tint:rgba(15,49,56,.045);
  --shadow:0 1px 2px rgba(15,49,56,.04),0 8px 24px -16px rgba(15,49,56,.18);
  --shadow-lg:0 2px 6px rgba(15,49,56,.06),0 24px 48px -28px rgba(15,49,56,.30);
  background:var(--paper); color:var(--ink);
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
  font-size:14px; line-height:1.5;
  position:relative; height:clamp(560px,82vh,920px); display:flex; flex-direction:column; overflow:hidden;
}
.affluent.standalone{height:100vh; height:100dvh;}
.affluent *{box-sizing:border-box; min-width:0;}
.affluent .num{font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace; font-feature-settings:"tnum" 1; letter-spacing:-.01em;}
.affluent h1,.affluent h2,.affluent h3,.affluent h4{font-family:'Space Grotesk',sans-serif; margin:0; letter-spacing:-.02em;}
.affluent button{font:inherit; cursor:pointer;}
.affluent ::-webkit-scrollbar{height:8px;width:8px;}
.affluent ::-webkit-scrollbar-thumb{background:var(--line2);border-radius:8px;}

/* ---------------- app shell ---------------- */
/* Self-contained app panel: fixed-height window, nav fixed, only the stage scrolls.
   Sidesteps the portfolio frame's overflow/transform wrappers that break position:sticky. */
.affluent .app{flex:1; min-height:0; display:grid; grid-template-columns:236px minmax(0,1fr); gap:0;}
.affluent .rail{height:100%; min-height:0; overflow-y:auto; border-right:1px solid var(--line); padding:18px 14px; display:flex; flex-direction:column; gap:3px;}
.affluent .brand{display:flex; align-items:center; gap:9px; padding:6px 10px 16px;}
.affluent .brand-mark{width:30px;height:30px;border-radius:9px;background:linear-gradient(140deg,var(--deep),var(--jade));display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:var(--shadow);}
.affluent .brand-name{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;letter-spacing:-.03em;}
.affluent .brand-name b{color:var(--coral);font-weight:700;}
.affluent .nav-item{display:flex; align-items:center; gap:11px; padding:9px 12px; border:0; background:transparent; border-radius:10px; color:var(--muted); font-size:13.5px; font-weight:500; text-align:left; width:100%; transition:background .15s,color .15s; white-space:nowrap;}
.affluent .nav-item svg{flex-shrink:0; opacity:.85;}
.affluent .nav-item:hover{background:rgba(15,49,56,.05); color:var(--ink);}
.affluent .nav-item.on{background:var(--deepbg); color:#fff;}
.affluent .nav-item.on svg{opacity:1;}
.affluent .nav-badge{margin-left:auto; font-size:10px; font-weight:700; background:var(--coral); color:#fff; border-radius:999px; min-width:17px; height:17px; padding:0 5px; display:flex; align-items:center; justify-content:center;}
.affluent .nav-item.on .nav-badge{background:rgba(255,255,255,.25);}
.affluent .rail-foot{margin-top:auto; padding:12px 10px 4px; display:flex; flex-direction:column; gap:7px;}
.affluent .rail-net{font-size:11px;color:var(--faint);text-transform:uppercase;letter-spacing:.06em;}
.affluent .rail-net b{display:block;font-size:18px;color:var(--deep);margin-top:2px;}

.affluent .stage{height:100%; min-height:0; overflow-y:auto; padding:20px 22px 40px; scroll-behavior:smooth;}
.affluent .stage-top{display:flex; justify-content:space-between; align-items:flex-start; gap:14px; margin-bottom:18px; flex-wrap:wrap;}
.affluent .stage-title h1{font-size:23px; font-weight:700;}
.affluent .stage-title p{margin:3px 0 0; color:var(--muted); font-size:13px; max-width:60ch;}
.affluent .stage-actions{display:flex; gap:8px; align-items:center; flex-wrap:wrap;}

/* mobile nav */
.affluent .mobile-top{display:none;}
@media(max-width:900px){
  .affluent .app{display:flex; flex-direction:column;}
  .affluent .rail{display:none;}
  .affluent .mobile-top{display:flex; flex-shrink:0; z-index:30; flex-direction:column; gap:0; background:var(--paper); border-bottom:1px solid var(--line);}
  .affluent .mtop-bar{display:flex; align-items:center; justify-content:space-between; padding:12px 14px 8px;}
  .affluent .mtabs{display:flex; gap:6px; overflow-x:auto; padding:2px 12px 10px; scrollbar-width:none;}
  .affluent .mtabs::-webkit-scrollbar{display:none;}
  .affluent .mtab{display:flex; align-items:center; gap:6px; flex-shrink:0; padding:7px 12px; border-radius:999px; border:1px solid var(--line); background:var(--card); color:var(--muted); font-size:12.5px; font-weight:600;}
  .affluent .mtab.on{background:var(--deepbg); color:#fff; border-color:var(--deepbg);}
  .affluent .mtab .nav-badge{margin-left:2px;}
  .affluent .stage{flex:1; min-height:0; overflow-y:auto; padding:16px 14px 48px;}
  .affluent .stage-title h1{font-size:20px;}
}

/* ---------------- cards ---------------- */
.affluent .card{background:var(--card); border:1px solid var(--line); border-radius:16px; padding:18px; box-shadow:var(--shadow);}
.affluent .card.tight{padding:14px;}
.affluent .card.deep{background:linear-gradient(155deg,var(--deepbg),var(--deepbg2)); color:#EAF1ED; border-color:var(--deepbg2); box-shadow:var(--shadow-lg);}
.affluent .card.deep .muted,.affluent .card.deep .eyebrow{color:rgba(234,241,237,.7);}
.affluent .grid{display:grid; gap:14px;}
.affluent .g2{grid-template-columns:repeat(2,minmax(0,1fr));}
.affluent .g3{grid-template-columns:repeat(3,minmax(0,1fr));}
.affluent .g4{grid-template-columns:repeat(4,minmax(0,1fr));}
@media(max-width:760px){.affluent .g3,.affluent .g4{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(max-width:520px){.affluent .g2,.affluent .g3,.affluent .g4{grid-template-columns:1fr;}}
.affluent .span2{grid-column:span 2;}
@media(max-width:520px){.affluent .span2{grid-column:span 1;}}

.affluent .eyebrow{display:flex; align-items:center; gap:7px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--deep); margin-bottom:13px;}
.affluent .card.deep .eyebrow{color:#A9C9BE;}
.affluent .muted{color:var(--muted);}
.affluent .faint{color:var(--faint);}
.affluent .hr{height:1px; background:var(--line); border:0; margin:14px 0;}
.affluent .card.deep .hr{background:rgba(255,255,255,.14);}

/* ---------------- stats / numbers ---------------- */
.affluent .stat-label{font-size:11.5px; color:var(--muted); text-transform:uppercase; letter-spacing:.05em; font-weight:600;}
.affluent .stat-big{font-family:'IBM Plex Mono',monospace; font-size:34px; font-weight:600; letter-spacing:-.03em; line-height:1.05;}
.affluent .stat-mid{font-family:'IBM Plex Mono',monospace; font-size:24px; font-weight:600; letter-spacing:-.02em;}
.affluent .stat-sub{font-size:12px; color:var(--muted); margin-top:3px;}
.affluent .per{font-size:.5em; color:var(--muted); font-weight:500; margin-left:3px;}
.affluent .hero-num{font-family:'IBM Plex Mono',monospace; font-size:46px; font-weight:600; letter-spacing:-.03em; line-height:1;}
@media(max-width:520px){.affluent .hero-num{font-size:38px;} .affluent .stat-big{font-size:28px;}}
.affluent .delta{display:inline-flex; align-items:center; gap:3px; font-size:12px; font-weight:600; font-family:'IBM Plex Mono',monospace;}
.affluent .delta.up{color:var(--jade);} .affluent .delta.down{color:var(--coral);}
.affluent .pos{color:var(--jade);} .affluent .neg{color:var(--coral);}

/* ---------------- buttons ---------------- */
.affluent .btn{display:inline-flex; align-items:center; gap:7px; border:1px solid var(--line2); background:var(--card2); color:var(--ink); border-radius:10px; padding:8px 14px; font-size:13px; font-weight:600; transition:filter .15s,background .15s,border-color .15s; white-space:nowrap;}
.affluent .btn:hover{background:#fff; border-color:var(--deep);}
.affluent .btn.primary{background:var(--coral); border-color:var(--coral); color:#fff;}
.affluent .btn.primary:hover{filter:brightness(1.07);}
.affluent .btn.deep{background:var(--deepbg); border-color:var(--deepbg); color:#fff;}
.affluent .btn.deep:hover{filter:brightness(1.12);}
.affluent .btn.sm{padding:6px 10px; font-size:12px; border-radius:8px;}
.affluent .btn.ghost{background:transparent; border-color:transparent; color:var(--muted);}
.affluent .btn.ghost:hover{background:rgba(15,49,56,.06); color:var(--ink);}
.affluent .icon-btn{display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:9px; border:1px solid var(--line); background:var(--card2); color:var(--muted);}
.affluent .icon-btn:hover{color:var(--bad); border-color:var(--bad);}
.affluent .btn:focus-visible,.affluent .icon-btn:focus-visible,.affluent .nav-item:focus-visible{outline:2px solid var(--coral); outline-offset:2px;}

/* ---------------- chips / pills ---------------- */
.affluent .chip{display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:600; padding:3px 9px; border-radius:999px; border:1px solid var(--line); background:var(--card2); color:var(--muted);}
.affluent .chip.ok{color:var(--ok); border-color:rgba(47,127,102,.3); background:rgba(47,127,102,.08);}
.affluent .chip.warn{color:var(--warn); border-color:rgba(200,134,31,.3); background:rgba(200,134,31,.08);}
.affluent .chip.bad{color:var(--bad); border-color:rgba(196,74,44,.3); background:rgba(196,74,44,.08);}
.affluent .dot{width:8px;height:8px;border-radius:50%;display:inline-block;flex-shrink:0;}

/* ---------------- fields ---------------- */
.affluent .field{display:block; margin-bottom:12px;}
.affluent .field-label{display:flex; justify-content:space-between; gap:10px; font-size:12.5px; font-weight:500; margin-bottom:6px; color:var(--ink);}
.affluent .field-label em{font-style:normal; color:var(--faint); font-weight:400;}
.affluent .field-box{display:flex; align-items:center; border:1px solid var(--line2); border-radius:10px; background:var(--card2); overflow:hidden; transition:border-color .15s,box-shadow .15s;}
.affluent .field-box:focus-within{border-color:var(--deep); box-shadow:0 0 0 3px rgba(15,49,56,.1);}
.affluent .field-pre{padding:0 0 0 12px; color:var(--faint); font-size:13px; font-family:'IBM Plex Mono',monospace;}
.affluent .field-box input,.affluent .field-box select{flex:1; width:100%; border:0; background:transparent; padding:10px 12px; font:inherit; font-family:'IBM Plex Mono',monospace; font-size:14px; color:var(--ink); outline:none;}
.affluent .field-box.text input{font-family:'Inter',sans-serif;}
.affluent select.bare{border:1px solid var(--line2); border-radius:10px; background:var(--card2); padding:9px 12px; font:inherit; font-size:13px; color:var(--ink); outline:none;}
.affluent select.bare:focus{border-color:var(--deep);}
.affluent select.bare option{background:var(--card); color:var(--ink);}
/* inline name-edit inputs: blend with the card surface and follow the theme */
.affluent input.bare{border:1px solid transparent; border-radius:8px; background:transparent; color:var(--ink); font:inherit; font-size:13px; outline:none;}
.affluent input.bare:hover{border-color:var(--line);}
.affluent input.bare:focus{background:var(--card2); border-color:var(--deep);}

.affluent .slider{display:block; margin-bottom:13px;}
.affluent .slider-top{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:7px;}
.affluent .slider-top .v{font-size:13px; color:var(--deep); font-weight:600; font-family:'IBM Plex Mono',monospace;}
.affluent input[type=range]{width:100%; -webkit-appearance:none; appearance:none; height:5px; background:var(--line2); border-radius:5px; outline:none;}
.affluent input[type=range]::-webkit-slider-thumb{-webkit-appearance:none; width:17px; height:17px; border-radius:50%; background:var(--coral); cursor:pointer; border:2px solid var(--card); box-shadow:0 0 0 1px var(--coral),var(--shadow);}
.affluent input[type=range]::-moz-range-thumb{width:15px; height:15px; border-radius:50%; background:var(--coral); cursor:pointer; border:2px solid var(--card);}
.affluent input[type=range]:focus-visible{box-shadow:0 0 0 3px rgba(221,92,54,.3);}

.affluent .seg{display:inline-flex; background:var(--card2); border:1px solid var(--line); border-radius:999px; padding:3px;}
.affluent .seg button{border:0; background:transparent; color:var(--muted); font-size:12.5px; font-weight:600; padding:6px 13px; border-radius:999px; display:flex; align-items:center; gap:5px;}
.affluent .seg button.on{background:var(--deepbg); color:#fff;}

/* ---------------- bars / progress ---------------- */
.affluent .bar{display:flex; height:22px; border-radius:8px; overflow:hidden; border:1px solid var(--line); background:var(--card2);}
.affluent .bar.tall{height:28px;}
.affluent .bar-seg{display:flex; align-items:center; justify-content:center; color:#fff; font-size:10.5px; white-space:nowrap; min-width:0; transition:width .5s cubic-bezier(.2,.7,.2,1); padding:0 6px; overflow:hidden;}
.affluent .prog{height:9px; border-radius:6px; background:var(--line2); overflow:hidden;}
.affluent .prog-fill{height:100%; border-radius:6px; background:var(--jade); transition:width .6s cubic-bezier(.2,.7,.2,1);}
.affluent .prog-fill.coral{background:var(--coral);} .affluent .prog-fill.gold{background:var(--gold);}
.affluent .legend{display:flex; gap:14px; flex-wrap:wrap; font-size:11.5px; color:var(--muted); margin-top:9px;}
.affluent .legend span{display:inline-flex; align-items:center; gap:6px;}
.affluent .legend i{width:9px; height:9px; border-radius:3px; display:inline-block;}

/* ---------------- tables ---------------- */
.affluent .tbl{width:100%; border-collapse:collapse;}
.affluent .tbl th{text-align:right; font-size:10.5px; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); font-weight:700; padding:0 0 9px; font-family:'Inter',sans-serif;}
.affluent .tbl th:first-child,.affluent .tbl td:first-child{text-align:left;}
.affluent .tbl td{text-align:right; padding:9px 0; font-size:13px; border-top:1px solid var(--line); white-space:nowrap;}
.affluent .tbl.compact td{padding:7px 0; font-size:12.5px;}
.affluent .tbl-wrap{overflow-x:auto; margin:0 -2px;}
.affluent .card.deep .tbl td{border-color:rgba(255,255,255,.14);}
.affluent .card.deep .tbl th{color:rgba(234,241,237,.6);}

/* ---------------- rows / list ---------------- */
.affluent .row{display:flex; align-items:center; gap:10px;}
.affluent .between{display:flex; align-items:center; justify-content:space-between; gap:12px;}
.affluent .wrap{flex-wrap:wrap;}
.affluent .list-row{display:flex; align-items:center; gap:10px; padding:10px 0; border-top:1px solid var(--line);}
.affluent .list-row:first-child{border-top:0;}
.affluent .readrow{display:flex; justify-content:space-between; align-items:center; gap:12px; font-size:13px; padding:6px 0;}
.affluent .readrow + .readrow{border-top:1px solid var(--line);}
.affluent .relief-group{display:flex; align-items:center; gap:7px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--deep); margin:6px 0 12px; padding-bottom:7px; border-bottom:1px solid var(--line);}
.affluent .chip.toggle{cursor:pointer; padding:9px 14px; font-size:13px; justify-content:center; min-width:70px; width:100%;}
.affluent .chip.toggle.ok{border-color:rgba(47,127,102,.35);}
.affluent .lr-name{font-weight:600; font-size:13.5px;}
.affluent .lr-sub{font-size:11.5px; color:var(--muted);}
.affluent .grow{flex:1; min-width:0;}

/* ---------------- action / callout ---------------- */
.affluent .action{display:flex; gap:12px; align-items:flex-start; padding:13px 15px; border-radius:12px; border:1px solid var(--line); background:var(--card2); border-left:3px solid var(--jade);}
.affluent .action.do{border-left-color:var(--coral);}
.affluent .action.warn{border-left-color:var(--warn);}
.affluent .action-ico{flex-shrink:0; width:30px; height:30px; border-radius:9px; display:flex; align-items:center; justify-content:center; background:rgba(47,127,102,.12); color:var(--jade);}
.affluent .action.do .action-ico{background:rgba(221,92,54,.12); color:var(--coral);}
.affluent .action.warn .action-ico{background:rgba(200,134,31,.12); color:var(--warn);}
.affluent .action h4{font-size:13.5px; margin-bottom:3px;}
.affluent .action p{margin:0; font-size:12.5px; color:var(--muted); line-height:1.5;}
.affluent .action b{color:var(--ink);}
@media(max-width:760px){.affluent .gaps-grid{grid-template-columns:1fr;}}

/* ---------------- policy editor (type-aware cards) ---------------- */
.affluent .pol-list{display:flex; flex-direction:column; gap:10px;}
.affluent .pol-card{border:1px solid var(--line); border-radius:12px; padding:12px 14px; background:var(--card2);}
.affluent .pol-head{display:flex; gap:10px; align-items:center;}
.affluent .pol-name{flex:1; min-width:0; padding:6px 8px; font-family:inherit; font-weight:600; font-size:13.5px;}
.affluent .pol-head select.bare{flex-shrink:0;}
.affluent .pol-body{display:flex; flex-wrap:wrap; gap:10px 14px; margin-top:11px;}
.affluent .pol-field{display:flex; flex-direction:column; gap:5px; flex:1 1 130px; min-width:118px;}
.affluent .pol-flabel{font-size:10.5px; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); font-weight:600;}
.affluent .pol-flabel em{text-transform:none; letter-spacing:0; font-style:normal; color:var(--faint);}
.affluent .pol-note{font-size:12px; margin-top:10px; line-height:1.5;}
.affluent .pol-totals{display:flex; flex-wrap:wrap; gap:8px 18px; margin-top:12px; padding-top:11px; border-top:1px solid var(--line); font-size:12.5px; color:var(--muted);}
.affluent .pol-totals b{color:var(--ink); margin-left:3px;}

/* ---------------- charts ---------------- */
.affluent .chart{width:100%; height:auto; display:block; overflow:visible;}
.affluent .axis{display:flex; justify-content:space-between; font-size:10.5px; color:var(--faint); font-family:'IBM Plex Mono',monospace; margin-top:5px;}
.affluent .gridline{stroke:var(--line); stroke-width:1; stroke-dasharray:2 3;}
.affluent .card.deep .gridline{stroke:rgba(255,255,255,.16);}
/* fixed-size HTML overlay labels — stay ~9px regardless of how wide the chart scales */
.affluent .chart-ylabel{position:absolute; transform:translateY(-50%); font-size:9.5px; line-height:1; color:var(--faint); font-family:'IBM Plex Mono',monospace; font-feature-settings:"tnum" 1; white-space:nowrap; pointer-events:none; background:var(--card); padding:1px 5px 1px 2px; border-radius:3px;}
.affluent .card.deep .chart-ylabel{background:var(--deepbg);}
.affluent .chart-note-html{position:absolute; transform:translate(4px,-1px); font-size:9px; line-height:1; color:var(--faint); font-family:'Inter',sans-serif; letter-spacing:.02em; white-space:nowrap; pointer-events:none;}
.affluent .card.deep .chart-ylabel,.affluent .card.deep .chart-note-html{color:rgba(234,241,237,.62);}
.affluent .marker{stroke:var(--line2); stroke-width:1; stroke-dasharray:3 3;}
.affluent .chart-wrap{position:relative;}
.affluent .chart{cursor:crosshair;}
.affluent .hover-line{stroke:var(--ink); opacity:.28; stroke-width:1; stroke-dasharray:3 3;}
.affluent .card.deep .hover-line{stroke:#fff; opacity:.4;}
.affluent .hover-dot{fill:#fff; stroke:var(--deep); stroke-width:2;}
.affluent .chart-tip{position:absolute; top:2px; transform:translateX(-50%); background:var(--deepbg); color:#EAF1ED; border:1px solid var(--deepbg2); border-radius:10px; padding:8px 11px; font-size:11px; pointer-events:none; box-shadow:var(--shadow-lg); white-space:nowrap; z-index:6; min-width:128px;}
.affluent .chart-tip .tt-head{font-weight:700; font-size:10px; opacity:.65; margin-bottom:5px; text-transform:uppercase; letter-spacing:.05em;}
.affluent .chart-tip .tt-row{display:flex; align-items:center; justify-content:space-between; gap:14px; margin-top:3px;}
.affluent .chart-tip .tt-row span{display:flex; align-items:center; gap:6px; opacity:.85;}
.affluent .chart-tip .tt-row i{width:8px; height:8px; border-radius:2px; display:inline-block;}
.affluent .chart-tip .tt-row b{font-family:'IBM Plex Mono',monospace; font-weight:600;}
.affluent .chart-tip .tt-total{margin-top:6px; padding-top:5px; border-top:1px solid rgba(255,255,255,.18); opacity:1;}

/* ---------------- working / disclosure ---------------- */
.affluent .working{margin-top:14px; border-top:1px solid var(--line); padding-top:11px;}
.affluent .card.deep .working{border-color:rgba(255,255,255,.16);}
.affluent .working-toggle{display:flex; align-items:center; gap:6px; background:none; border:0; font-size:12px; color:inherit; opacity:.75; padding:0;}
.affluent .working-toggle .rot{transform:rotate(180deg);}
.affluent .working-body{margin-top:11px; font-size:12.5px; color:var(--muted); line-height:1.6;}
.affluent .note{font-size:12px; color:var(--muted); line-height:1.55;}

/* ---------------- misc ---------------- */
.affluent .empty{text-align:center; padding:26px 16px; color:var(--faint); font-size:13px;}
.affluent .badge-soft{font-size:11px; background:rgba(15,49,56,.06); color:var(--deep); padding:3px 8px; border-radius:7px; font-weight:600;}
.affluent .kbd{font-family:'IBM Plex Mono',monospace; font-size:11px; background:var(--card2); border:1px solid var(--line); border-radius:5px; padding:1px 5px;}
.affluent .toast{position:absolute; bottom:18px; left:50%; transform:translateX(-50%); background:var(--deepbg); color:#fff; padding:10px 18px; border-radius:10px; font-size:13px; box-shadow:var(--shadow-lg); z-index:80;}
.affluent a.link{color:var(--jade); text-decoration:none; border-bottom:1px solid rgba(47,127,102,.35);}

/* ---------------- theme toggle + transitions ---------------- */
.affluent, .affluent .card, .affluent .rail, .affluent .mobile-top, .affluent .field-box, .affluent .btn, .affluent .chip{transition:background-color .28s ease, color .22s ease, border-color .22s ease;}
.affluent .theme-toggle{display:flex; align-items:center; gap:9px; width:100%; border:1px solid var(--line); background:transparent; color:var(--muted); border-radius:10px; padding:8px 12px; font-size:12.5px; font-weight:600;}
.affluent .theme-toggle:hover{background:var(--tint); color:var(--ink); border-color:var(--line2);}
.affluent .icon-btn.ghost-icon{border-color:var(--line); color:var(--muted);}
.affluent .icon-btn.ghost-icon:hover{color:var(--ink); border-color:var(--deep);}

/* ---------------- onboarding ---------------- */
.affluent .onboard{position:absolute; inset:0; z-index:60; background:color-mix(in srgb,var(--paper) 72%, transparent); backdrop-filter:blur(9px); display:flex; align-items:center; justify-content:center; padding:18px; overflow-y:auto; animation:af-fade .3s ease;}
@keyframes af-fade{from{opacity:0;} to{opacity:1;}}
.affluent .onboard-card{width:100%; max-width:430px; background:var(--card); border:1px solid var(--line); border-radius:18px; padding:26px; box-shadow:var(--shadow-lg); margin:auto;}
.affluent .onboard-mark{width:46px; height:46px; border-radius:13px; background:linear-gradient(140deg,var(--deep),var(--jade)); color:#fff; display:flex; align-items:center; justify-content:center; margin-bottom:15px; box-shadow:var(--shadow);}
.affluent .onboard-card h2{font-size:23px; margin-bottom:8px;}
.affluent .onboard-sub{color:var(--muted); font-size:13px; line-height:1.55; margin:0 0 15px;}
.affluent .onboard-priv{display:flex; align-items:center; gap:8px; font-size:11.5px; color:var(--jade); background:rgba(47,127,102,.08); border:1px solid rgba(47,127,102,.22); border-radius:10px; padding:9px 12px; margin-bottom:18px;}
.affluent .onboard-note{font-size:11px; color:var(--faint); text-align:center; margin:12px 0 0; line-height:1.5;}

/* ---------------- view transition ---------------- */
.affluent .view-anim{animation:af-in .28s cubic-bezier(.2,.7,.2,1);}
@keyframes af-in{from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:none;}}
@media(prefers-reduced-motion:reduce){.affluent .view-anim{animation:none;} .affluent *{transition:none !important;}}

/* ---------------- dark theme ---------------- */
.affluent[data-theme="dark"]{
  --paper:#0C1316; --ink:#E8EFEC; --muted:#9AAEA9; --faint:#647B78;
  --deep:#69C2A8;
  --deepbg:#12393F; --deepbg2:#0C2A30;
  --coral:#EC6E47; --jade:#52B08F; --gold:#D29B57; --sky:#6FA9B2;
  --ok:#52B08F; --warn:#D8A23E; --bad:#E46A4D;
  --line:rgba(255,255,255,.085); --line2:rgba(255,255,255,.15);
  --card:#141E21; --card2:#1A262A; --tint:rgba(255,255,255,.05);
  --shadow:0 1px 2px rgba(0,0,0,.35),0 12px 30px -20px rgba(0,0,0,.8);
  --shadow-lg:0 2px 8px rgba(0,0,0,.45),0 32px 64px -32px rgba(0,0,0,.9);
}
.affluent[data-theme="dark"] .nav-item:hover{background:rgba(255,255,255,.06);}
.affluent[data-theme="dark"] .btn:not(.primary):not(.deep):hover{background:var(--card2);}
.affluent[data-theme="dark"] .badge-soft{background:rgba(255,255,255,.06);}
.affluent[data-theme="dark"] .chip{background:rgba(255,255,255,.04);}
`;
