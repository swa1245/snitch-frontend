import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "products",
    initialState: {
        sellerProducts: [],
        loading: false,
        error: null,
        createSuccess: false,
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setCreateSuccess: (state, action) => {
            state.createSuccess = action.payload;
        },
        addProduct: (state, action) => {
            state.sellerProducts.unshift(action.payload);
        },
    },
});

export const { setSellerProducts, setLoading, setError, setCreateSuccess, addProduct } =
    productSlice.actions;

export default productSlice.reducer;
