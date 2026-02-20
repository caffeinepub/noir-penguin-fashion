import { Link } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';
import { useGetCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function MobileCartIcon() {
  const { identity } = useInternetIdentity();
  const { data: cart } = useGetCart();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) return null;

  const cartItemCount = cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  return (
    <Link
      to="/checkout"
      className="md:hidden fixed bottom-6 right-6 z-50 bg-softPink text-noirBlack rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
    >
      <ShoppingBag className="w-6 h-6" />
      {cartItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-noirBlack text-softPink text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-softPink">
          {cartItemCount}
        </span>
      )}
    </Link>
  );
}
