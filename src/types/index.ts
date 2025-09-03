export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  description?: string;
}

export interface Food {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  restaurantId: number;
  restaurantName?: string;
}

export interface CartItem {
  id: number;
  food: Food;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  restaurant: Restaurant;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered';
  createdAt: Date;
  estimatedDelivery: Date;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}