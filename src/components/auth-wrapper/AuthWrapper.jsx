import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTER } from "../../utils/router/router";

const AuthWrapper = () => {
    const userData = useSelector((state) => state.auth)

    return (
        <>
            {true ? <Outlet /> : <Navigate to={ROUTER.login} />}
            {/* {userData.token ? <Outlet /> : <Navigate to={ROUTER.login} />} */}
        </>
    )
}

export default AuthWrapper
