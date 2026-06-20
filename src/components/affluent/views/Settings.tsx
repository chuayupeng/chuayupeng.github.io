import React, { useRef, useState } from "react";
import { User, Download, Upload, RotateCcw, BookOpen, Database, Wallet, Landmark, PiggyBank, Lock, Eye, EyeOff, Trash2 } from "lucide-react";
import { useStore } from "../store";
import { Field, Slider, Select, TextField, Working } from "../ui";
import { CPF } from "../calc/cpf";
import { sgd, pct } from "../format";
import { encryptJSON, decryptJSON, isEncrypted, cryptoAvailable } from "../crypto";

export default function Settings({ onToast }: { onToast: (s: string) => void }) {
  const { state, set, reset, clear, exportJSON, importJSON } = useStore();
  const p = state.profile;
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState<"reset" | "clear" | null>(null);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  // an encrypted file waiting for its password (prompted after the file is picked)
  const [pendingEncrypted, setPendingEncrypted] = useState<string | null>(null);
  const [importPw, setImportPw] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const download = (content: string, name: string) => {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  const doExport = async () => {
    const raw = exportJSON();
    const usePw = pw.trim().length > 0;
    if (!usePw) { download(raw, "affluent-data.json"); onToast("Backup exported (unencrypted)"); return; }
    setBusy(true);
    try {
      const encrypted = await encryptJSON(raw, pw);
      download(encrypted, "affluent-data.encrypted.json");
      onToast("Encrypted backup exported");
    } catch { onToast("Couldn't encrypt — try again"); }
    finally { setBusy(false); }
  };

  // Pick the file first; only prompt for a password if it turns out to be encrypted.
  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      if (isEncrypted(text)) {
        setPendingEncrypted(text); setImportPw(""); setImportError(null);
      } else {
        onToast(importJSON(text) ? "Data imported" : "Import failed — invalid file");
      }
    };
    reader.readAsText(file);
  };

  const doUnlock = async () => {
    if (!pendingEncrypted || busy) return;
    setBusy(true); setImportError(null);
    try {
      const text = await decryptJSON(pendingEncrypted, importPw);
      if (importJSON(text)) { onToast("Backup imported"); setPendingEncrypted(null); setImportPw(""); }
      else setImportError("That backup file is invalid.");
    } catch {
      setImportError("Wrong password — try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="grid g2">
      <section className="card">
        <div className="eyebrow"><User size={14} /> Profile</div>
        <TextField label="Name" value={p.name} onChange={(v) => set("profile", (s) => ({ ...s, name: v }))} />
        <Slider label="Age" value={p.age} onChange={(n) => set("profile", (s) => ({ ...s, age: n }))} min={18} max={75} step={1} fmt={(v) => `${v}`} />
        <Slider label="Retirement age" value={p.retireAge} onChange={(n) => set("profile", (s) => ({ ...s, retireAge: n }))} min={Math.max(45, p.age + 1)} max={Math.min(75, p.lifeExpectancy - 1)} step={1} fmt={(v) => `${v}`} />
        <Slider label="Plan to age" value={p.lifeExpectancy} onChange={(n) => set("profile", (s) => ({ ...s, lifeExpectancy: n }))} min={75} max={100} step={1} fmt={(v) => `${v}`} />
        <div className="between" style={{ marginTop: 4 }}>
          <span className="field-label" style={{ margin: 0 }}>Residency</span>
          <Select value={p.residency} onChange={(v) => set("profile", (s) => ({ ...s, residency: v }))}
            options={[{ value: "citizen", label: "Citizen" }, { value: "pr", label: "PR" }, { value: "foreigner", label: "Foreigner" }]} />
        </div>
      </section>

      <section className="card">
        <div className="eyebrow"><Wallet size={14} /> Income</div>
        <p className="note" style={{ marginTop: -6, marginBottom: 12 }}>Drives your take-home, CPF, tax and what's left to invest.</p>
        <Field label="Gross monthly salary" value={state.income.monthlySalary} onChange={(n) => set("income", (s) => ({ ...s, monthlySalary: n }))} step={250} />
        <Field label="Annual bonus" value={state.income.annualBonus} onChange={(n) => set("income", (s) => ({ ...s, annualBonus: n }))} step={1000} />
        <Field label="Other monthly income" value={state.income.otherMonthly} onChange={(n) => set("income", (s) => ({ ...s, otherMonthly: n }))} step={100} hint="rental / side" />
        <Slider label="Expected salary growth" value={state.income.salaryGrowth} onChange={(n) => set("income", (s) => ({ ...s, salaryGrowth: n }))} min={0} max={0.08} step={0.005} fmt={pct} />
      </section>

      <section className="card">
        <div className="eyebrow"><Landmark size={14} /> CPF balances</div>
        <p className="note" style={{ marginTop: -6, marginBottom: 12 }}>From your latest CPF statement.</p>
        <Field label="Ordinary Account (OA)" value={state.cpf.oa} onChange={(n) => set("cpf", (s) => ({ ...s, oa: n }))} step={5000} />
        <Field label={p.age < 55 ? "Special Account (SA)" : "Retirement Account (RA)"}
          value={p.age < 55 ? state.cpf.sa : state.cpf.ra}
          onChange={(n) => set("cpf", (s) => p.age < 55 ? ({ ...s, sa: n }) : ({ ...s, ra: n }))} step={5000} />
        <Field label="MediSave (MA)" value={state.cpf.ma} onChange={(n) => set("cpf", (s) => ({ ...s, ma: n }))} step={5000} />
        <Field label="OA used / month" value={state.cpf.oaDrawMonthly} onChange={(n) => set("cpf", (s) => ({ ...s, oaDrawMonthly: n }))} step={100} hint="housing / invest" />
        <Field label="Annual top-up (RSTU)" value={state.cpf.annualTopUp} onChange={(n) => set("cpf", (s) => ({ ...s, annualTopUp: n }))} step={1000} hint="to SA/RA" />
      </section>

      <section className="card">
        <div className="eyebrow"><PiggyBank size={14} /> Retirement targets &amp; assumptions</div>
        <p className="note" style={{ marginTop: -6, marginBottom: 12 }}>You can also tweak these live on the Retirement tab.</p>
        <Slider label="Desired retirement income" value={state.retirement.desiredMonthlyIncome} onChange={(n) => set("retirement", (s) => ({ ...s, desiredMonthlyIncome: n }))} min={1500} max={15000} step={250} fmt={(v) => sgd(v) + "/mo"} />
        <Slider label="Return while investing" value={state.retirement.returnPre} onChange={(n) => set("retirement", (s) => ({ ...s, returnPre: n }))} min={0.02} max={0.10} step={0.005} fmt={pct} />
        <Slider label="Return in retirement" value={state.retirement.returnPost} onChange={(n) => set("retirement", (s) => ({ ...s, returnPost: n }))} min={0.01} max={0.07} step={0.005} fmt={pct} />
        <Slider label="Inflation" value={state.retirement.inflation} onChange={(n) => set("retirement", (s) => ({ ...s, inflation: n }))} min={0.01} max={0.05} step={0.0025} fmt={pct} />
      </section>

      <section className="card">
        <div className="eyebrow"><Database size={14} /> Your data</div>
        <p className="note" style={{ marginBottom: 14 }}>
          Everything you enter is stored only in this browser — nothing leaves your device. Export a backup to move it to another device or keep it safe.
        </p>

        {cryptoAvailable() && (
          <label className="field">
            <span className="field-label"><span className="row" style={{ gap: 6 }}><Lock size={12} /> Backup password</span><em>optional — encrypts the file</em></span>
            <span className="field-box text">
              <input type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Leave blank for a plain backup" autoComplete="off" maxLength={128} />
              <button className="icon-btn ghost-icon" style={{ border: 0, marginRight: 4 }} onClick={() => setShowPw((s) => !s)} type="button" aria-label="Show or hide password">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </span>
          </label>
        )}

        <div className="row wrap" style={{ gap: 8 }}>
          <button className="btn" disabled={busy} onClick={doExport}>
            {pw.trim() ? <><Lock size={14} /> Export encrypted</> : <><Download size={14} /> Export backup</>}
          </button>
          <button className="btn" disabled={busy} onClick={() => fileRef.current?.click()}><Upload size={14} /> Import backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) doImport(f); e.target.value = ""; }} />
        </div>

        {pendingEncrypted && (
          <div className="card tight" style={{ marginTop: 10, borderLeft: "3px solid var(--coral)" }}>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}><Lock size={14} /><b style={{ fontSize: 13 }}>This backup is encrypted</b></div>
            <p className="note" style={{ margin: "0 0 9px" }}>Enter the password it was exported with to unlock it.</p>
            <span className="field-box text" style={{ marginBottom: importError ? 6 : 9 }}>
              <input type="password" value={importPw} autoFocus placeholder="Backup password" autoComplete="off" maxLength={128}
                onChange={(e) => { setImportPw(e.target.value); setImportError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") doUnlock(); }} />
            </span>
            {importError && <p className="note" style={{ color: "var(--bad)", margin: "0 0 9px" }}>{importError}</p>}
            <div className="row wrap" style={{ gap: 8 }}>
              <button className="btn primary sm" disabled={busy || !importPw} onClick={doUnlock}><Lock size={13} /> {busy ? "Unlocking…" : "Unlock & import"}</button>
              <button className="btn sm" disabled={busy} onClick={() => { setPendingEncrypted(null); setImportPw(""); setImportError(null); }}>Cancel</button>
            </div>
          </div>
        )}

        <p className="note" style={{ marginTop: 10, fontSize: 11.5 }}>
          {pw.trim()
            ? <>Your backup will be encrypted (AES-256) with this password — keep it safe, there's no recovery. You'll be asked for it when you import the file.</>
            : <>Set a password to encrypt the export so only you can open it. It encrypts the file only — your data stays unencrypted in this browser so the app can use it.</>}
        </p>
        <div className="hr" />
        <div className="row wrap" style={{ gap: 8 }}>
          <button className="btn ghost" onClick={() => setConfirm("reset")}><RotateCcw size={14} /> Reset to sample data</button>
          <button className="btn ghost" onClick={() => setConfirm("clear")}><Trash2 size={14} /> Clear all data</button>
        </div>
        {confirm && (
          <div className="row wrap" style={{ gap: 8, marginTop: 10 }}>
            <span className="note">{confirm === "reset" ? "Replace everything with the sample data?" : "Erase everything and start from a blank slate? This can't be undone."}</span>
            <button className="btn primary sm" onClick={() => { const c = confirm; if (c === "reset") reset(); else clear(); setConfirm(null); onToast(c === "reset" ? "Reset to sample data" : "All data cleared"); }}>
              {confirm === "reset" ? "Yes, reset" : "Yes, clear all"}
            </button>
            <button className="btn sm" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        )}
      </section>

      <section className="card span2">
        <div className="eyebrow"><BookOpen size={14} /> Methodology & sources</div>
        <p className="note">
          Figures are dated to <b>1 January 2026</b> and verified against official Singapore sources. They're refreshed each January rather than hardcoded into logic.
        </p>
        <div className="tbl-wrap" style={{ marginTop: 10 }}>
          <table className="tbl compact">
            <thead><tr><th>Parameter</th><th>Value</th><th style={{ textAlign: "left" }}>Source</th></tr></thead>
            <tbody>
              {[
                ["CPF contribution (under 55)", "37% (17% employer + 20% you)", "CPF Board, 1 Jan 2026 table"],
                ["OW ceiling / annual ceiling", `${sgd(CPF.owCeilingMonthly)}/mo · ${sgd(CPF.annualSalaryCeiling)}/yr`, "CPF Board"],
                ["CPF interest", "OA 2.5% · SA/MA/RA 4% floor", "CPF Board (floor to Dec 2026)"],
                ["Retirement sums (turn 55 in 2026)", `BRS ${sgd(CPF.sums.BRS)} · FRS ${sgd(CPF.sums.FRS)} · ERS ${sgd(CPF.sums.ERS)}`, "CPF Board"],
                ["Basic Healthcare Sum 2026", sgd(CPF.BHS), "CPF Board"],
                ["CPF LIFE Standard (est.)", `${sgd(CPF.life.FRS)}/mo at FRS`, "CPF LIFE Estimator"],
                ["Income tax", "Resident rates, YA2024+ (top 24%)", "IRAS"],
                ["SRS cap (citizen/PR)", sgd(15300) + "/yr", "IRAS / MOF"],
                ["Insurance benchmarks", "9× income (death/TPD) · 4× (CI) · ≤15% premiums", "MoneySense / LIA BFPG"],
                ["MediShield Life", "Premiums from 1 Oct 2025, MediSave-payable", "CPF Board / MOH"],
              ].map((r, i) => (
                <tr key={i}><td style={{ textAlign: "left" }}>{r[0]}</td><td className="num" style={{ textAlign: "left" }}>{r[1]}</td><td className="muted" style={{ textAlign: "left" }}>{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Working>
          The 55+ MediSave/RA allocation split and CPF LIFE payouts are modelled estimates — verify against the official CPF allocation table and CPF LIFE Estimator before acting. Investment returns, inflation and drawdown are assumptions you control in the Retirement tab; markets are not guaranteed. This tool gives you prescriptive, opinionated guidance to plan with — it is not a substitute for advice tailored by a licensed professional where you want one.
        </Working>
      </section>
    </div>
  );
}
