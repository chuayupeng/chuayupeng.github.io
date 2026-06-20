import React, { useState } from "react";
import { Sparkles, Lock, ArrowRight, TrendingUp } from "lucide-react";
import { useStore } from "../store";
import { Field, TextField, Slider } from "../ui";

/* First-run welcome. Captures the few anchors that drive everything (age, income),
   makes clear the data is private/local, then drops the user into the dashboard. */
export default function Onboarding({ onClose }: { onClose: () => void }) {
  const { set } = useStore();
  const [name, setName] = useState("");
  const [age, setAge] = useState(30);
  const [salary, setSalary] = useState(6000);
  const [residency, setResidency] = useState<"citizen" | "pr" | "foreigner">("citizen");

  // Start clean: keep the user's details, wipe all the sample lists & balances.
  const build = () => {
    set("profile", (p) => ({ ...p, name: name.trim() || "You", age, residency }));
    set("income", (i) => ({ ...i, monthlySalary: salary }));
    set("budget", (b) => ({ ...b, expenses: [] }));
    set("investments", (inv) => ({ ...inv, holdings: [], snapshots: [] }));
    set("insurance", (ins) => ({ ...ins, policies: [] }));
    set("cpf", (c) => ({ ...c, oa: 0, sa: 0, ma: 0, ra: 0, oaDrawMonthly: 0, annualTopUp: 0 }));
    set("goals", () => []);
    onClose();
  };

  return (
    <div className="onboard">
      <div className="onboard-card">
        <div className="onboard-mark"><TrendingUp size={22} /></div>
        <h2>Welcome to af<b style={{ color: "var(--coral)" }}>.</b>fluent</h2>
        <p className="onboard-sub">Your whole financial life — budget, investments, CPF, retirement, goals and insurance — planned in one place, with one instruction at the end: exactly what to do.</p>

        <div className="onboard-priv"><Lock size={13} /> Everything you enter stays in this browser. No account, no server, nothing leaves your device.</div>

        <div className="onboard-form">
          <TextField label="What should we call you?" value={name} onChange={setName} placeholder="Your name" />
          <Slider label="Your age" value={age} onChange={setAge} min={18} max={70} step={1} fmt={(v) => `${v}`} />
          <Field label="Gross monthly salary" value={salary} onChange={setSalary} step={250} />
          <label className="field">
            <span className="field-label">Residency</span>
            <div className="seg" style={{ width: "100%" }}>
              {(["citizen", "pr", "foreigner"] as const).map((r) => (
                <button key={r} className={residency === r ? "on" : ""} style={{ flex: 1, justifyContent: "center" }} onClick={() => setResidency(r)}>
                  {r === "citizen" ? "Citizen" : r === "pr" ? "PR" : "Foreigner"}
                </button>
              ))}
            </div>
          </label>
        </div>

        <button className="btn primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={build}>
          <Sparkles size={15} /> Start fresh with my details <ArrowRight size={14} />
        </button>
        <button className="btn ghost" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={onClose}>
          Explore with sample data instead
        </button>
        <p className="onboard-note">Start fresh keeps only what you entered above — add your accounts, expenses and policies as you go. Sample data fills every module with realistic examples to explore first.</p>
      </div>
    </div>
  );
}
