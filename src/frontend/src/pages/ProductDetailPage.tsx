import { useParams, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useGetProducts, useAddToCart, useGetProductReviews } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';
import ReviewsList from '../components/ReviewsList';
import RecommendedProducts from '../components/RecommendedProducts';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const { data: products, isLoading } = useGetProducts();
  const { data: reviews } = useGetProductReviews(productId);
  const addToCart = useAddToCart();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [quantity, setQuantity] = useState(1);

  const product = products?.find((p) => p.id === productId);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart.mutateAsync({ productId, quantity: BigInt(quantity) });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/" className="text-softPink hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Slider */}
        <div>
          <ImageSlider images={product.images} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-playfair text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? 'fill-softPink text-softPink'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                ({reviews?.length || 0} reviews)
              </span>
            </div>
            <p className="text-3xl font-bold text-softPink">${Number(product.price) / 100}</p>
          </div>

          <p className="text-gray-300">{product.description}</p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Designer:</span>
              <span className="font-semibold">{product.designer}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Color:</span>
              <span className="font-semibold">{product.color}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Stock:</span>
              <span className={Number(product.stock) > 0 ? 'text-green-400' : 'text-red-400'}>
                {Number(product.stock) > 0 ? `${Number(product.stock)} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-full"
              >
                -
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.min(Number(product.stock), quantity + 1))}
                className="rounded-full"
                disabled={quantity >= Number(product.stock)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart - Sticky on Mobile */}
          <div className="sticky bottom-0 left-0 right-0 bg-noirBlack/95 backdrop-blur-sm p-4 -mx-4 lg:static lg:bg-transparent lg:p-0 lg:mx-0">
            <Button
              onClick={handleAddToCart}
              disabled={addToCart.isPending || Number(product.stock) === 0}
              className="w-full bg-softPink text-noirBlack hover:bg-softPink/90 rounded-full py-6 text-lg font-semibold"
            >
              {Number(product.stock) === 0 ? (
                'Out of Stock'
              ) : addToCart.isPending ? (
                'Adding...'
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewsList productId={productId} />

      {/* Recommended Products */}
      <RecommendedProducts currentProduct={product} />
    </div>
  );
}
