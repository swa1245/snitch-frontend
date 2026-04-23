import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../services/cart.service';

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, variantIndex, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(productId, variantIndex, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, variantIndex, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateQuantity(productId, variantIndex, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, variantIndex }, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(productId, variantIndex);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    updatingItemId: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || action.payload.cart?.items || [];
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart.items;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQuantityAsync.pending, (state, action) => {
        state.updatingItemId = action.meta.arg.productId + (action.meta.arg.variantIndex || '');
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.updatingItemId = null;
        state.items = action.payload.cart.items;
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.updatingItemId = null;
        state.error = action.payload;
      })
      .addCase(removeFromCartAsync.pending, (state, action) => {
        state.updatingItemId = action.meta.arg.productId + (action.meta.arg.variantIndex || '');
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.updatingItemId = null;
        state.items = action.payload.cart.items;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.updatingItemId = null;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
