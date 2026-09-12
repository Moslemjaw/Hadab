import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { BrandLineInSection } from '../components/home/BrandLineInSection';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { CategoryTilesSection } from '../components/home/CategoryTilesSection';
import { SpotlightSection } from '../components/home/SpotlightSection';
import { CraftProcessSection } from '../components/home/CraftProcessSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { AboutTeaserSection } from '../components/home/AboutTeaserSection';
import { NewsletterSection } from '../components/home/NewsletterSection';
import type { Product } from '../types';

interface HomePageProps {
  onAddToBag: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAddToBag }) => {
  return (
    <main className="relative bg-cream-200">
      {/* 1. Hero (3D Hook & Stitch Narrative) */}
      <HeroSection />

      {/* 2. Brand line-in */}
      <BrandLineInSection />

      {/* 3. Featured Products with texture toggle */}
      <FeaturedProductsSection onAddToBag={onAddToBag} />

      {/* 4. Shop by Category tiles (Bags, Clothing, Accessories) */}
      <CategoryTilesSection />

      {/* 5. Spotlight & Archive Pieces (gentle burgundy accents) */}
      <SpotlightSection onAddToBag={onAddToBag} />

      {/* 6. Process & Craft Strip */}
      <CraftProcessSection />

      {/* 7. Testimonials / Everyday Life */}
      <TestimonialsSection />

      {/* 8. About Teaser (Meaning of HADAB) */}
      <AboutTeaserSection />

      {/* 9. Newsletter (Stay in the loop) */}
      <NewsletterSection />
    </main>
  );
};
