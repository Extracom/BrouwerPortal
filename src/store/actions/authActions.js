import { API } from "../../services/api";
import { GET_ACCOUNT_INFO_FAIL, GET_ACCOUNT_INFO_REQUEST, GET_ACCOUNT_INFO_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_USER } from "../constants/auth";

export const signInAction = (payload, successCallback, errorCallback) => {
    return async (dispatch) => {
        dispatch({ type: LOGIN_REQUEST });
        try {
            const response = await API({
                method: 'POST',
                url: `/account/token`,
                data: payload
            })

            dispatch({
                type: LOGIN_SUCCESS, payload: {
                    token: response.data
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


export const getAccountInfoAction = (payload, successCallback = () => { }, errorCallback = () => { }) => {
    return async (dispatch) => {
        dispatch({ type: GET_ACCOUNT_INFO_REQUEST });
        try {
            const response = await API({
                method: 'POST',
                url: `/account/info`,
                data: payload
            })

            dispatch({
                type: GET_ACCOUNT_INFO_SUCCESS, payload: {
                    userInfo: response.data
                }
            })
            successCallback()
        } catch (error) {
            dispatch({ type: GET_ACCOUNT_INFO_FAIL })
            errorCallback(error)
        }
    }
}