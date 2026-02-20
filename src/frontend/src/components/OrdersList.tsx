import { useGetOrders, useGetProducts } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import OrderStatusBadge from './OrderStatusBadge';
import { Package } from 'lucide-react';

export default function OrdersList() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetOrders();
  const { data: products } = useGetProducts();

  if (isLoading) {
    return <p className="text-gray-400">Loading orders...</p>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-softPink" />
          <h2 className="font-playfair text-2xl font-bold">Order History</h2>
        </div>
        <p className="text-gray-400">No orders yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-softPink" />
        <h2 className="font-playfair text-2xl font-bold">Order History</h2>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => navigate({ to: '/order/$orderId', params: { orderId: order.id } })}
            className="block w-full text-left bg-softPink/5 border border-softPink/20 rounded-3xl p-6 hover:border-softPink transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-400">
                  {new Date(Number(order.createdAt) / 1000000).toLocaleDateString()}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-400">{order.items.length} items</p>
              <p className="font-bold text-softPink">${Number(order.totalAmount) / 100}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
