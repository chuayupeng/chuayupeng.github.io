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
        <div className="deck-preview-page__links"><span>The rest of the adventure continues.</span><Link to="/projects">Projects ↗</Link><Link to="/blog">Writing ↗</Link><Link to="/passport">Credentials ↗</Link></div>
      </main>
      <Footer />
    </div>
  );
}
