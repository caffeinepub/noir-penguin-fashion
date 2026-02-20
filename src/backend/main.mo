import Map "mo:core/Map";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Store Settings
  public type StoreInfo = {
    name : Text;
    contactEmail : Text;
    phoneNumber : Text;
    address : Text;
  };

  public type PaymentMethodsConfig = {
    enableStripe : Bool;
    stripeApiKey : ?Text;
    acceptedCardTypes : [Text];
  };

  public type ShippingRates = {
    flatRate : Nat;
    freeShippingThreshold : Nat;
    regionShippingCosts : [(Text, Nat)];
  };

  public type TaxSettings = {
    salesTaxPercentage : Float;
    taxExemptRegions : [Text];
  };

  public type AdminRole = {
    #superAdmin;
    #productManager;
    #orderManager;
    #customerSupport;
  };

  public type AdminUser = {
    id : Principal;
    name : Text;
    role : AdminRole;
  };

  public type ThemeColors = {
    primary1 : Text;
    primary2 : Text;
    primary3 : Text;
    secondary1 : Text;
    secondary2 : Text;
  };

  public type StoreSettings = {
    storeInfo : StoreInfo;
    paymentMethods : PaymentMethodsConfig;
    shippingRates : ShippingRates;
    taxSettings : TaxSettings;
    adminRoles : [AdminUser];
    logo : ?Storage.ExternalBlob;
    themeColors : ThemeColors;
  };

  // User Profile
  public type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Catalog
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    images : [Storage.ExternalBlob];
    designer : Text;
    seasonal : Bool;
    color : Text;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      switch (Text.compare(product1.name, product2.name)) {
        case (#equal) { Nat.compare(product1.price, product2.price) };
        case (order) { order };
      };
    };
  };

  // Shopping Cart
  public type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public type ShoppingCart = {
    items : [CartItem];
  };

  public type Order = {
    id : Text;
    customer : Principal;
    items : [CartItem];
    totalAmount : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #completed;
    #cancelled;
  };

  public type Review = {
    productId : Text;
    userId : Principal;
    rating : Nat;
    comment : Text;
    createdAt : Time.Time;
  };

  public type RewardPoints = {
    userId : Principal;
    points : Nat;
    birthdayEligible : Bool;
    studentDiscountEligible : Bool;
    createdAt : Time.Time;
  };

  public type FeaturedCollection = {
    title : Text;
    items : [Product];
    countdown : Text;
  };

  public type Wishlist = {
    productIds : [Text];
  };

  public type Lookbook = {
    id : Text;
    products : [Product];
  };

  // Stores
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  let reviews = Map.empty<Text, Review>();
  let rewardPoints = Map.empty<Principal, RewardPoints>();
  let featuredCollections = Map.empty<Text, FeaturedCollection>();
  let userCarts = Map.empty<Principal, ShoppingCart>();
  let userWishlists = Map.empty<Principal, Wishlist>();
  let lookbooks = Map.empty<Text, Lookbook>();
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Store Settings
  var storeSettings : ?StoreSettings = null;

  // Store Settings Methods
  public shared ({ caller }) func updateStoreSettings(settings : StoreSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update store settings");
    };
    storeSettings := ?settings;
  };

  public query func getStoreSettings() : async ?StoreSettings {
    storeSettings;
  };

  // Helper methods to update specific parts of settings
  public shared ({ caller }) func updateStoreInfo(info : StoreInfo) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update store info");
    };
    storeSettings := switch (storeSettings) {
      case (null) {
        ?{
          storeInfo = info;
          paymentMethods = {
            enableStripe = false;
            stripeApiKey = null;
            acceptedCardTypes = [];
          };
          shippingRates = {
            flatRate = 0;
            freeShippingThreshold = 0;
            regionShippingCosts = [];
          };
          taxSettings = {
            salesTaxPercentage = 0.0;
            taxExemptRegions = [];
          };
          adminRoles = [];
          logo = null;
          themeColors = {
            primary1 = "#000000";
            primary2 = "#FFC0CB";
            primary3 = "#C0C0C0";
            secondary1 = "#E6E6FA";
            secondary2 = "#ADD8E6";
          };
        };
      };
      case (?settings) {
        ?{ settings with storeInfo = info };
      };
    };
  };

  public shared ({ caller }) func updatePaymentMethods(methods : PaymentMethodsConfig) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update payment methods");
    };
    storeSettings := switch (storeSettings) {
      case (null) {
        ?{
          storeInfo = {
            name = "";
            contactEmail = "";
            phoneNumber = "";
            address = "";
          };
          paymentMethods = methods;
          shippingRates = {
            flatRate = 0;
            freeShippingThreshold = 0;
            regionShippingCosts = [];
          };
          taxSettings = {
            salesTaxPercentage = 0.0;
            taxExemptRegions = [];
          };
          adminRoles = [];
          logo = null;
          themeColors = {
            primary1 = "#000000";
            primary2 = "#FFC0CB";
            primary3 = "#C0C0C0";
            secondary1 = "#E6E6FA";
            secondary2 = "#ADD8E6";
          };
        };
      };
      case (?settings) {
        ?{ settings with paymentMethods = methods };
      };
    };
  };

  public shared ({ caller }) func updateShippingRates(rates : ShippingRates) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update shipping rates");
    };
    storeSettings := switch (storeSettings) {
      case (null) {
        ?{
          storeInfo = {
            name = "";
            contactEmail = "";
            phoneNumber = "";
            address = "";
          };
          paymentMethods = {
            enableStripe = false;
            stripeApiKey = null;
            acceptedCardTypes = [];
          };
          shippingRates = rates;
          taxSettings = {
            salesTaxPercentage = 0.0;
            taxExemptRegions = [];
          };
          adminRoles = [];
          logo = null;
          themeColors = {
            primary1 = "#000000";
            primary2 = "#FFC0CB";
            primary3 = "#C0C0C0";
            secondary1 = "#E6E6FA";
            secondary2 = "#ADD8E6";
          };
        };
      };
      case (?settings) {
        ?{ settings with shippingRates = rates };
      };
    };
  };

  public shared ({ caller }) func updateTaxSettings(tax : TaxSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update tax settings");
    };
    storeSettings := switch (storeSettings) {
      case (null) {
        ?{
          storeInfo = {
            name = "";
            contactEmail = "";
            phoneNumber = "";
            address = "";
          };
          paymentMethods = {
            enableStripe = false;
            stripeApiKey = null;
            acceptedCardTypes = [];
          };
          shippingRates = {
            flatRate = 0;
            freeShippingThreshold = 0;
            regionShippingCosts = [];
          };
          taxSettings = tax;
          adminRoles = [];
          logo = null;
          themeColors = {
            primary1 = "#000000";
            primary2 = "#FFC0CB";
            primary3 = "#C0C0C0";
            secondary1 = "#E6E6FA";
            secondary2 = "#ADD8E6";
          };
        };
      };
      case (?settings) {
        ?{ settings with taxSettings = tax };
      };
    };
  };

  public shared ({ caller }) func updateAdminRoles(roles : [AdminUser]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update admin roles");
    };
    storeSettings := switch (storeSettings) {
      case (null) {
        ?{
          storeInfo = {
            name = "";
            contactEmail = "";
            phoneNumber = "";
            address = "";
          };
          paymentMethods = {
            enableStripe = false;
            stripeApiKey = null;
            acceptedCardTypes = [];
          };
          shippingRates = {
            flatRate = 0;
            freeShippingThreshold = 0;
            regionShippingCosts = [];
          };
          taxSettings = {
            salesTaxPercentage = 0.0;
            taxExemptRegions = [];
          };
          adminRoles = roles;
          logo = null;
          themeColors = {
            primary1 = "#000000";
            primary2 = "#FFC0CB";
            primary3 = "#C0C0C0";
            secondary1 = "#E6E6FA";
            secondary2 = "#ADD8E6";
          };
        };
      };
      case (?settings) {
        ?{ settings with adminRoles = roles };
      };
    };
  };

  public shared ({ caller }) func updateLogo(newLogo : Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update the logo");
    };
    storeSettings := switch (storeSettings) {
      case (null) {
        ?{
          storeInfo = {
            name = "";
            contactEmail = "";
            phoneNumber = "";
            address = "";
          };
          paymentMethods = {
            enableStripe = false;
            stripeApiKey = null;
            acceptedCardTypes = [];
          };
          shippingRates = {
            flatRate = 0;
            freeShippingThreshold = 0;
            regionShippingCosts = [];
          };
          taxSettings = {
            salesTaxPercentage = 0.0;
            taxExemptRegions = [];
          };
          adminRoles = [];
          logo = ?newLogo;
          themeColors = {
            primary1 = "#000000";
            primary2 = "#FFC0CB";
            primary3 = "#C0C0C0";
            secondary1 = "#E6E6FA";
            secondary2 = "#ADD8E6";
          };
        };
      };
      case (?settings) {
        ?{ settings with logo = ?newLogo };
      };
    };
  };

  public shared ({ caller }) func updateThemeColors(colors : ThemeColors) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update theme colors");
    };
    storeSettings := switch (storeSettings) {
      case (null) {
        ?{
          storeInfo = {
            name = "";
            contactEmail = "";
            phoneNumber = "";
            address = "";
          };
          paymentMethods = {
            enableStripe = false;
            stripeApiKey = null;
            acceptedCardTypes = [];
          };
          shippingRates = {
            flatRate = 0;
            freeShippingThreshold = 0;
            regionShippingCosts = [];
          };
          taxSettings = {
            salesTaxPercentage = 0.0;
            taxExemptRegions = [];
          };
          adminRoles = [];
          logo = null;
          themeColors = colors;
        };
      };
      case (?settings) {
        ?{ settings with themeColors = colors };
      };
    };
  };

  // Featured Collections
  public query func getFeaturedCollections() : async [FeaturedCollection] {
    featuredCollections.values().toArray();
  };

  public shared ({ caller }) func createFeaturedCollection(collection : FeaturedCollection) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create collections");
    };
    featuredCollections.add(collection.title, collection);
  };

  // Products
  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  // Shopping Cart
  public query ({ caller }) func getCart() : async ShoppingCart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };
    switch (userCarts.get(caller)) {
      case (null) { { items = [] } };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    let currentCart = switch (userCarts.get(caller)) {
      case (null) { { items = [] } };
      case (?cart) { cart };
    };
    let updatedItems = currentCart.items.concat([{ productId; quantity }]);
    userCarts.add(caller, { items = updatedItems });
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    let currentCart = switch (userCarts.get(caller)) {
      case (null) { { items = [] } };
      case (?cart) { cart };
    };
    let filteredItems = List.fromArray<CartItem>(currentCart.items).filter(
      func(item) { item.productId != productId }
    ).toArray();
    userCarts.add(caller, { items = filteredItems });
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    userCarts.remove(caller);
  };

  // Orders
  public query ({ caller }) func getOrders() : async [Order] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      // Admins can see all orders
      orders.values().toArray();
    } else if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      // Users can only see their own orders
      let allOrders = orders.values().toArray();
      allOrders.filter(func(order) { order.customer == caller });
    } else {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
  };

  public shared ({ caller }) func createOrder(order : Order) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    if (order.customer != caller) {
      Runtime.trap("Unauthorized: Cannot create order for another user");
    };
    orders.add(order.id, order);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        orders.add(orderId, { order with status });
      };
    };
  };

  // Reviews
  public query func getProductReviews(productId : Text) : async [Review] {
    let reviewsList = reviews.values().toArray();
    let filteredReviews = reviewsList.filter(
      func(review) { review.productId == productId }
    );
    filteredReviews;
  };

  public shared ({ caller }) func addReview(review : Review) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };
    if (review.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create review for another user");
    };
    let reviewKey = caller.toText() # "_" # review.productId;
    reviews.add(reviewKey, review);
  };

  // Reward Points
  public query ({ caller }) func getRewardPoints() : async RewardPoints {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reward points");
    };
    switch (rewardPoints.get(caller)) {
      case (null) { { userId = caller; points = 0; studentDiscountEligible = false; birthdayEligible = false; createdAt = Time.now() } };
      case (?points) { points };
    };
  };

  public shared ({ caller }) func updateRewardPoints(points : RewardPoints) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update reward points");
    };
    if (points.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot update reward points for another user");
    };
    rewardPoints.add(points.userId, points);
  };

  // Stripe Integration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be configured first") };
      case (?config) { config };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query func isStripeConfigured() : async Bool {
    switch (stripeConfig) {
      case (null) { false };
      case (_) { true };
    };
  };

  // Wishlists
  public query ({ caller }) func getWishlist() : async Wishlist {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access wishlist");
    };
    switch (userWishlists.get(caller)) {
      case (null) { { productIds = [] } };
      case (?wishlist) { wishlist };
    };
  };

  public shared ({ caller }) func addToWishlist(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to wishlist");
    };
    let currentWishlist = switch (userWishlists.get(caller)) {
      case (null) { { productIds = [] } };
      case (?wishlist) { wishlist };
    };

    let updatedWishlist = {
      productIds = [productId].concat(currentWishlist.productIds);
    };
    userWishlists.add(caller, updatedWishlist);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from wishlist");
    };
    let currentWishlist = switch (userWishlists.get(caller)) {
      case (null) { { productIds = [] } };
      case (?wishlist) { wishlist };
    };

    let filteredIds = List.fromArray(currentWishlist.productIds).filter(
      func(id) { id != productId }
    ).toArray();
    userWishlists.add(caller, { productIds = filteredIds });
  };

  // Lookbooks
  public shared ({ caller }) func createLookbook(lookbook : Lookbook) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create lookbooks");
    };
    lookbooks.add(lookbook.id, lookbook);
  };

  public query func getLookbooks() : async [Lookbook] {
    lookbooks.values().toArray();
  };

  // Stripe Session Status
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };
};
