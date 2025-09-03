import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem, Restaurant } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], restaurant: Restaurant, deliveryAddress: string, paymentMethod: string) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = async (
    items: CartItem[], 
    restaurant: Restaurant, 
    deliveryAddress: string, 
    paymentMethod: string
  ): Promise<Order> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const total = items.reduce((sum, item) => sum + (item.food.price * item.quantity), 0) + restaurant.deliveryFee;
    const estimatedDelivery = new Date();
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + parseInt(restaurant.deliveryTime.split('-')[0]));

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      restaurant,
      status: 'pending',
      createdAt: new Date(),
      estimatedDelivery,
      deliveryAddress,
      paymentMethod
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Simulate order status updates
    setTimeout(() => updateOrderStatus(newOrder.id, 'confirmed'), 2000);
    setTimeout(() => updateOrderStatus(newOrder.id, 'preparing'), 5000);
    setTimeout(() => updateOrderStatus(newOrder.id, 'delivering'), 15000);

    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrderById, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};