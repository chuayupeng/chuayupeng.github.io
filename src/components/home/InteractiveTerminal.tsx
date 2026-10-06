import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowRight, CornerDownLeft, Wine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { weddingDrinks } from '@/data/houseMenuData';
import './interactive-terminal.css';

type Command = 'help' | 'whoami' | 'alias' | 'id' | 'manifesto' | 'projects' | 'writing' | 'timeline' | 'about' | 'pour' | 'tarot' | 'unknown';
interface TerminalEntry { id: number; input: string; command: Command }

const INITIAL_ENTRIES: TerminalEntry[] = [
  { id: 1, input: 'whoami', command: 'whoami' },
  { id: 2, input: 'alias me', command: 'alias' },
  { id: 3, input: 'id', command: 'id' },
  { id: 4, input: 'cat ~/manifesto.md', command: 'manifesto' },
];

const COMMANDS: Record<string, Command> = {
  help: 'help', whoami: 'whoami', alias: 'alias', 'alias me': 'alias', id: 'id',
  manifesto: 'manifesto', 'cat ~/manifesto.md': 'manifesto', projects: 'projects',
  writing: 'writing', timeline: 'timeline', about: 'about', pour: 'pour', bar: 'pour',
  menu: 'pour', tarot: 'tarot',
};

const HELP_COMMANDS = [
  { command: 'whoami', description: 'The short version' },
  { command: 'projects', description: 'Things I’ve built' },
  { command: 'writing', description: 'Notes and write-ups' },
  { command: 'timeline', description: 'How I got here' },
  { command: 'about', description: 'The longer version' },
  { command: 'pour', description: 'The wedding menu' },
  { command: 'tarot', description: 'The cocktail deck' },
  { command: 'clear', description: 'Clear this window' },
];

const ROUTE_RESPONSES = {
  projects: { path: '/projects', copy: 'Things I’ve built and experiments that escaped the notebook.', label: 'View projects' },
  writing: { path: '/blog', copy: 'Write-ups from the security side of the desk.', label: 'Read the writing' },
  timeline: { path: '/timeline', copy: 'The route here had a few side quests.', label: 'View the timeline' },
  about: { path: '/about', copy: 'The slightly longer version of whoami.', label: 'About me' },
  tarot: { path: '/tarot', copy: 'Greek mythology, cocktails, and a full deck to play with.', label: 'Explore the tarot deck' },
};

const MAX_ENTRIES = 12;
const MAX_HISTORY = 32;

export default function InteractiveTerminal() {
  const uniqueId = useId();
  const [entries, setEntries] = useState<TerminalEntry[]>(INITIAL_ENTRIES);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const inputElement = useRef<HTMLInputElement>(null);
  const outputElement = useRef<HTMLDivElement>(null);
  const latestEntry = useRef<HTMLDivElement>(null);
  const nextId = useRef(INITIAL_ENTRIES.length + 1);
  const draft = useRef('');
  const shouldScroll = useRef(false);

  useEffect(() => {
    if (!shouldScroll.current || !outputElement.current) return;
    shouldScroll.current = false;
    // Scroll the transcript without moving the page or stealing input focus.
    outputElement.current.scrollTop = latestEntry.current?.offsetTop ?? 0;
  }, [entries]);

  function runCommand(value: string) {
    const entered = value.trim();
    if (!entered) return;
    const normalized = entered.toLowerCase().replace(/\s+/g, ' ');
    setInput('');
    setHistoryIndex(null);
    draft.current = '';
    setHistory((previous) => previous[previous.length - 1] === entered ? previous : [...previous, entered].slice(-MAX_HISTORY));
    shouldScroll.current = true;

    if (normalized === 'clear') {
      setEntries([]);
      setAnnouncement('Terminal cleared. The command prompt and shortcuts are still available.');
      return;
    }

    const command = Object.prototype.hasOwnProperty.call(COMMANDS, normalized) ? COMMANDS[normalized] : 'unknown';
    const entry = { id: nextId.current++, input: entered, command };
    setEntries((previous) => [...previous, entry].slice(-MAX_ENTRIES));
    if (command === 'pour') setAnnouncement('Wedding menu shown: five drinks, with a link to their ingredients and stories.');
    else if (command === 'help') setAnnouncement('Available commands shown. You can tap a command or type it below.');
    else if (command === 'unknown') setAnnouncement('Command not found. Try help for the available commands.');
    else setAnnouncement(`${entered}: response added to the terminal output.`);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const restorePrompt = submitter instanceof HTMLButtonElement && document.activeElement !== inputElement.current;
    runCommand(input);
    if (restorePrompt) requestAnimationFrame(() => inputElement.current?.focus({ preventScroll: true }));
  }

  function browseHistory(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || !history.length) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    if (event.key === 'ArrowDown' && historyIndex === null) return;
    event.preventDefault();

    let next: number | null;
    if (event.key === 'ArrowUp') {
      if (historyIndex === null) draft.current = input;
      next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
    } else {
      next = historyIndex! + 1 >= history.length ? null : historyIndex! + 1;
    }
    const recalled = next === null ? draft.current : history[next];
    setHistoryIndex(next);
    setInput(recalled);
    requestAnimationFrame(() => inputElement.current?.setSelectionRange(recalled.length, recalled.length));
  }

  function response(command: Command) {
    if (command in ROUTE_RESPONSES) {
      const route = ROUTE_RESPONSES[command as keyof typeof ROUTE_RESPONSES];
      return <><p>{route.copy}</p><Link className="interactive-terminal__link" to={route.path}>{route.label}<ArrowRight size={13} aria-hidden="true" /></Link></>;
    }
    switch (command) {
      case 'whoami': return <span className="interactive-terminal__bright">yup.eng</span>;
      case 'alias': return <>me=<span className="interactive-terminal__bright">'vificatem'</span></>;
      case 'id': return <>uid=1337(<span className="interactive-terminal__bright">yup.eng</span>) gid=1000(security) groups=security,entrepreneur,f&amp;b</>;
      case 'manifesto': return <>I break and harden systems by day, and build the things I wish existed by night.</>;
      case 'help': return <>
        <p>Pick a command. The bar is under <span className="interactive-terminal__gold">pour</span>.</p>
        <div className="interactive-terminal__help">
          {HELP_COMMANDS.map((item) => <button key={item.command} type="button" onClick={(event) => {
            runCommand(item.command);
            if (item.command === 'clear' && event.detail === 0) requestAnimationFrame(() => inputElement.current?.focus({ preventScroll: true }));
          }} className={item.command === 'pour' ? 'interactive-terminal__bar-command' : undefined}>
            <span>{item.command}</span><small>{item.description}</small>
          </button>)}
        </div>
      </>;
      case 'pour': return <section className="interactive-terminal__menu" aria-label="Wedding menu preview">
        <h3><Wine size={15} aria-hidden="true" />Wedding menu <span>· five drinks</span></h3>
        <ul>{weddingDrinks.map((drink) => <li key={drink.id}>{drink.name}</li>)}</ul>
        <Link className="interactive-terminal__link" to="/bar">Ingredients &amp; stories<ArrowRight size={13} aria-hidden="true" /></Link>
      </section>;
      case 'unknown': return <>Not on the menu. Try <button type="button" className="interactive-terminal__inline-command" onClick={() => runCommand('help')}>help</button>.</>;
      default: return null;
    }
  }

  return (
    <section className="interactive-terminal" aria-label="Explore the site through the terminal">
      <div ref={outputElement} className="interactive-terminal__output" role="region" aria-label="Terminal output" tabIndex={0}>
        {entries.map((entry, index) => <div key={entry.id} ref={index === entries.length - 1 ? latestEntry : undefined} className="interactive-terminal__entry">
          <div className="interactive-terminal__command"><span aria-hidden="true">$</span> <span>{entry.input}</span></div>
          <div className="interactive-terminal__response">{response(entry.command)}</div>
        </div>)}
        {entries.length === 0 && <p className="interactive-terminal__empty">A clean slate. Try <span>help</span> or <span>pour</span>.</p>}
      </div>
      <form className="interactive-terminal__prompt" onSubmit={submit}>
        <span className="interactive-terminal__dollar" aria-hidden="true">$</span>
        <label htmlFor={`${uniqueId}-command`} className="sr-only">Terminal command</label>
        <input ref={inputElement} id={`${uniqueId}-command`} name="command" type="text" value={input} onChange={(event) => { setInput(event.target.value); setHistoryIndex(null); }} onKeyDown={browseHistory} placeholder="Try help or pour" maxLength={120} autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="go" aria-describedby={`${uniqueId}-hint`} />
        <button type="submit" aria-label="Run command" disabled={!input.trim()}><CornerDownLeft size={17} aria-hidden="true" /></button>
      </form>
      <p id={`${uniqueId}-hint`} className="sr-only">Enter a command, or use a shortcut below. Up and down recall your command history. Tab moves between controls.</p>
      <div className="interactive-terminal__shortcuts" role="group" aria-label="Terminal shortcuts">
        <span>Try:</span>
        {['help', 'projects', 'pour', 'tarot'].map((command) => <button key={command} type="button" onClick={() => runCommand(command)} className={command === 'pour' ? 'interactive-terminal__bar-command' : undefined}>{command === 'pour' && <Wine size={13} aria-hidden="true" />}{command}</button>)}
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}
