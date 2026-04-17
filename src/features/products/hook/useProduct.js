import { useDispatch, useSelector } from "react-redux";
import {
    setSellerProducts,
    setLoading,
    setError,
    setCreateSuccess,
    addProduct,
} from "../state/productSlice.js";
import {
    createProduct as createProductApi,
    getSellerProducts as getSellerProductsApi,
} from "../services/product.api.js";

export const useProduct = () => {
    const dispatch = useDispatch();
    const { sellerProducts, loading, error, createSuccess } = useSelector(
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

    return {
        sellerProducts,
        loading,
        error,
        createSuccess,
        handleCreateProduct,
        handleFetchSellerProducts,
    };
};
