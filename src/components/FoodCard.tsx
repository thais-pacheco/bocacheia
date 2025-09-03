import React from 'react';
import { Plus } from 'lucide-react';
import { Food } from '../types';
import { useCart } from '../context/CartContext';

interface FoodCardProps {
  food: Food;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="h-40 overflow-hidden rounded-t-xl">
        <img 
          src={food.image || `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400`}
          alt={food.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-900 mb-2">{food.name}</h4>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-purple-600">
            R$ {food.price?.toFixed(2) || '15.90'}
          </span>
          
          <button 
            onClick={() => addItem(food)}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};