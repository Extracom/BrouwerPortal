import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logoutAction } from "../store/actions/authActions"

export const useLogoutUser = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logoutUser = () => {
        dispatch(logoutAction())
        navigate('/login')
    }
    return logoutUser
}