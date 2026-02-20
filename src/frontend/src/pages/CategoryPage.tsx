import { useParams } from '@tanstack/react-router';
import { useGetProducts } from '../hooks/useQueries';
import FeaturedProductCard from '../components/FeaturedProductCard';

export default function CategoryPage() {
  const { categoryName } = useParams({ from: '/category/$categoryName' });
  const { data: products, isLoading } = useGetProducts();

  const categoryMap: Record<string, string> = {
    'noir-dresses': 'Noir Dresses',
    'hoodies': 'Cozy Hoodies',
    'pink-sets': 'Pink Sets',
    'accessories': 'Accessories',
  };

  const displayName = categoryMap[categoryName] || categoryName;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-12">
        {displayName}
      </h1>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-20">
          <p className="text-xl">No products available yet.</p>
          <p className="mt-2">Check back soon for new arrivals!</p>
        </div>
      )}
    </div>
  );
}
