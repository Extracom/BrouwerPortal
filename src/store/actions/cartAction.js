import { API } from "../../services/api"
import { ADD_TO_CART, CHANGE_PRIORITY_ADDRESS_FAIL, CHANGE_PRIORITY_ADDRESS_REQUEST, CHANGE_PRIORITY_ADDRESS_SUCCESS, DELETE_FROM_CART, EMPTY_CART, GET_ADDRESSES_FAIL, GET_ADDRESSES_REQUEST, GET_ADDRESSES_SUCCESS, PLACE_ORDER_FAIL, PLACE_ORDER_REQUEST, PLACE_ORDER_SUCCESS, UPDATED_CART } from "../constants/cart"

export const getAddressesAction = (successCallback = () => { }, errorCallback = () => { }) => {
    return async (dispatch) => {
        dispatch({ type: GET_ADDRESSES_REQUEST })
        try {
            const response = await API({
                method: 'GET',
                url: `/salesorder/debtor/addresses`,
            })
            dispatch({ type: GET_ADDRESSES_SUCCESS, payload: { data: response.data } })
            successCallback()
        } catch (error) {
            dispatch({ type: GET_ADDRESSES_FAIL })
            errorCallback(error)
        }
    }
}

export const changePriorityAddressAction = (payload, successCallback = () => { }, errorCallback = () => { }) => {
    return async (dispatch) => {
        dispatch({ type: CHANGE_PRIORITY_ADDRESS_REQUEST })
        try {
            const response = await API({
                method: 'POST',
                url: `/salesorder/debtor/addresses/${payload}`,
            })
            dispatch({ type: CHANGE_PRIORITY_ADDRESS_SUCCESS, payload: { data: payload } })
            successCallback(response, payload)
        } catch (error) {
            dispatch({ type: CHANGE_PRIORITY_ADDRESS_FAIL })
            errorCallback(error)
        }
    }
}

export const addToCartAction = ({ payload }) => {
    return (dispatch) => {
        dispatch({ type: ADD_TO_CART, payload })
    }
}

export const deleteFromCartAction = ({ payload }) => {
    return (dispatch) => {
        dispatch({ type: DELETE_FROM_CART, payload })
    }
}

export const clearCart = () => {
    return (dispatch) => {
        dispatch({ type: EMPTY_CART })
    }
}

export const updatedCart = ({ payload }) => {
    return (dispatch) => {
        dispatch({ type: UPDATED_CART, payload })
    }
}

export const placeOrderAction = ({ payload }, successCallback = () => { }, errorCallback = () => { }) => {
    return async (dispatch) => {
        dispatch({ type: PLACE_ORDER_REQUEST })
        try {
            const response = await API({
                method: 'POST',
                url: `external/order`,
                data: payload,
            })

            dispatch({ type: PLACE_ORDER_SUCCESS, payload: { data: response.data } })
            successCallback(response)
        } catch (error) {
            dispatch({ type: PLACE_ORDER_FAIL })
            errorCallback(error)
        }
    }
}