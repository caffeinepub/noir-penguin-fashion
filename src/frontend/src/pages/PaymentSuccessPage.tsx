import { Link } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useClearCart } from '../hooks/useQueries';

export default function PaymentSuccessPage() {
  const clearCart = useClearCart();

  useEffect(() => {
    clearCart.mutate();
  }, []);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="font-playfair text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-400 mb-8">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-softPink text-noirBlack hover:bg-softPink/90 rounded-full">
            <Link to="/account">View Orders</Link>
          </Button>
          <Button asChild variant="outline" className="border-softPink text-softPink rounded-full">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
