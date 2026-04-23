import { useDispatch, useSelector } from "react-redux";
import {
    setSellerProducts,
    setAllProducts,
    setProductDetails,
    setLoading,
    setError,
    setCreateSuccess,
    addProduct,
} from "../state/productSlice.js";
import {
    createProduct as createProductApi,
    getSellerProducts as getSellerProductsApi,
    getAllProducts as getAllProductsApi,
    getProductDetails as getProductDetailsApi,
} from "../services/product.api.js";

export const useProduct = () => {
    const dispatch = useDispatch();
    const { sellerProducts, allProducts, productDetails, loading, error, createSuccess } = useSelector(
        (state) => state.products
    );

    const handleCreateProduct = async (formData) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        dispatch(setCreateSuccess(false));
        try {
            const data = await createProductApi({ formData });
            dispatch(addProduct(data.product));
            dispatch(setCreateSuccess(true));
            return data;
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "Failed to create product."));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleFetchSellerProducts = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getSellerProductsApi();
            dispatch(setSellerProducts(data.products));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "Failed to fetch products."));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleFetchAllProducts = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getAllProductsApi();
            dispatch(setAllProducts(data.products));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "Failed to fetch products."));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleFetchProductDetails = async (id) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getProductDetailsApi(id);
            dispatch(setProductDetails(data.product));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "Failed to fetch product details."));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        sellerProducts,
        allProducts,
        productDetails,
        loading,
        error,
        createSuccess,
        handleCreateProduct,
        handleFetchSellerProducts,
        handleFetchAllProducts,
        handleFetchProductDetails,
    };
};
