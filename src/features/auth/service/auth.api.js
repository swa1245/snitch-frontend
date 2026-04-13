import axios from "axios";

const authApiInstance = axios.create({
    baseURL:"/api/auth",
    withCredentials:true
})

export const Regsiter = async({email,contact,password,fullName,isSeller})=>{
    const res = await authApiInstance.post('/register',{
        email,
        contact,
        password,
        fullName,
        isSeller,
        role: isSeller ? 'seller' : 'buyer'
    })
    return res.data
}

export const Login = async({email,password})=>{
    const res = await authApiInstance.post('/login',{
        email,
        password
    })
    return res.data
}