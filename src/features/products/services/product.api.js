import axios from "axios";

const productApiInstance = axios.create({
    baseURL:"/api/products",
    withCredentials:true
})

export const createProduct = async({formData})=>{
    const res = await productApiInstance.post('/',formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
    return res.data
}

export const getSellerProducts = async()=>{
    const res = await productApiInstance.get('/seller')
    return res.data
}