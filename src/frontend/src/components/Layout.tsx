import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Heart, User, Settings } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart, useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import FloatingPenguinMascot from './FloatingPenguinMascot';
import LoginButton from './LoginButton';
import ProfileSetupModal from './ProfileSetupModal';
import MobileCartIcon from './MobileCartIcon';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: cart } = useGetCart();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  const cartItemCount = cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen bg-noirBlack text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-noirBlack/95 backdrop-blur-sm border-b border-softPink/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/assets/generated/penguin-logo.dim_200x200.png" 
                alt="Noir Penguin" 
                className="w-10 h-10 transition-transform group-hover:scale-110"
              />
              <div>
                <h1 className="font-playfair text-xl font-bold tracking-tight">NOIR PENGUIN</h1>
                <p className="text-xs text-softPink">FASHION</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm hover:text-softPink transition-colors">Home</Link>
              <button onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'noir-dresses' } })} className="text-sm hover:text-softPink transition-colors">Dresses</button>
              <button onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'hoodies' } })} className="text-sm hover:text-softPink transition-colors">Hoodies</button>
              <button onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'pink-sets' } })} className="text-sm hover:text-softPink transition-colors">Sets</button>
              <button onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'accessories' } })} className="text-sm hover:text-softPink transition-colors">Accessories</button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <>
                  <Link to="/account" className="hidden md:block hover:text-softPink transition-colors">
                    <Heart className="w-5 h-5" />
                  </Link>
                  <Link to="/checkout" className="hidden md:flex items-center gap-2 hover:text-softPink transition-colors relative">
                    <ShoppingBag className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-softPink text-noirBlack text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/settings" className="hidden md:block hover:text-softPink transition-colors" title="Admin Settings">
                      <Settings className="w-5 h-5" />
                    </Link>
                  )}
                </>
              )}
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-noirBlack border-t border-softPink/20 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-playfair text-lg font-bold mb-4">NOIR PENGUIN</h3>
              <p className="text-sm text-gray-400">Soft. Bold. Unstoppable.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'noir-dresses' } })} className="hover:text-softPink transition-colors">Noir Dresses</button></li>
                <li><button onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'hoodies' } })} className="hover:text-softPink transition-colors">Cozy Hoodies</button></li>
                <li><button onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'pink-sets' } })} className="hover:text-softPink transition-colors">Pink Sets</button></li>
                <li><button onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'accessories' } })} className="hover:text-softPink transition-colors">Accessories</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/account" className="hover:text-softPink transition-colors">My Account</Link></li>
                <li><Link to="/account" className="hover:text-softPink transition-colors">Orders</Link></li>
                <li><Link to="/account" className="hover:text-softPink transition-colors">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <p className="text-sm text-gray-400">Created for bold girls. Confidence-driven fashion.</p>
            </div>
          </div>
          <div className="border-t border-softPink/20 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Noir Penguin Fashion. Built with ❤️ using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-softPink hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <FloatingPenguinMascot />
      <MobileCartIcon />
      
      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
