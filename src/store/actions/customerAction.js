import { API } from "../../services/api"
import { GET_ACCOUNT_INFO_SUCCESS } from "../constants/auth"
import { CHANGE_DEBTOR_FAIL, CHANGE_DEBTOR_REQUEST, CHANGE_DEBTOR_SUCCESS, GET_CUSTOMER_FAIL, GET_CUSTOMER_REQUEST, GET_CUSTOMER_SUCCESS } from "../constants/customer"

export const getCustomerDataAction = ({ payload }, successCallback = () => { }, errorCallback = () => { }) => {
    return async (dispatch) => {
        dispatch({ type: GET_CUSTOMER_REQUEST })
        try {
            const response = await API({
                method: 'POST',
                url: `/account/customers`,
                data: payload,
            })

            dispatch({ type: GET_CUSTOMER_SUCCESS, payload: { data: response.data } })
            successCallback()
        } catch (error) {
            dispatch({ type: GET_CUSTOMER_FAIL })
            errorCallback(error)
        }
    }
}

export const changeCurrentDebtorAction = (payload, successCallback, errorCallback) => {
    return async (dispatch) => {
        dispatch({ type: CHANGE_DEBTOR_REQUEST })
        try {
            const response = await API({
                method: 'POST',
                url: `/account/debtor-change/${payload}`,
                data: payload,
            })

            if (response.data) {
                const userDataResponse = await API({
                    method: 'POST',
                    url: `/account/info`,
                })

                dispatch({ type: CHANGE_DEBTOR_SUCCESS, payload: { data: response.data } })
                dispatch({ type: GET_ACCOUNT_INFO_SUCCESS, payload: { userInfo: userDataResponse.data } })
                successCallback()
            }
        } catch (error) {
            dispatch({ type: CHANGE_DEBTOR_FAIL })
            errorCallback(error)
        }
    }
}