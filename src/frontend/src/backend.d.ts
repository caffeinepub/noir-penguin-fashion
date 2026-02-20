import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ShoppingCart {
    items: Array<CartItem>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface StoreSettings {
    adminRoles: Array<AdminUser>;
    logo?: ExternalBlob;
    shippingRates: ShippingRates;
    themeColors: ThemeColors;
    taxSettings: TaxSettings;
    storeInfo: StoreInfo;
    paymentMethods: PaymentMethodsConfig;
}
export interface PaymentMethodsConfig {
    stripeApiKey?: string;
    acceptedCardTypes: Array<string>;
    enableStripe: boolean;
}
export interface Wishlist {
    productIds: Array<string>;
}
export interface TaxSettings {
    salesTaxPercentage: number;
    taxExemptRegions: Array<string>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ShippingRates {
    regionShippingCosts: Array<[string, bigint]>;
    flatRate: bigint;
    freeShippingThreshold: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface StoreInfo {
    name: string;
    address: string;
    contactEmail: string;
    phoneNumber: string;
}
export interface Review {
    userId: Principal;
    createdAt: Time;
    productId: string;
    comment: string;
    rating: bigint;
}
export interface AdminUser {
    id: Principal;
    name: string;
    role: AdminRole;
}
export interface FeaturedCollection {
    title: string;
    countdown: string;
    items: Array<Product>;
}
export interface Order {
    id: string;
    status: OrderStatus;
    customer: Principal;
    createdAt: Time;
    totalAmount: bigint;
    items: Array<CartItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Lookbook {
    id: string;
    products: Array<Product>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface ThemeColors {
    primary1: string;
    primary2: string;
    primary3: string;
    secondary1: string;
    secondary2: string;
}
export interface RewardPoints {
    studentDiscountEligible: boolean;
    userId: Principal;
    createdAt: Time;
    birthdayEligible: boolean;
    points: bigint;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Product {
    id: string;
    name: string;
    color: string;
    description: string;
    seasonal: boolean;
    designer: string;
    stock: bigint;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
}
export enum AdminRole {
    customerSupport = "customerSupport",
    productManager = "productManager",
    superAdmin = "superAdmin",
    orderManager = "orderManager"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addReview(review: Review): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    addToWishlist(productId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createFeaturedCollection(collection: FeaturedCollection): Promise<void>;
    createLookbook(lookbook: Lookbook): Promise<void>;
    createOrder(order: Order): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<ShoppingCart>;
    getFeaturedCollections(): Promise<Array<FeaturedCollection>>;
    getLookbooks(): Promise<Array<Lookbook>>;
    getOrders(): Promise<Array<Order>>;
    getProductReviews(productId: string): Promise<Array<Review>>;
    getProducts(): Promise<Array<Product>>;
    getRewardPoints(): Promise<RewardPoints>;
    getStoreSettings(): Promise<StoreSettings | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Wishlist>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    removeFromCart(productId: string): Promise<void>;
    removeFromWishlist(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAdminRoles(roles: Array<AdminUser>): Promise<void>;
    updateLogo(newLogo: ExternalBlob): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updatePaymentMethods(methods: PaymentMethodsConfig): Promise<void>;
    updateProduct(product: Product): Promise<void>;
    updateRewardPoints(points: RewardPoints): Promise<void>;
    updateShippingRates(rates: ShippingRates): Promise<void>;
    updateStoreInfo(info: StoreInfo): Promise<void>;
    updateStoreSettings(settings: StoreSettings): Promise<void>;
    updateTaxSettings(tax: TaxSettings): Promise<void>;
    updateThemeColors(colors: ThemeColors): Promise<void>;
}
