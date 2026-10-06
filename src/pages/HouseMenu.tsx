import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, ChevronDown, GlassWater, Wine } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { rootCocktails, weddingDrinks, type HouseDrink, type RootCocktailId } from '@/data/houseMenuData';
import '@/components/bar/house-menu.css';

const filters = [
  { id: 'all', label: 'All five' },
  { id: 'spirits', label: 'Spirit-led' },
  { id: 'wine', label: 'Wine-based' },
  { id: 'non-alcoholic', label: 'Without alcohol' },
] as const;

export default function HouseMenu() {
  const [filter, setFilter] = useState<typeof filters[number]['id']>('all');
  const [selectedRoot, setSelectedRoot] = useState<RootCocktailId>('old-fashioned');
  const visibleDrinks = weddingDrinks.filter((drink) => filter === 'all' || drink.group === filter);
  const root = rootCocktails.find((item) => item.id === selectedRoot)!;
  const connectedDrinks = weddingDrinks.filter((drink) => drink.root === selectedRoot);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  function exploreRoot(rootId: RootCocktailId) {
    setSelectedRoot(rootId);
  }

  function showDrink(drink: HouseDrink) {
    setFilter('all');
    // The anchor target must be rendered before the browser follows the link.
    requestAnimationFrame(() => {
      const heading = document.getElementById(drink.id);
      heading?.scrollIntoView({ block: 'start' });
      heading?.focus({ preventScroll: true });
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="house-menu-page">
        <div className="house-menu-topline">
          <Link to="/"><ArrowLeft size={14} aria-hidden="true" />Back to the main quest</Link>
          <span>~/inventory/house-menu</span>
        </div>

        <header className="house-menu-hero">
          <div>
            <span className="house-menu-eyebrow">From the other side of the bar</span>
            <h1>The house <em>menu.</em></h1>
            <p>Drinks I’ve come up with, starting with the five on my wedding menu. There were always going to be opinions about the drinks.</p>
            <a className="house-menu-text-link" href="#wedding-menu">Take a look at the menu<ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <div className="house-menu-host">
            <img src="/avatar.png" alt="" width="64" height="64" />
            <div><span>yup.eng / behind the bar</span><p>Recipes have a structure.<br />The occasion gives them a reason.</p></div>
          </div>
        </header>

        <section className="wedding-menu" id="wedding-menu" aria-labelledby="wedding-menu-title">
          <div className="wedding-menu-heading">
            <Wine className="wedding-menu-emblem" size={28} strokeWidth={1.2} aria-hidden="true" />
            <div><span className="house-menu-eyebrow">The house menu · Wedding edition</span><h2 id="wedding-menu-title">A toast to the occasion.</h2></div>
            <span className="wedding-menu-seal"><Wine size={18} aria-hidden="true" />Five drinks. One occasion.</span>
          </div>
          <p className="wedding-menu-intro">An Old Fashioned, a Negroni riff, a pair of sangrias, and a drink without alcohol. Each with a name of its own.</p>
          <div className="house-menu-filters" role="group" aria-label="Filter the wedding menu">
            {filters.map((item) => <button key={item.id} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} aria-controls="wedding-drinks">{item.label}</button>)}
          </div>
          <p className="sr-only" role="status">Showing {visibleDrinks.length} of {weddingDrinks.length} drinks.</p>

          <ol className="wedding-drinks" id="wedding-drinks">
            {visibleDrinks.map((drink) => (
              <li key={drink.id} className="house-drink" style={{ '--drink-accent': drink.accent } as CSSProperties}>
                <div className="house-drink-number" aria-hidden="true">{String(weddingDrinks.indexOf(drink) + 1).padStart(2, '0')}</div>
                <div className="house-drink-title">
                  <span className="house-drink-style">{drink.group === 'non-alcoholic' && <GlassWater size={13} aria-hidden="true" />}{drink.style}</span>
                  <h3 id={drink.id} tabIndex={-1}>{drink.name}</h3>
                </div>
                <div className="house-drink-copy">
                  <ul className="house-drink-ingredients" aria-label={`${drink.name} ingredients`}>
                    {drink.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
                  </ul>
                  <details className="house-drink-notes">
                    <summary>Behind the drink<ChevronDown size={14} aria-hidden="true" /></summary>
                    <div className="house-drink-notes-body">
                      <p>{drink.note}</p>
                      {drink.preparation && <p><strong>The preparation</strong>{drink.preparation}</p>}
                      {drink.rootNote && <p>{drink.rootNote}</p>}
                      {drink.root && <a href="#six-roots" className="house-menu-text-link" onClick={() => exploreRoot(drink.root!)}>Explore the {rootCocktails.find((item) => item.id === drink.root)?.name} starting point<ArrowRight size={14} aria-hidden="true" /></a>}
                    </div>
                  </details>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="house-menu-roots" id="six-roots" aria-labelledby="house-menu-roots-title">
          <div className="house-menu-roots-intro">
            <span className="house-menu-eyebrow"><BookOpen size={14} aria-hidden="true" />A note from the bookshelf</span>
            <h2 id="house-menu-roots-title">Six starting points.<br /><em>Plenty of room to wander.</em></h2>
            <p>I like the idea behind <cite>Cocktail Codex</cite>: learn the structure of a drink, then use it to come up with something of your own.</p>
            <p>The six root cocktails below come from the book. The questions are my way of using them as prompts for the next experiment.</p>
            <a className="house-menu-text-link" href="https://www.deathandcompanymarket.com/products/cocktail-codex" target="_blank" rel="noreferrer">Cocktail Codex · Death &amp; Co<ArrowRight size={14} aria-hidden="true" /></a>
            <p className="house-menu-credit">By Alex Day, Nick Fauchald &amp; David Kaplan.</p>
          </div>
          <div className="house-menu-root-explorer">
            <div className="house-menu-root-options" role="group" aria-label="Explore the six root cocktails">
              {rootCocktails.map((item, index) => <button key={item.id} aria-pressed={selectedRoot === item.id} aria-controls="root-cocktail-note" onClick={() => setSelectedRoot(item.id)}><span aria-hidden="true">0{index + 1}</span>{item.name}</button>)}
            </div>
            <div className="house-menu-root-note" id="root-cocktail-note" role="region" aria-labelledby="selected-root-title" aria-live="polite" aria-atomic="true">
              <h3 id="selected-root-title">{root.name}</h3>
              <p>{root.idea}</p>
              <div className="house-menu-root-question"><span>A question to start with</span><p>{root.question}</p></div>
              {connectedDrinks.length > 0 && <div className="house-menu-root-connections"><span>On this menu</span>{connectedDrinks.map((drink) => <button key={drink.id} onClick={() => showDrink(drink)}>{drink.name}<ArrowRight size={14} aria-hidden="true" /></button>)}</div>}
            </div>
            <p className="house-menu-root-aside">The sangrias and No Objections keep their own place on the menu. The six roots are useful prompts for exploring ideas.</p>
          </div>
        </section>

        <aside className="house-menu-last-call" aria-label="Explore more">
          <div><span className="house-menu-eyebrow">Still at the table?</span><p>There’s a deck of cards here, too.</p></div>
          <Link to="/tarot">Explore the mixologist’s deck<ArrowRight size={16} aria-hidden="true" /></Link>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
