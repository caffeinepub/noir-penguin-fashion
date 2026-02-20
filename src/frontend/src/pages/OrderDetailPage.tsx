import { useParams, Link } from '@tanstack/react-router';
import { useGetOrders, useGetProducts } from '../hooks/useQueries';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/order/$orderId' });
  const { data: orders, isLoading } = useGetOrders();
  const { data: products } = useGetProducts();

  const order = orders?.find((o) => o.id === orderId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/account" className="text-softPink hover:underline">
            Return to account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Link
        to="/account"
        className="inline-flex items-center gap-2 text-softPink hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-bold mb-2">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-gray-400">
              Placed on {new Date(Number(order.createdAt) / 1000000).toLocaleDateString()}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Order Items */}
        <div className="bg-softPink/5 border border-softPink/20 rounded-3xl p-6 mb-8">
          <h2 className="font-semibold text-xl mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => {
              const product = products?.find((p) => p.id === item.productId);
              return (
                <div key={item.productId} className="flex gap-4">
                  {product && (
                    <>
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        {product.images[0] ? (
                          <img
                            src={product.images[0].getDirectURL()}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-softPink/20 to-lavender/20 flex items-center justify-center">
                            🐧
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-400">Quantity: {Number(item.quantity)}</p>
                        <p className="text-softPink font-bold mt-1">
                          ${Number(product.price) / 100}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Total */}
        <div className="bg-softPink/5 border border-softPink/20 rounded-3xl p-6">
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold text-softPink">${Number(order.totalAmount) / 100}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
