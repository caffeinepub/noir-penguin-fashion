import { useState } from 'react';
import { useGetCart, useGetProducts, useCreateCheckoutSession } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRemoveFromCart } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Link } from '@tanstack/react-router';

export default function CheckoutPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: cart } = useGetCart();
  const { data: products } = useGetProducts();
  const removeFromCart = useRemoveFromCart();
  const createCheckoutSession = useCreateCheckoutSession();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-400 mb-8">You need to be logged in to view your cart</p>
        <Link to="/" className="text-softPink hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  const cartItems = cart?.items.map((item) => {
    const product = products?.find((p) => p.id === item.productId);
    return { ...item, product };
  }) || [];

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product ? Number(item.product.price) * Number(item.quantity) : 0),
    0
  );

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Filter out items without products
    const validItems = cartItems.filter(item => item.product);
    
    if (validItems.length === 0) {
      toast.error('No valid items in cart');
      return;
    }

    setIsProcessing(true);
    try {
      const session = await createCheckoutSession.mutateAsync(
        validItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: item.product!,
        }))
      );

      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="font-playfair text-4xl font-bold mb-12">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-8">Your cart is empty</p>
          <Link to="/" className="text-softPink hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-softPink/5 border border-softPink/20 rounded-3xl p-6 flex gap-6"
              >
                {item.product && (
                  <>
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0].getDirectURL()}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-softPink/20 to-lavender/20 flex items-center justify-center">
                          🐧
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                      <p className="text-softPink font-bold mb-2">
                        ${Number(item.product.price) / 100}
                      </p>
                      <p className="text-sm text-gray-400">Quantity: {Number(item.quantity)}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-softPink/5 border border-softPink/20 rounded-3xl p-6 sticky top-24">
              <h2 className="font-playfair text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">${(total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
                <div className="border-t border-softPink/20 pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-softPink">${(total / 100).toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-softPink text-noirBlack hover:bg-softPink/90 rounded-full py-6 text-lg font-semibold"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
