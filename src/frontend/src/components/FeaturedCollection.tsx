import { useGetFeaturedCollections } from '../hooks/useQueries';
import FeaturedProductCard from './FeaturedProductCard';
import CountdownTimer from './CountdownTimer';
import { Sparkles } from 'lucide-react';

export default function FeaturedCollection() {
  const { data: collections, isLoading } = useGetFeaturedCollections();

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">Loading featured collection...</div>
      </section>
    );
  }

  const midnightDrop = collections?.find(c => c.title === 'Midnight Drop') || collections?.[0];

  if (!midnightDrop) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-softPink" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold">
            {midnightDrop.title}
          </h2>
          <Sparkles className="w-6 h-6 text-softPink" />
        </div>
        <p className="text-gray-400 mb-8">Limited edition • Exclusive drops</p>
        <CountdownTimer targetDate={midnightDrop.countdown} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {midnightDrop.items.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
