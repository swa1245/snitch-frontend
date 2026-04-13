import { setError,setLoading,setUser } from "../state/authSlice";
import { Login, Regsiter } from "../service/auth.api";
import { useDispatch } from "react-redux";


export const useAuth = ()=>{

    const dispatch = useDispatch()
    async function handelRegsiter({email,contactNumber,password,fullName,isSeller = false}){
         const data = await Regsiter({email,contact:contactNumber,password,fullName,isSeller})
         dispatch(setUser(data.user))
    }
    async function handelLogin({email,password}){
        const data = await Login({email,password})
        dispatch(setUser(data.user))
    }
    return{
        handelRegsiter,
        handelLogin
    }
}