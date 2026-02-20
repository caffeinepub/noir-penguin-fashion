import { Link } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFailurePage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h1 className="font-playfair text-4xl font-bold mb-4">Payment Failed</h1>
        <p className="text-xl text-gray-400 mb-8">
          Something went wrong with your payment. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-softPink text-noirBlack hover:bg-softPink/90 rounded-full">
            <Link to="/checkout">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="border-softPink text-softPink rounded-full">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
