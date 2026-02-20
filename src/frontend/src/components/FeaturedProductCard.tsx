import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToCart, useAddToWishlist, useRemoveFromWishlist, useGetWishlist } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { Product } from '../backend';
import { toast } from 'sonner';

interface FeaturedProductCardProps {
  product: Product;
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useGetWishlist();
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const isInWishlist = wishlist?.productIds.includes(product.id) || false;
  const imageUrl = product.images[0]?.getDirectURL();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 600);

    try {
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync(product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist.mutateAsync(product.id);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <button
      onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id } })}
      className="group block w-full text-left"
    >
      <div className="relative overflow-hidden rounded-3xl bg-noirBlack/50 border border-softPink/20 hover:border-softPink transition-all duration-300 hover:shadow-neon">
        {/* Image */}
        <div className="aspect-square overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-softPink/20 to-lavender/20 flex items-center justify-center">
              <span className="text-4xl">🐧</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-softPink font-bold text-xl">${Number(product.price) / 100}</p>
            </div>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full hover:bg-softPink/10 transition-all ${
                isHeartAnimating ? 'animate-bounce' : ''
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist ? 'fill-softPink text-softPink' : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Stock Indicator */}
          {Number(product.stock) < 20 && Number(product.stock) > 0 && (
            <p className="text-xs text-orange-400 mb-3">Only {Number(product.stock)} Left!</p>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={addToCart.isPending || Number(product.stock) === 0}
            className="w-full bg-softPink text-noirBlack hover:bg-softPink/90 rounded-full"
          >
            {Number(product.stock) === 0 ? (
              'Out of Stock'
            ) : addToCart.isPending ? (
              'Adding...'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Quick Add
              </>
            )}
          </Button>
        </div>
      </div>
    </button>
  );
}
