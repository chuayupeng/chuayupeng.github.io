import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Shield, Wine } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MixologistsDeck from '@/components/tarot/MixologistsDeck';
import CelticCrossReading from '@/components/tarot/CelticCrossReading';

export default function Tarot() {
  const [searchParams, setSearchParams] = useSearchParams();
  const readingMode = searchParams.get('view') === 'reading';

  function chooseMode(reading: boolean) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (reading) next.set('view', 'reading');
      else next.delete('view');
      return next;
    }, { replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="deck-preview-page">
        <div className="deck-preview-page__topline">
          <Link to="/"><ArrowLeft size={14} aria-hidden="true" />Back to the main quest</Link>
          <span>The mixologist’s deck</span>
        </div>
        <div className="deck-preview-character">
          <img src="/avatar.png" alt="" width="48" height="48" />
          <div><span className="deck-preview-character__name">yup.eng <span>/ inventory</span></span><p>Security, building things, and an occasional detour behind the bar.</p></div>
          <div className="deck-preview-character__roles" aria-hidden="true"><Shield size={16} /><span>+</span><Wine size={16} /></div>
        </div>
        <div className="deck-mode-switch" role="group" aria-label="Deck mode">
          <button aria-pressed={!readingMode} aria-controls="deck-explorer" onClick={() => chooseMode(false)}>Explore the deck</button>
          <button aria-pressed={readingMode} aria-controls="deck-reading" onClick={() => chooseMode(true)}>Celtic Cross reading</button>
        </div>
        <div id="deck-explorer" hidden={readingMode}><MixologistsDeck /></div>
        <div id="deck-reading" hidden={!readingMode}><CelticCrossReading /></div>
        <section className="tarot-musings" id="musings" aria-labelledby="tarot-musings-title">
          <div className="tarot-musings__heading">
            <span className="mixologist-deck__eyebrow">Musings</span>
            <h2 id="tarot-musings-title">Where could this go?</h2>
            <span className="tarot-musings__status">Ideas on the table</span>
          </div>
          <div className="tarot-musings__copy">
            <p>I originally wanted some cocktail-themed cards for the portfolio. Apparently that required an entire tarot deck and a working reading table. A perfectly reasonable amount of scope creep.</p>
            <p>A <strong>physical deck</strong> is the obvious temptation, with a companion that gets into the mythology, ingredients, and possibly a few cocktail recipes. I’d want to try a print prototype and see whether anyone actually wants one before becoming the proud owner of several hundred boxes.</p>
            <p>There’s also something here for a <strong>bar or an event</strong>: draw a card, have a conversation, find a drink. That feels close to what I enjoy about hospitality anyway. A small pilot evening could tell me quite a bit. Hopefully the cards give people something better to discuss than how busy everyone has been.</p>
            <p><strong>Digital editions or a reading journal</strong> could be worth exploring too. A place to keep spreads and notes, perhaps across devices, if people find themselves coming back. A subscription would need to earn its keep.</p>
            <p>For now, the deck and Celtic Cross reading are free. These are possibilities I want to test, through return visits, interest in a physical deck, or a venue willing to try an evening. If something develops a life beyond the portfolio, it can have <strong>its own identity</strong>. Naming the business can wait until there’s a business.</p>
          </div>
        </section>
        <div className="deck-preview-page__links"><span>The rest of the adventure continues.</span><Link to="/projects">Projects ↗</Link><Link to="/blog">Writing ↗</Link><Link to="/passport">Credentials ↗</Link></div>
      </main>
      <Footer />
    </div>
  );
}
