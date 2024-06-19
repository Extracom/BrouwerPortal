import { GET_ORDERS_FAIL, GET_ORDERS_REQUEST, GET_ORDERS_SUCCESS } from "../constants/order"

const initialState = {
    isLoading: false,
    orderData: {},
}

const orderReducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {

        //Get orders data
        case GET_ORDERS_REQUEST:
            return {
                ...state,
                isLoading: true,
                orderData: {}
            }
        case GET_ORDERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                orderData: { ...payload.data },
            }
        case GET_ORDERS_FAIL:
            return {
                ...state,
                isLoading: false,
                orderData: {}
            }

        //Default
        default:
            return state;
    }
}

export { orderReducer }
