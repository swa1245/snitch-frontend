import axios from 'axios';

const API_URL = 'http://localhost:4000/api/cart'; // Adjust based on your backend URL

export const cartService = {
  addToCart: async (productId, variantIndex, quantity) => {
    const response = await axios.post(`${API_URL}/add`, { productId, variantIndex, quantity }, { withCredentials: true });
    return response.data;
  },

  getCart: async () => {
    const response = await axios.get(`${API_URL}/`, { withCredentials: true });
    return response.data;
  },

  removeFromCart: async (productId, variantIndex) => {
    const response = await axios.delete(`${API_URL}/remove`, { data: { productId, variantIndex }, withCredentials: true });
    return response.data;
  },

  updateQuantity: async (productId, variantIndex, quantity) => {
    const response = await axios.put(`${API_URL}/update`, { productId, variantIndex, quantity }, { withCredentials: true });
    return response.data;
  }
};
