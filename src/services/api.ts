const API_BASE = 'https://apifakedelivery.vercel.app';

export const api = {
  async getUsers() {
    const response = await fetch(`${API_BASE}/users`);
    return response.json();
  },

  async getUser(id: number) {
    const response = await fetch(`${API_BASE}/users/${id}`);
    return response.json();
  },

  async getRestaurants() {
    const response = await fetch(`${API_BASE}/restaurants`);
    return response.json();
  },

  async getRestaurant(id: number) {
    const response = await fetch(`${API_BASE}/restaurants/${id}`);
    return response.json();
  },

  async getFoods() {
    const response = await fetch(`${API_BASE}/foods`);
    return response.json();
  },

  async getFood(id: number) {
    const response = await fetch(`${API_BASE}/foods/${id}`);
    return response.json();
  },

  async getFoodsByRestaurant(restaurantId: number) {
    const foods = await this.getFoods();
    return foods.filter((food: any) => food.restaurantId === restaurantId);
  }
};