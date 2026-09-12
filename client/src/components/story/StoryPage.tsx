import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
  Compass,
  Check,
  MapPin,
  Clock,
  Layers,
  Volume2,
  Feather,
} from 'lucide-react';
import { tactileAudio } from '../../utils/audio';

interface StoryPageProps {
  onBackToHome: () => void;
  onExploreCollection: () => void;
  onOpenCategories?: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({
  onBackToHome,
  onExploreCollection,
  onOpenCategories,
}) => {
  const [activeCity, setActiveCity] = useState<'amman' | 'kuwait'>('amman');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [playedPronunciation, setPlayedPronunciation] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePronounce = () => {
    tactileAudio.playChime();
    setPlayedPronunciation(true);
    setTimeout(() => setPlayedPronunciation(false), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      tactileAudio.playChime();
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <article className="w-full bg-cream-200 text-brown-700 font-sans selection:bg-blush-200 selection:text-brown-900 min-h-screen pb-24">
      {/* Sticky Sub-Header Navigation Bar */}
      <nav
        aria-label="Breadcrumb"
        className="sticky top-[53px] sm:top-[63px] z-30 border-b border-brown-200/70 bg-cream-100/90 backdrop-blur-md transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brown-700 hover:text-burgundy-600 transition-colors min-h-[44px]"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Atelier</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-brown-500 hidden sm:inline">
              HADAB • The Atelier Story
            </span>
            <button
              type="button"
              onClick={onExploreCollection}
              className="text-xs uppercase tracking-[0.18em] font-bold text-burgundy-500 hover:text-burgundy-600 flex items-center gap-1.5 transition-colors"
            >
              <span>The Collection</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* Act I: Hero & Etymology of هَدَب */}
      <header className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Subtle Watermark Motif in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.035] select-none">
          <img src="/motif-cream.png" alt="" className="w-96 h-96 object-contain" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-100 border border-brown-200 text-burgundy-500 text-[10.5px] uppercase font-bold tracking-[0.24em] shadow-warm-sm">
            <Sparkles size={13} className="text-burgundy-500" />
            <span>Our Philosophy & Heritage</span>
          </div>

          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-brown-900 font-normal leading-[1.18] tracking-tight max-w-3xl mx-auto">
            A brand born from the quiet beauty of <span className="italic font-serif text-burgundy-500">little details</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-brown-600 font-light leading-relaxed max-w-2xl mx-auto">
            Before there were machines, clothing and carriers carried the heartbeat of the hands that looped them.
            At HADAB, we return to that single-stitch meditation.
          </p>

          {/* Calligraphic Etymology Focus Card */}
          <div className="mt-10 sm:mt-14 p-8 sm:p-12 rounded-3xl bg-cream-100/90 border border-brown-200/80 shadow-warm max-w-2xl mx-auto relative overflow-hidden text-center group">
            {/* Watermarked Arabic script */}
            <div className="absolute -bottom-8 -right-8 font-arabic text-7xl sm:text-9xl md:text-[11rem] text-brown-900/[0.04] select-none pointer-events-none">
              هَدَب
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="font-arabic text-6xl sm:text-7xl md:text-8xl text-brown-900 font-normal leading-none">
                  هَدَبٌ
                </span>
                <button
                  type="button"
                  onClick={handlePronounce}
                  aria-label="Pronounce Hadab"
                  className="w-10 h-10 rounded-full bg-cream-200/80 hover:bg-burgundy-500 hover:text-cream-100 text-brown-700 flex items-center justify-center transition-all duration-300 shadow-sm group/btn active:scale-95"
                  title="Listen to pronunciation"
                >
                  <Volume2 size={16} className={playedPronunciation ? 'animate-pulse text-burgundy-500' : ''} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.22em] text-brown-500 font-semibold mb-5">
                <span>[ ha · dab ]</span>
                <span>•</span>
                <span>Arabic Noun</span>
                <span>•</span>
                <span className="text-burgundy-500">حِرفة</span>
              </div>

              <div className="w-12 h-[1px] bg-brown-300/70 mx-auto mb-5" />

              <p className="font-serif italic text-base sm:text-xl text-brown-800 leading-relaxed max-w-lg mx-auto">
                &ldquo;The delicate threads or fringes hanging from the edge of a woven piece.
                Small details that seem unassuming, but give an object character and make it complete.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Act II: The Visual Essay (Single-Hook Slow Craft) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-20 border-t border-brown-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Dual Image Gallery Left */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-warm border border-brown-200/80 bg-cream-100 relative group">
                  <img
                    src="/products/hadab-bag.jpg"
                    alt="Single-stitch artisan crochet bag"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-transparent to-transparent opacity-60" />
                  <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-cream-100 font-semibold">
                    100% Cotton Cord
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-cream-100/80 border border-brown-200/60 shadow-warm-sm text-center">
                  <span className="font-serif text-2xl font-bold text-burgundy-500 block">18+ hrs</span>
                  <span className="text-[10px] uppercase tracking-wider text-brown-500">Dedicated Hooking</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 sm:pt-8">
                <div className="p-4 rounded-2xl bg-cream-100/80 border border-brown-200/60 shadow-warm-sm text-center">
                  <span className="font-serif text-2xl font-bold text-sage-600 block">0 Machines</span>
                  <span className="text-[10px] uppercase tracking-wider text-brown-500">100% Hand-Worked</span>
                </div>

                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-warm border border-brown-200/80 bg-cream-100 relative group">
                  <img
                    src="/products/hadab-cardigan.jpg"
                    alt="Intricate open lace cardigan detail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-transparent to-transparent opacity-60" />
                  <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-cream-100 font-semibold">
                    Atelier Weave
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Brand Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-brown-900 text-cream-100 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase shadow-warm flex items-center gap-2">
              <Sparkles size={12} className="text-blush-200" />
              <span>One Continuous Strand</span>
            </div>
          </div>

          {/* Narrative Content Right */}
          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-burgundy-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-burgundy-500" />
              <span>The Atelier Beginning</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl text-brown-900 font-normal leading-tight">
              We started with a single hook, raw unbleached cotton, and an unhurried conviction.
            </h2>

            <p className="text-brown-700 text-sm sm:text-base leading-relaxed font-light">
              In an era dominated by rapid automated churning and disposable trends, HADAB was
              conceived as a quiet counterpoint. We believe in the meditative rhythm of slow craft, where every
              stitch must be consciously placed by hand, loop by loop.
            </p>

            <p className="text-brown-700 text-sm sm:text-base leading-relaxed font-light">
              There are no laser cutters, no pre-fabricated stiffeners, and no assembly lines in our
              process. The structure of our bags and wearables comes purely from stitch density, natural
              cord tension, and the artisan&rsquo;s deliberate touch.
            </p>

            <div className="p-5 rounded-2xl bg-cream-100/80 border-l-2 border-burgundy-500 space-y-2">
              <p className="font-serif italic text-sm text-brown-800">
                &ldquo;Small variations in tension are not imperfections—they are proof of a living, breathing human artisan at work.&rdquo;
              </p>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-brown-500 block">
                The Atelier Philosophy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Act III: Dual Roots — Amman & Kuwait Interactive Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-t border-brown-200/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-brown-500 font-semibold mb-3">
            <Compass size={14} className="text-burgundy-500" />
            <span>Dual Heritage</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-brown-900 font-normal">
            Two Homes. One Vision.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brown-600 font-light leading-relaxed">
            HADAB draws inspiration from two complementary landscapes across the Levant and the Gulf.
          </p>

          {/* Interactive City Selector */}
          <div className="mt-8 inline-flex flex-col xs:flex-row p-1.5 rounded-full bg-cream-100 border border-brown-200/80 shadow-warm-sm">
            <button
              type="button"
              onClick={() => {
                tactileAudio.playScrubTick(360);
                setActiveCity('amman');
              }}
              className={`px-4 py-2.5 sm:px-6 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCity === 'amman'
                  ? 'bg-brown-900 text-cream-100 shadow-sm'
                  : 'text-brown-700 hover:text-brown-900'
              }`}
            >
              <MapPin size={13} />
              <span>Amman, Jordan (عَمّان)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                tactileAudio.playScrubTick(420);
                setActiveCity('kuwait');
              }}
              className={`px-4 py-2.5 sm:px-6 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCity === 'kuwait'
                  ? 'bg-brown-900 text-cream-100 shadow-sm'
                  : 'text-brown-700 hover:text-brown-900'
              }`}
            >
              <MapPin size={13} />
              <span>Kuwait City (الكويت)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Dual City Card */}
        <div className="p-8 sm:p-14 rounded-3xl bg-cream-100/95 border border-brown-200/80 shadow-warm transition-all duration-500">
          {activeCity === 'amman' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 border border-sage-300 text-sage-600 text-[10px] uppercase tracking-widest font-semibold">
                  <span>The Stone & Hills • الأردن</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl text-brown-900 font-normal">
                  The Ancient Stone & Bedouin Weaving Heritage
                </h3>

                <p className="text-sm sm:text-base text-brown-700 font-light leading-relaxed">
                  In Amman, the sunlight washes over pale limestone hills, where weaving is not a hobby
                  but a historic trade carried through generations. From rural cooperatives to studio workbenches,
                  Jordan grounds HADAB in structural integrity, raw fiber authenticity, and time-honored discipline.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs text-brown-600">
                  <div>
                    <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Atmosphere</span>
                    <span className="font-serif text-base text-brown-900 font-medium">Limestone & Sage</span>
                  </div>
                  <div>
                    <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Inspiration</span>
                    <span className="font-serif text-base text-brown-900 font-medium">Textile Guilds</span>
                  </div>
                  <div>
                    <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Craft Element</span>
                    <span className="font-serif text-base text-brown-900 font-medium">Braided Cord Bases</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-warm border border-brown-200/60 bg-cream-200">
                <img
                  src="/products/hadab-hat.jpg"
                  alt="Amman craft inspiration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-cream-100">
                  <span className="font-arabic text-2xl font-light">عَمّان • الأصالة</span>
                  <p className="text-xs text-cream-200/90 font-light">
                    Carrying ancestral handwork into everyday accessories.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-100 border border-blush-300 text-burgundy-500 text-[10px] uppercase tracking-widest font-semibold">
                  <span>The Coastal Coastline • الخليج</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl text-brown-900 font-normal">
                  Gulf Minimalism & Modern Everyday Ease
                </h3>

                <p className="text-sm sm:text-base text-brown-700 font-light leading-relaxed">
                  In Kuwait City, the horizon meets the Gulf water in calm, luminous tones.
                  Kuwait brings modern architectural simplicity to HADAB: streamlined silhouettes,
                  airy silhouettes for warm coastal climates, and versatile bags ready for urban cafe meetings or seaside strolls.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs text-brown-600">
                  <div>
                    <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Atmosphere</span>
                    <span className="font-serif text-base text-brown-900 font-medium">Sea Breeze & Dusk</span>
                  </div>
                  <div>
                    <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Inspiration</span>
                    <span className="font-serif text-base text-brown-900 font-medium">Quiet Luxury</span>
                  </div>
                  <div>
                    <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Craft Element</span>
                    <span className="font-serif text-base text-brown-900 font-medium">Open-Mesh Stitching</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-warm border border-brown-200/60 bg-cream-200">
                <img
                  src="/products/hadab-pouch.jpg"
                  alt="Kuwait minimalist clutch"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-cream-100">
                  <span className="font-arabic text-2xl font-light">الكويت • الحداثة</span>
                  <p className="text-xs text-cream-200/90 font-light">
                    Refined luxury for modern, unhurried lifestyles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Act IV: The 4 Core Principles of Our Atelier */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-t border-brown-200/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-[0.28em] text-brown-500 font-bold block mb-2">
            The Atelier Code
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brown-900 font-normal">
            Four Commitments We Never Compromise
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 01 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-cream-100/90 border border-brown-200/80 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-burgundy-50 border border-burgundy-200/60 flex items-center justify-center text-burgundy-500 font-serif font-bold text-lg mb-4">
                01
              </div>
              <h3 className="font-serif text-xl text-brown-900 font-normal mb-2">
                Pure Natural Cord
              </h3>
              <p className="text-xs sm:text-sm text-brown-600 font-light leading-relaxed">
                We select unbleached 5mm cotton cord and natural combed bamboo. No synthetics, no chemical coatings, and zero plastics.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brown-200/60 flex items-center justify-between text-[10.5px] uppercase tracking-wider font-semibold text-burgundy-500">
              <Layers size={13} />
              <span>100% Cotton & Linen</span>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-cream-100/90 border border-brown-200/80 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sage-100/80 border border-sage-300 flex items-center justify-center text-sage-600 font-serif font-bold text-lg mb-4">
                02
              </div>
              <h3 className="font-serif text-xl text-brown-900 font-normal mb-2">
                The Single Hook
              </h3>
              <p className="text-xs sm:text-sm text-brown-600 font-light leading-relaxed">
                Every single knot and rib is hand-guided by a wooden crochet hook. No industrial knitting machines, no shortcut templates.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brown-200/60 flex items-center justify-between text-[10.5px] uppercase tracking-wider font-semibold text-sage-600">
              <Clock size={13} />
              <span>14–22 Hours / Piece</span>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-cream-100/90 border border-brown-200/80 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-cream-200 border border-brown-300 flex items-center justify-center text-brown-800 font-serif font-bold text-lg mb-4">
                03
              </div>
              <h3 className="font-serif text-xl text-brown-900 font-normal mb-2">
                Heirloom Longevity
              </h3>
              <p className="text-xs sm:text-sm text-brown-600 font-light leading-relaxed">
                Reinforced bases and seamless handle construction guarantee our pieces soften with age while retaining their sculptural structure.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brown-200/60 flex items-center justify-between text-[10.5px] uppercase tracking-wider font-semibold text-brown-700">
              <Heart size={13} />
              <span>Lifetime Durability</span>
            </div>
          </div>

          {/* Pillar 04 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-cream-100/90 border border-brown-200/80 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blush-100 border border-blush-300 flex items-center justify-center text-burgundy-500 font-serif font-bold text-lg mb-4">
                04
              </div>
              <h3 className="font-serif text-xl text-brown-900 font-normal mb-2">
                The Signature Hadab
              </h3>
              <p className="text-xs sm:text-sm text-brown-600 font-light leading-relaxed">
                Finished with our signature hand-tied fringe, loop tassel, or tactile edge charm—the finishing detail that makes each work complete.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brown-200/60 flex items-center justify-between text-[10.5px] uppercase tracking-wider font-semibold text-burgundy-500">
              <Sparkles size={13} />
              <span>Signature Finish</span>
            </div>
          </div>
        </div>
      </section>

      {/* Act V: Studio Dispatches & Newsletter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="p-8 sm:p-14 rounded-3xl bg-brown-900 text-cream-100 relative overflow-hidden shadow-warm-lg text-center">
          {/* Subtle Watermark Wordmark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <img src="/PNG-HADAB-CREAM.png" alt="" className="w-[80vw] max-w-4xl object-contain" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Feather size={24} className="mx-auto text-blush-200 mb-2" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-cream-300/70 font-semibold block">
              Atelier Dispatches
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-cream-100 font-normal">
              Follow the journey as it unfolds
            </h3>
            <p className="text-xs sm:text-sm text-cream-300/80 font-light leading-relaxed max-w-lg mx-auto">
              We send occasional letters detailing new stitch developments, slow release drops, and behind-the-scenes
              notes from our Jordan and Kuwait workshops.
            </p>

            {subscribed ? (
              <div className="mt-6 p-4 rounded-2xl bg-sage-950/60 border border-sage-600 text-sage-200 text-xs font-semibold flex items-center justify-center gap-2 max-w-md mx-auto">
                <Check size={16} />
                <span>You are subscribed to studio dispatches. شكراً لك</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-5 py-3.5 rounded-full bg-brown-800/90 border border-brown-700 text-xs text-cream-100 placeholder:text-brown-400 focus:outline-none focus:border-blush-200 transition-colors shadow-inner"
                />
                <button
                  type="submit"
                  className="px-7 py-3 rounded-full bg-burgundy-500 hover:bg-burgundy-600 text-cream-100 text-xs font-semibold tracking-wider uppercase transition-all shadow-warm-sm flex-shrink-0 active:scale-95"
                >
                  Join Notes
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Final Action Bar */}
      <footer className="max-w-3xl mx-auto px-4 text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brown-500">
          Ready to experience the work?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onExploreCollection}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brown-900 hover:bg-burgundy-600 text-cream-100 text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-warm flex items-center justify-center gap-2"
          >
            <span>Explore The Collection</span>
            <ArrowRight size={14} />
          </button>

          {onOpenCategories && (
            <button
              type="button"
              onClick={onOpenCategories}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-cream-100 hover:bg-cream-50 border border-brown-300/80 text-brown-800 text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-warm-sm flex items-center justify-center gap-2"
            >
              <span>View Categories</span>
              <Layers size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={onBackToHome}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-brown-600 hover:text-brown-900 text-xs font-medium uppercase tracking-[0.16em] transition-colors"
          >
            Return Home
          </button>
        </div>
      </footer>
    </article>
  );
};

export default StoryPage;

