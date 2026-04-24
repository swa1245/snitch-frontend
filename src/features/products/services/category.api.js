import axios from "axios";

const categoryApiInstance = axios.create({
    baseURL: "/api/categories",
    withCredentials: true
});

export const getCategories = async (type) => {
    const res = await categoryApiInstance.get("/", { params: { type } });
    return res.data;
};
