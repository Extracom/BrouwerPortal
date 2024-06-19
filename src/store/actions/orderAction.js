import { API } from "../../services/api"
import { GET_ORDERS_FAIL, GET_ORDERS_REQUEST, GET_ORDERS_SUCCESS } from "../constants/order"

export const getOrderDataAction = ({ payload }, successCallback = () => { }, errorCallback = () => { }) => {
    return async (dispatch) => {
        dispatch({ type: GET_ORDERS_REQUEST })
        try {
            const response = await API({
                method: 'POST',
                url: `/external/lines`,
                data: payload,
            })

            dispatch({ type: GET_ORDERS_SUCCESS, payload: { data: response.data } })
            successCallback()
        } catch (error) {
            dispatch({ type: GET_ORDERS_FAIL })
            errorCallback(error)
        }
    }
}