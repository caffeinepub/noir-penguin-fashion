import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Link } from '@tanstack/react-router';
import { useGetRewardPoints, useGetWishlist, useGetProducts } from '../hooks/useQueries';
import { Sparkles, Heart } from 'lucide-react';
import OrdersList from '../components/OrdersList';
import FeaturedProductCard from '../components/FeaturedProductCard';

export default function AccountPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: rewardPoints } = useGetRewardPoints();
  const { data: wishlist } = useGetWishlist();
  const { data: products } = useGetProducts();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-400 mb-8">You need to be logged in to view your account</p>
        <Link to="/" className="text-softPink hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  const wishlistProducts = products?.filter((p) => wishlist?.productIds.includes(p.id)) || [];

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="font-playfair text-4xl font-bold mb-12">My Account</h1>

      {/* Rewards Points */}
      <div className="bg-gradient-to-r from-softPink/10 to-lavender/10 border border-softPink/20 rounded-3xl p-8 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-softPink" />
          <h2 className="font-playfair text-2xl font-bold">Rewards</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Points Balance</p>
            <p className="text-3xl font-bold text-softPink">{Number(rewardPoints?.points || 0)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Birthday Discount</p>
            <p className="text-lg font-semibold">
              {rewardPoints?.birthdayEligible ? '✓ Active' : 'Not Active'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Student Discount</p>
            <p className="text-lg font-semibold">
              {rewardPoints?.studentDiscountEligible ? '✓ Active' : 'Not Active'}
            </p>
          </div>
        </div>
      </div>

      {/* Wishlist */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-softPink" />
          <h2 className="font-playfair text-2xl font-bold">Wishlist</h2>
        </div>
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Your wishlist is empty</p>
        )}
      </div>

      {/* Orders */}
      <OrdersList />
    </div>
  );
}
