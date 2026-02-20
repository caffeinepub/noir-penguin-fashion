import HeroSection from '../components/HeroSection';
import ShopByCategory from '../components/ShopByCategory';
import FeaturedCollection from '../components/FeaturedCollection';
import LookbookSection from '../components/LookbookSection';
import AboutSection from '../components/AboutSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ShopByCategory />
      <FeaturedCollection />
      <LookbookSection />
      <AboutSection />
    </div>
  );
}
