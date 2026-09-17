import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PassportBook from '@/components/passport/PassportBook';
import PassportRecord from '@/components/passport/PassportRecord';

const Passport = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    <main className="flex-grow">
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="mb-12 max-w-2xl">
            <div className="section-eyebrow">Credentials</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Skills <span className="gradient-text">passport</span>
            </h1>
            <p className="text-muted-foreground">
              Every credential, stamped and dated — read the record, or leaf through the book.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <PassportRecord />
            </div>

            {/* the book rides alongside, off to one side, and follows you down */}
            <aside className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-28">
              <PassportBook compact />
            </aside>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Passport;
