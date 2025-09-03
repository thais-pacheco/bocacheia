import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetail } from './components/RestaurantDetail';
import { CategoryFilter } from './components/CategoryFilter';
import { Cart } from './components/Cart';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { useRestaurants, useFoods } from './hooks/useApi';
import { Restaurant } from './types';

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { restaurants, loading: restaurantsLoading } = useRestaurants();
  const { foods } = useFoods();

  // Listen for checkout event from cart
  React.useEffect(() => {
    const handleOpenCheckout = () => {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    };

    window.addEventListener('openCheckout', handleOpenCheckout);
    return () => window.removeEventListener('openCheckout', handleOpenCheckout);
  }, []);

  // Get unique categories from restaurants
  const categories = Array.from(new Set(restaurants.map(r => r.category).filter(Boolean)));

  // Filter restaurants based on search and category
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedRestaurant) {
    return (
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <RestaurantDetail 
              restaurant={selectedRestaurant} 
              onBack={() => setSelectedRestaurant(null)}
            />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
            <OrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header 
              onCartClick={() => setIsCartOpen(true)}
              onProfileClick={() => setIsAuthOpen(true)}
              onOrdersClick={() => setIsOrdersOpen(true)}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <Hero />
            
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Restaurantes Disponíveis
                </h2>
                <p className="text-gray-600">
                  Escolha entre {filteredRestaurants.length} restaurantes incríveis
                </p>
              </div>

              {restaurantsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onClick={() => setSelectedRestaurant(restaurant)}
                    />
                  ))}
                </div>
              )}

              {!restaurantsLoading && filteredRestaurants.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">Nenhum restaurante encontrado</p>
                  <p className="text-sm mt-2">Tente ajustar sua busca ou filtros</p>
                </div>
              )}
            </main>

            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
            <OrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
          </div>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;