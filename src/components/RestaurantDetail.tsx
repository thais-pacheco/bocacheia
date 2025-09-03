import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Truck, MapPin } from 'lucide-react';
import { Restaurant, Food } from '../types';
import { api } from '../services/api';
import { FoodCard } from './FoodCard';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurant, onBack }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setLoading(true);
        const allFoods = await api.getFoods();
        // Filter foods by restaurant or show all if no restaurantId match
        const restaurantFoods = allFoods.filter((food: any) => food.restaurantId === restaurant.id);
        const foodsToShow = restaurantFoods.length > 0 ? restaurantFoods : allFoods.slice(0, 6);
        setFoods(foodsToShow);
      } catch (error) {
        console.error('Erro ao carregar pratos:', error);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, [restaurant.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com imagem do restaurante */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={restaurant.image || `https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800`}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90">{restaurant.description || restaurant.category}</p>
        </div>
      </div>

      {/* Info do restaurante */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-500 fill-current" />
              <span className="font-semibold">{restaurant.rating || '4.5'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{restaurant.deliveryTime || '30-45 min'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5" />
              <span>R$ {restaurant.deliveryFee?.toFixed(2) || '5.00'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{restaurant.category || 'Delivery disponível'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu de pratos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cardápio</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}

        {!loading && foods.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">Nenhum prato encontrado para este restaurante.</p>
          </div>
        )}
      </div>
    </div>
  );
};