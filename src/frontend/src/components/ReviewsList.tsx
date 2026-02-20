import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGetProductReviews, useAddReview } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface ReviewsListProps {
  productId: string;
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useGetProductReviews(productId);
  const addReview = useAddReview();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      await addReview.mutateAsync({
        productId,
        userId: identity.getPrincipal(),
        rating: BigInt(rating),
        comment,
        createdAt: BigInt(Date.now() * 1000000),
      });
      toast.success('Review added!');
      setComment('');
      setRating(5);
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="font-playfair text-3xl font-bold">Customer Reviews</h2>

      {/* Add Review Form */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="bg-softPink/5 border border-softPink/20 rounded-3xl p-6 space-y-4">
          <h3 className="font-semibold text-lg">Write a Review</h3>
          
          <div>
            <label className="block text-sm mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating ? 'fill-softPink text-softPink' : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="bg-noirBlack/50 border-softPink/20 min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            disabled={addReview.isPending}
            className="bg-softPink text-noirBlack hover:bg-softPink/90 rounded-full"
          >
            {addReview.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-400">Loading reviews...</p>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={index}
              className="bg-softPink/5 border border-softPink/20 rounded-3xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Number(review.rating)
                        ? 'fill-softPink text-softPink'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-300">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-3">
                {new Date(Number(review.createdAt) / 1000000).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
