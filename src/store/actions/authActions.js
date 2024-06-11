import { API } from "../../services/api";
import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_USER } from "../constants/auth";

export const signInAction = (payload, successCallback, errorCallback) => {
    return async (dispatch) => {
        dispatch({ type: LOGIN_REQUEST });
        try {
            const response = await API({
                method: 'POST',
                url: `/all/V1/integration/customer/token`,
                data: payload,
            })

            console.log('response :>> ', response);

            dispatch({
                type: LOGIN_SUCCESS, payload: {
                    token: null
                }
            })
            successCallback()
        } catch (error) {
            dispatch({ type: LOGIN_FAIL })
            errorCallback(error)
        }
    }
}

export const logoutAction = () => {
    return {
        type: LOGOUT_USER
    }
}