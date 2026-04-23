import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/authSlice.js";
import productReducer from "../features/products/state/productSlice.js";
import cartReducer from "../features/cart/state/cartSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
    },
})