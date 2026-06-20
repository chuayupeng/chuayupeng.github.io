/* ============================================================================
   af.fluent — a local-first personal finance planner for Singapore.
   Tracks your money, budgets, investments, CPF, retirement and insurance in one
   place, and tells you exactly what to do. Everything persists to this browser.
   Default export is the portfolio's lazily-mounted entry point.
   ========================================================================== */
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Wallet, TrendingUp, PiggyBank, Landmark, ShieldCheck,
  Settings as SettingsIcon, TrendingUp as Mark, Target, Receipt,
  Sun, Moon, type LucideIcon,
} from "lucide-react";
import { CSS } from "./styles";
import { StoreProvider } from "./store";
import { NavContext } from "./nav";
import { useDerived } from "./derive";
import { sgdShort } from "./format";

import Dashboard from "./views/Dashboard";
import Cashflow from "./views/Cashflow";
import Investments from "./views/Investments";
import Goals from "./views/Goals";
import Retirement from "./views/Retirement";
import Tax from "./views/Tax";
import Cpf from "./views/Cpf";
import Insurance from "./views/Insurance";
import Settings from "./views/Settings";
import Onboarding from "./views/Onboarding";

type ViewKey = "dashboard" | "cashflow" | "investments" | "goals" | "retirement" | "tax" | "cpf" | "insurance" | "settings";

const NAV: { key: ViewKey; label: string; icon: LucideIcon; title: string; sub: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, title: "Dashboard", sub: "Your whole financial picture, and what to do next." },
  { key: "cashflow", label: "Cashflow", icon: Wallet, title: "Cashflow & budget", sub: "Where your money goes each month, and what's left to invest." },
  { key: "investments", label: "Investments", icon: TrendingUp, title: "Investments & net worth", sub: "Every account in one place, tracked over time." },
  { key: "goals", label: "Goals", icon: Target, title: "Goals", sub: "House, wedding, education — exactly what to set aside, and when you'll get there." },
  { key: "retirement", label: "Retirement", icon: PiggyBank, title: "Retirement & ETF plan", sub: "Exactly how much to invest, and what it becomes." },
  { key: "tax", label: "Tax", icon: Receipt, title: "Income tax & reliefs", sub: "Your tax, where it comes from, and how to cut it." },
  { key: "cpf", label: "CPF", icon: Landmark, title: "CPF", sub: "Contributions today and your trajectory to CPF LIFE." },
  { key: "insurance", label: "Insurance", icon: ShieldCheck, title: "Insurance & protection", sub: "Make sure every risk is actually covered." },
  { key: "settings", label: "Settings", icon: SettingsIcon, title: "Settings", sub: "Your profile, your data, and the methodology." },
];

function Shell({ theme, onToggleTheme }: { theme: "light" | "dark"; onToggleTheme: () => void }) {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [toast, setToast] = useState<string | null>(null);
  const [onboarding, setOnboarding] = useState(() => {
    try { return !localStorage.getItem("affluent.state") && !localStorage.getItem("affluent.onboarded"); }
    catch { return false; }
  });
  const closeOnboarding = () => {
    try { localStorage.setItem("affluent.onboarded", "1"); } catch { /* ignore */ }
    setOnboarding(false);
  };
  const stageRef = useRef<HTMLDivElement>(null);
  const d = useDerived();

  // reset the scroll position to the top of the panel whenever the view changes
  useEffect(() => { stageRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, [view]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const meta = NAV.find((n) => n.key === view)!;
  const badge = (k: ViewKey) =>
    k === "insurance" && d.protectionGaps > 0 ? d.protectionGaps :
    k === "goals" && d.goalsOffTrack > 0 ? d.goalsOffTrack :
    k === "retirement" && !d.retire.onTrack ? "!" : null;

  const render = () => {
    switch (view) {
      case "dashboard": return <Dashboard go={(v) => setView(v as ViewKey)} />;
      case "cashflow": return <Cashflow />;
      case "investments": return <Investments />;
      case "goals": return <Goals />;
      case "retirement": return <Retirement />;
      case "tax": return <Tax />;
      case "cpf": return <Cpf />;
      case "insurance": return <Insurance />;
      case "settings": return <Settings onToast={setToast} />;
    }
  };

  const Brand = (
    <div className="brand">
      <span className="brand-mark"><Mark size={17} /></span>
      <span className="brand-name">af<b>.</b>fluent</span>
    </div>
  );

  return (
    <div className="app">
      {/* desktop sidebar */}
      <nav className="rail" aria-label="Sections">
        {Brand}
        {NAV.map((n) => {
          const b = badge(n.key);
          return (
            <button key={n.key} className={`nav-item ${view === n.key ? "on" : ""}`} onClick={() => setView(n.key)}
              aria-current={view === n.key ? "page" : undefined}>
              <n.icon size={17} /> {n.label}
              {b != null && <span className="nav-badge" aria-label={typeof b === "number" ? `${b} need attention` : "needs attention"}>{b}</span>}
            </button>
          );
        })}
        <div className="rail-foot">
          <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            <span>{theme === "light" ? "Dark" : "Light"} mode</span>
          </button>
          <div className="rail-net">Net worth<b className="num">{sgdShort(d.netWorth)}</b></div>
        </div>
      </nav>

      {/* mobile top nav */}
      <div className="mobile-top">
        <div className="mtop-bar">
          {Brand}
          <div className="row" style={{ gap: 10 }}>
            <button className="icon-btn ghost-icon" onClick={onToggleTheme} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <div className="rail-net" style={{ textAlign: "right" }}>Net worth<b className="num">{sgdShort(d.netWorth)}</b></div>
          </div>
        </div>
        <div className="mtabs">
          {NAV.map((n) => {
            const b = badge(n.key);
            return (
              <button key={n.key} className={`mtab ${view === n.key ? "on" : ""}`} onClick={() => setView(n.key)}>
                <n.icon size={15} /> {n.label}
                {b != null && <span className="nav-badge">{b}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="stage" ref={stageRef}>
        <div className="stage-top">
          <div className="stage-title">
            <h1>{meta.title}</h1>
            <p>{meta.sub}</p>
          </div>
        </div>
        <NavContext.Provider value={(v) => setView(v as ViewKey)}>
          <div className="view-anim" key={view}>{render()}</div>
        </NavContext.Provider>
      </div>

      {toast && <div className="toast">{toast}</div>}
      {onboarding && <Onboarding onClose={closeOnboarding} />}
    </div>
  );
}

function useTheme(): ["light" | "dark", () => void] {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("affluent.theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => { try { localStorage.setItem("affluent.theme", theme); } catch { /* ignore */ } }, [theme]);
  return [theme, () => setTheme((t) => (t === "light" ? "dark" : "light"))];
}

/* Safety net: a render crash (e.g. from a corrupt import) shows a recovery card
   instead of a permanent white screen. */
class Boundary extends React.Component<{ children: React.ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 32, textAlign: "center", maxWidth: 420, margin: "60px auto" }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", marginBottom: 10 }}>Something went wrong</h2>
          <p className="muted" style={{ fontSize: 13, marginBottom: 18 }}>Your saved data couldn't be loaded. Resetting clears it and starts fresh — your other browser data is untouched.</p>
          <button className="btn primary" onClick={() => { try { localStorage.removeItem("affluent.state"); } catch { /* ignore */ } location.reload(); }}>
            Reset & reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AffluentApp({ embedded = true }: { embedded?: boolean }) {
  const [theme, toggleTheme] = useTheme();
  return (
    <div className={`affluent${embedded ? "" : " standalone"}`} data-theme={theme}>
      <style>{CSS}</style>
      <Boundary>
        <StoreProvider>
          <Shell theme={theme} onToggleTheme={toggleTheme} />
        </StoreProvider>
      </Boundary>
    </div>
  );
}
