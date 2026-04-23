import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "products",
    initialState: {
        sellerProducts: [],
        allProducts: [],
        productDetails: null,
        loading: false,
        error: null,
        createSuccess: false,
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload;
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload;
        },
        setProductDetails: (state, action) => {
            state.productDetails = action.payload;
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

export const {
    setSellerProducts,
    setAllProducts,
    setProductDetails,
    setLoading,
    setError,
    setCreateSuccess,
    addProduct,
} = productSlice.actions;

export default productSlice.reducer;
