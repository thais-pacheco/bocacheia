import React from 'react';
import { ShoppingCart, User, Search, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
  onProfileClick: () => void;
  onOrdersClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onCartClick, 
  onProfileClick, 
  onOrdersClick, 
  searchTerm, 
  onSearchChange 
}) => {
  const { itemCount } = useCart();
  const { state: authState, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-purple-600">🍔 Boca Cheia</h1>
          </div>
          
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar restaurantes ou pratos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <>
                <button 
                  onClick={onOrdersClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden sm:block">Pedidos</span>
                </button>
                
                <button 
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{authState.user?.name}</span>
                </button>
                
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={onProfileClick}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="hidden sm:block">Entrar</span>
              </button>
            )}
            
            <button 
              onClick={onCartClick}
              className="relative flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Carrinho</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};