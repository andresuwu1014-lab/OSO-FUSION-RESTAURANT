export type ProductCategory = 'entradas' | 'principales' | 'postres' | 'bebidas';

export interface ExtraOption {
  id: string;
  name: string;
  priceExtra: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  prepTimeMinutes: number;
  image: string;
  ingredients: string[];
  allergens: string[];
  allergensConfirmed: boolean;
  availableSauces: string[];
  removableIngredients: string[];
  extraOptions: ExtraOption[];
  featured?: boolean;
}

export interface Customization {
  selectedSauce?: string;
  removedIngredients: string[];
  addedExtras: ExtraOption[];
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  customization: Customization;
  unitPrice: number;
  subtotal: number;
}

export type OrderModality = 'mesa' | 'recoger' | 'domicilio';

export interface Promotion {
  id: string;
  name: string;
  badge: string;
  description: string;
  benefit: string;
  type: 'birthday' | 'groups' | 'wednesday' | 'sunday' | 'special_date';
  active: boolean;
  stackable: boolean;
  freeProductName?: string;
  conditions: string;
  discountPercentage?: number;
  applicableDay?: number; // 0 = Sunday, 3 = Wednesday
  minGroupSize?: number;
}

export interface RestaurantConfig {
  name: string;
  slogan: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  whatsappNumber: string;
  baseDeliveryFee: number;
  basePrepTimeMinutes: number;
  baseDeliveryTimeMinutes: number;
  openingHours: string;
  scheduleDescription: string;
  adminPin: string;
  allowStackablePromos: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  modality: OrderModality;
  customerName: string;
  phone: string;
  tableNumber?: string;
  deliveryAddress?: string;
  deliveryNeighborhood?: string;
  paymentMethod: 'efectivo' | 'nequi' | 'tarjeta';
  cashChangeAmount?: string;
  notes?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: 'recibido' | 'preparando' | 'listo' | 'entregado';
  discountReason?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'add_to_cart' | 'open_product' | 'view_promo';
    productId?: string;
    promoId?: string;
    label?: string;
  };
  suggestions?: string[];
}
