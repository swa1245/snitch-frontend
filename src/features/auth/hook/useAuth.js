import { setError,setLoading,setUser } from "../state/authSlice";
import { Login, Regsiter, GetMe, Logout } from "../service/auth.api";
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
    async function handleGetMe(){
        dispatch(setLoading(true))
        try {
            const data = await GetMe()
            dispatch(setUser(data.user))
        } catch (error) {
            console.error('Failed to get user profile:', error)
            dispatch(setUser(null))
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function handleLogout(){
        try {
            await Logout()
            dispatch(setUser(null))
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }
    return{
        handelRegsiter,
        handelLogin,
        handleGetMe,
        handleLogout
    }
}