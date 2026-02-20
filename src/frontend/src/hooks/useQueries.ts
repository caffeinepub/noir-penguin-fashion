import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Review, FeaturedCollection, Wishlist, RewardPoints, Order, ShoppingCart, Lookbook, UserProfile, StoreSettings, StoreInfo, PaymentMethodsConfig, ShippingRates, TaxSettings, AdminUser, ThemeColors } from '../backend';
import { ExternalBlob } from '../backend';

// Products
export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Featured Collections
export function useGetFeaturedCollections() {
  const { actor, isFetching } = useActor();

  return useQuery<FeaturedCollection[]>({
    queryKey: ['featuredCollections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedCollections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFeaturedCollection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collection: FeaturedCollection) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFeaturedCollection(collection);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCollections'] });
    },
  });
}

// Cart
export function useGetCart() {
  const { actor, isFetching } = useActor();

  return useQuery<ShoppingCart>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return { items: [] };
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Wishlist
export function useGetWishlist() {
  const { actor, isFetching } = useActor();

  return useQuery<Wishlist>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!actor) return { productIds: [] };
      return actor.getWishlist();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Reviews
export function useGetProductReviews(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductReviews(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReview(review);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
    },
  });
}

// Orders
export function useGetOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Reward Points
export function useGetRewardPoints() {
  const { actor, isFetching } = useActor();

  return useQuery<RewardPoints>({
    queryKey: ['rewardPoints'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRewardPoints();
    },
    enabled: !!actor && !isFetching,
  });
}

// Lookbooks
export function useGetLookbooks() {
  const { actor, isFetching } = useActor();

  return useQuery<Lookbook[]>({
    queryKey: ['lookbooks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLookbooks();
    },
    enabled: !!actor && !isFetching,
  });
}

// Stripe
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: { productId: string; quantity: bigint; product: Product }[]) => {
      if (!actor) throw new Error('Actor not available');
      
      const shoppingItems = items.map(item => ({
        productName: item.product.name,
        productDescription: item.product.description,
        priceInCents: item.product.price,
        quantity: item.quantity,
        currency: 'USD',
      }));

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      
      const result = await actor.createCheckoutSession(shoppingItems, successUrl, cancelUrl);
      const session = JSON.parse(result) as { id: string; url: string };
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      
      return session;
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Store Settings
export function useGetStoreSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<StoreSettings | null>({
    queryKey: ['storeSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStoreSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateStoreInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: StoreInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStoreInfo(info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
    },
  });
}

export function useUpdatePaymentMethods() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (methods: PaymentMethodsConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePaymentMethods(methods);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
    },
  });
}

export function useUpdateShippingRates() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rates: ShippingRates) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateShippingRates(rates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
    },
  });
}

export function useUpdateTaxSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tax: TaxSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTaxSettings(tax);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
    },
  });
}

export function useUpdateAdminRoles() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roles: AdminUser[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdminRoles(roles);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
    },
  });
}

export function useUpdateLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLogo: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLogo(newLogo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
    },
  });
}

export function useUpdateThemeColors() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (colors: ThemeColors) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateThemeColors(colors);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
    },
  });
}
