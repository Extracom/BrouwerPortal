import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTER } from "../../utils/router/router";
import { useEffect } from "react";
import { getAccountInfoAction } from "../../store/actions/authActions";

const AuthWrapper = () => {

    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth)

    useEffect(() => {
        if (!userData.userInfo) {
            dispatch(getAccountInfoAction())
        }
    }, [userData.userInfo])


    return (
        <>
            {userData.token ? <Outlet /> : <Navigate to={ROUTER.login} />}
        </>
    )
}

export default AuthWrapper
