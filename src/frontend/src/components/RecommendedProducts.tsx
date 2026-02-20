import { useGetProducts } from '../hooks/useQueries';
import FeaturedProductCard from './FeaturedProductCard';
import type { Product } from '../backend';

interface RecommendedProductsProps {
  currentProduct: Product;
}

export default function RecommendedProducts({ currentProduct }: RecommendedProductsProps) {
  const { data: products } = useGetProducts();

  const recommended = products
    ?.filter((p) => p.id !== currentProduct.id && p.designer === currentProduct.designer)
    .slice(0, 4);

  if (!recommended || recommended.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">
      <h2 className="font-playfair text-3xl font-bold mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommended.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
