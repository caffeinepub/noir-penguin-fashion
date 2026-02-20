import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '../backend';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pending:
        return { label: 'Pending', variant: 'secondary' as const };
      case OrderStatus.processing:
        return { label: 'Processing', variant: 'default' as const };
      case OrderStatus.shipped:
        return { label: 'Shipped', variant: 'default' as const };
      case OrderStatus.completed:
        return { label: 'Completed', variant: 'outline' as const };
      case OrderStatus.cancelled:
        return { label: 'Cancelled', variant: 'destructive' as const };
      default:
        return { label: 'Unknown', variant: 'secondary' as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className="rounded-full">
      {config.label}
    </Badge>
  );
}
