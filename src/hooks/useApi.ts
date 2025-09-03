import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Restaurant, Food } from '../types';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await api.getRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError('Erro ao carregar restaurantes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  return { restaurants, loading, error };
};

export const useFoods = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setLoading(true);
        const data = await api.getFoods();
        setFoods(data);
      } catch (err) {
        setError('Erro ao carregar pratos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  return { foods, loading, error };
};