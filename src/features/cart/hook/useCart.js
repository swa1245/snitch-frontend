import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync, fetchCartAsync, removeFromCartAsync, updateQuantityAsync } from '../state/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, loading, updatingItemId, error } = useSelector((state) => state.cart);

  const handleAddToCart = (productId, variantIndex, quantity = 1) => {
    return dispatch(addToCartAsync({ productId, variantIndex, quantity }));
  };

  const handleFetchCart = () => {
    return dispatch(fetchCartAsync());
  };

  const handleRemoveFromCart = (productId, variantIndex) => {
    return dispatch(removeFromCartAsync({ productId, variantIndex }));
  };

  const handleUpdateQuantity = (productId, variantIndex, quantity) => {
    return dispatch(updateQuantityAsync({ productId, variantIndex, quantity }));
  };

  return {
    items,
    loading,
    updatingItemId,
    error,
    handleAddToCart,
    handleFetchCart,
    handleRemoveFromCart,
    handleUpdateQuantity
  };
};
