import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logoutAction } from "../store/actions/authActions"
import { ROUTER } from "../utils/router/router"

export const useLogoutUser = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logoutUser = () => {
        dispatch(logoutAction())
        navigate(ROUTER.login)
    }
    return logoutUser
}