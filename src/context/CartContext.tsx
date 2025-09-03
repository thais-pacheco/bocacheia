import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Food } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; food: Food }
  | { type: 'REMOVE_ITEM'; foodId: number }
  | { type: 'UPDATE_QUANTITY'; foodId: number; quantity: number }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.food.id === action.food.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.food.id === action.food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.food.price * item.quantity), 0)
        };
      } else {
        const newItems = [...state.items, { id: Date.now(), food: action.food, quantity: 1 }];
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.food.price * item.quantity), 0)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.food.id !== action.foodId);
      return {
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.food.price * item.quantity), 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', foodId: action.foodId });
      }
      
      const updatedItems = state.items.map(item =>
        item.food.id === action.foodId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.food.price * item.quantity), 0)
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (food: Food) => void;
  removeItem: (foodId: number) => void;
  updateQuantity: (foodId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (food: Food) => dispatch({ type: 'ADD_ITEM', food });
  const removeItem = (foodId: number) => dispatch({ type: 'REMOVE_ITEM', foodId });
  const updateQuantity = (foodId: number, quantity: number) => 
    dispatch({ type: 'UPDATE_QUANTITY', foodId, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};