import { useState } from 'react';
import {
  ArrowLeft, RefreshCw, Send, Download, Plus, ShieldAlert,
} from 'lucide-react';

/* ============================================================================
   Suzaku — security-awareness / phishing-simulation platform.
   This is a STATIC FRONT-END MOCKUP for portfolio display only: hardcoded
   sample data, no backend, no network, no email/credential functionality.
   Every action button is a visual no-op. Ported from the real product's
   campaign-analytics dashboard and scoped entirely under `.suzaku`.
   ========================================================================== */

const CAMPAIGN = {
  id: 'cmp_7f3a92',
  name: 'Q2 Security Awareness — Wave 1',
  status: 'live',
  platform: 'outlook',
  lure_type: 'teams',
};

const STATS = {
  sent: 512,
  email_opens: 268,
  clicks: 134,
  cred_captures: 61,
  reported: 43,
  by_department: {
    Finance:     { click: 34, cred: 18 },
    Sales:       { click: 31, cred: 15 },
    Operations:  { click: 24, cred: 11 },
    Engineering: { click: 18, cred: 6 },
    HR:          { click: 16, cred: 7 },
    Support:     { click: 11, cred: 4 },
  },
};

const EVENTS = [
  { ts: '14:32:11', email: 'j.tan@northwind.local',     dept: 'Finance',     type: 'cred_submit', ua: 'Chrome/124' },
  { ts: '14:31:58', email: 'm.santos@northwind.local',  dept: 'Sales',       type: 'click',       ua: 'Safari/17' },
  { ts: '14:30:42', email: 'a.okafor@northwind.local',  dept: 'Operations',  type: 'reported',    ua: 'Outlook/16' },
  { ts: '14:29:19', email: 'r.iyer@northwind.local',    dept: 'Finance',     type: 'click',       ua: 'Edge/124' },
  { ts: '14:27:50', email: 'l.dubois@northwind.local',  dept: 'HR',          type: 'email_open',  ua: 'Chrome/124' },
  { ts: '14:26:33', email: 'k.nakamura@northwind.local',dept: 'Engineering', type: 'cred_submit', ua: 'Firefox/126' },
  { ts: '14:25:07', email: 's.petrov@northwind.local',  dept: 'Sales',       type: 'click',       ua: 'Chrome/124' },
  { ts: '14:23:44', email: 'b.adeyemi@northwind.local', dept: 'Support',     type: 'email_open',  ua: 'Mobile/Safari' },
  { ts: '14:22:10', email: 'c.rossi@northwind.local',   dept: 'Operations',  type: 'reported',    ua: 'Outlook/16' },
  { ts: '14:20:58', email: 'd.kim@northwind.local',     dept: 'Finance',     type: 'cred_submit', ua: 'Chrome/123' },
  { ts: '14:19:31', email: 'f.haddad@northwind.local',  dept: 'Sales',       type: 'email_open',  ua: 'Edge/124' },
  { ts: '14:18:02', email: 'g.muller@northwind.local',  dept: 'HR',          type: 'click',       ua: 'Chrome/124' },
  { ts: '14:16:47', email: 'p.nguyen@northwind.local',  dept: 'Engineering', type: 'email_open',  ua: 'Safari/17' },
  { ts: '14:15:20', email: 'v.silva@northwind.local',   dept: 'Operations',  type: 'click',       ua: 'Chrome/124' },
];

const TARGETS = [
  { email: 'j.tan@northwind.local',      name: 'Jia Tan',        dept: 'Finance',     sent: true },
  { email: 'm.santos@northwind.local',   name: 'Marco Santos',   dept: 'Sales',       sent: true },
  { email: 'a.okafor@northwind.local',   name: 'Ada Okafor',     dept: 'Operations',  sent: true },
  { email: 'r.iyer@northwind.local',     name: 'Rohan Iyer',     dept: 'Finance',     sent: true },
  { email: 'l.dubois@northwind.local',   name: 'Léa Dubois',     dept: 'HR',          sent: true },
  { email: 'k.nakamura@northwind.local', name: 'Kenji Nakamura', dept: 'Engineering', sent: true },
  { email: 's.petrov@northwind.local',   name: 'Sofia Petrov',   dept: 'Sales',       sent: true },
  { email: 'b.adeyemi@northwind.local',  name: 'Bola Adeyemi',   dept: 'Support',     sent: false },
  { email: 'c.rossi@northwind.local',    name: 'Carla Rossi',    dept: 'Operations',  sent: false },
];

const EVT_COLOR: Record<string, string> = {
  email_open: '#a78bfa', click: '#f59e0b', cred_submit: '#ef4444', reported: '#22c55e',
};
const EVT_LABEL: Record<string, string> = {
  email_open: 'Opened', click: 'Clicked', cred_submit: 'Creds Captured', reported: 'Reported',
};

const pct = (v: number) => Math.round((v / STATS.sent) * 100);

function Funnel() {
  const rows = [
    { label: 'Sent',           value: STATS.sent,          color: '#52525b' },
    { label: 'Email Opened',   value: STATS.email_opens,   color: '#a78bfa' },
    { label: 'Link Clicked',   value: STATS.clicks,        color: '#f59e0b' },
    { label: 'Creds Captured', value: STATS.cred_captures, color: '#ef4444' },
    { label: 'Reported',       value: STATS.reported,      color: '#22c55e' },
  ];
  return (
    <div className="card">
      <div className="label">Attack Funnel</div>
      {rows.map((r, i) => (
        <div key={r.label} style={{ marginBottom: i < rows.length - 1 ? 14 : 0 }}>
          <div className="fn-row">
            <span className="fn-name">{r.label}</span>
            <span className="fn-val mono" style={{ color: r.color }}>
              {r.value}<span className="fn-pct">({pct(r.value)}%)</span>
            </span>
          </div>
          <div className="fn-track">
            <div className="fn-fill" style={{ background: r.color, width: `${pct(r.value)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const DEPT_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a78bfa'];

function DeptChart() {
  const data = Object.entries(STATS.by_department)
    .map(([dept, v]) => ({ dept, click: v.click, cred: v.cred }))
    .sort((a, b) => (b.click + b.cred) - (a.click + a.cred));
  const max = Math.max(...data.map((d) => d.click + d.cred), 1);
  return (
    <div className="card">
      <div className="label">By Department</div>
      <div className="dc">
        {data.map((d, i) => (
          <div key={d.dept} className="dc-col">
            <div className="dc-bars">
              <div
                className="dc-bar"
                style={{ height: `${(d.click / max) * 100}%`, background: '#f59e0b' }}
                title={`${d.dept} — clicked ${d.click}`}
              />
              <div
                className="dc-bar"
                style={{ height: `${(d.cred / max) * 100}%`, background: '#ef4444' }}
                title={`${d.dept} — creds ${d.cred}`}
              />
            </div>
            <div className="dc-label" style={{ color: DEPT_COLORS[i % DEPT_COLORS.length] }}>
              {d.dept.slice(0, 4)}
            </div>
          </div>
        ))}
      </div>
      <div className="dc-legend">
        <span><i style={{ background: '#f59e0b' }} /> Clicked</span>
        <span><i style={{ background: '#ef4444' }} /> Creds captured</span>
      </div>
    </div>
  );
}

function EventStream({ rows }: { rows: typeof EVENTS }) {
  return (
    <div className="card span-2">
      <div className="label">Event Stream ({rows.length})</div>
      <div className="ev-head">
        <span>Time</span><span>Email</span><span>Dept</span><span>Event</span><span>Client</span>
      </div>
      <div className="ev-body">
        {rows.map((e, i) => (
          <div
            key={i}
            className="ev-row"
            style={{ background: e.type === 'cred_submit' ? 'rgba(239,68,68,.05)' : 'transparent' }}
          >
            <span className="ev-time mono">{e.ts}</span>
            <span className="ev-email">{e.email}</span>
            <span className="ev-dept">{e.dept}</span>
            <span className="ev-type" style={{ color: EVT_COLOR[e.type] }}>{EVT_LABEL[e.type]}</span>
            <span className="ev-ua">{e.ua}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SuzakuApp() {
  const [tab, setTab] = useState('overview');

  const credRate = Math.round((STATS.cred_captures / STATS.sent) * 100);
  const risk = credRate >= 20 ? ['HIGH', '#ef4444'] : credRate >= 10 ? ['MEDIUM', '#f59e0b'] : ['LOW', '#22c55e'];
  const statusColor = '#22c55e'; // live

  return (
    <div className="suzaku">
      <style>{CSS}</style>

      <header className="header-bar">
        <div className="hb-left">
          <button className="btn-ghost btn-sm"><ArrowLeft size={12} /> Back</button>
          <div className="divider-v" />
          <div>
            <div className="hb-title">{CAMPAIGN.name}</div>
            <div className="hb-sub mono">{CAMPAIGN.id} · {CAMPAIGN.platform} · {CAMPAIGN.lure_type}</div>
          </div>
          <span className="tag" style={{ background: statusColor + '18', color: statusColor, borderColor: statusColor + '30' }}>
            {CAMPAIGN.status}
          </span>
          <span className="tag" style={{ background: risk[1] + '18', color: risk[1], borderColor: risk[1] + '30' }}>
            {risk[0]} RISK
          </span>
        </div>
        <div className="hb-right">
          <button className="btn-ghost btn-sm"><RefreshCw size={11} /> Refresh</button>
          <button className="btn-ghost btn-sm"><Download size={11} /> CSV</button>
          <button className="btn-primary btn-sm"><Send size={11} /> Launch</button>
        </div>
      </header>

      <div className="demo-note">
        <ShieldAlert size={13} />
        UI mockup for portfolio display — sample data, no live sending or capture.
      </div>

      <div className="tab-bar">
        {['overview', 'targets', 'events'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      <main className="su-main">
        {tab === 'overview' && (
          <>
            <div className="stat-row">
              {[
                { l: 'Sent',     v: STATS.sent,          c: '#a1a1aa' },
                { l: 'Opened',   v: STATS.email_opens,   c: '#a78bfa' },
                { l: 'Clicked',  v: STATS.clicks,        c: '#f59e0b' },
                { l: 'Creds',    v: STATS.cred_captures, c: '#ef4444' },
                { l: 'Reported', v: STATS.reported,      c: '#22c55e' },
              ].map((s) => (
                <div key={s.l} className="card stat-tile" style={{ borderTop: `2px solid ${s.c}` }}>
                  <div className="value mono" style={{ color: s.c }}>{s.v}</div>
                  <div className="label tile-label">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="ov-grid">
              <Funnel />
              <DeptChart />
              <EventStream rows={EVENTS.slice(0, 8)} />
            </div>
          </>
        )}

        {tab === 'targets' && (
          <div className="card span-2">
            <div className="label">Targets ({TARGETS.length})</div>
            <div className="tg-head">
              <span>Email</span><span>Name</span><span>Department</span><span>Sent</span>
            </div>
            <div className="tg-body">
              {TARGETS.map((t) => (
                <div key={t.email} className="tg-row">
                  <span className="tg-email">{t.email}</span>
                  <span className="tg-muted">{t.name}</span>
                  <span className="tg-muted">{t.dept}</span>
                  <span style={{ color: t.sent ? '#22c55e' : '#52525b', fontSize: 11 }}>{t.sent ? '✓' : '–'}</span>
                </div>
              ))}
            </div>
            <div className="tg-add">
              <div className="tg-add-label">Paste targets — one per line: email, name, department (CSV)</div>
              <textarea rows={3} readOnly placeholder={'j.chen@corp.local, Jane Chen, Finance\nm.lee@corp.local, Marcus Lee, Engineering'} />
              <button className="btn-primary btn-sm" style={{ marginTop: 10 }}><Plus size={12} /> Add targets</button>
            </div>
          </div>
        )}

        {tab === 'events' && <EventStream rows={EVENTS} />}
      </main>
    </div>
  );
}

const CSS = `
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
`;
