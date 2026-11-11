export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Product {
  id: string;
  name: string;
  price: number; // in PKR
  category: string;
  description: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isPersonalizable: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  personalization?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Cash on Delivery';
  createdAt: string;
}

export interface StoreSettings {
  whatsappNumber: string; // e.g. "923001234567"
  instagram: string; // e.g. "https://instagram.com/keyorastudio"
  deliveryCharges: number; // default PKR delivery fee
  heroText: string;
  freeDeliveryThreshold?: number; // optional free delivery threshold
}

export interface CartItem {
  cartItemId: string; // unique key (productId + personalization)
  productId: string;
  product: Product;
  qty: number;
  personalization?: string;
}
