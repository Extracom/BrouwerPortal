import { CHANGE_DEBTOR_FAIL, CHANGE_DEBTOR_REQUEST, CHANGE_DEBTOR_SUCCESS, GET_CUSTOMER_FAIL, GET_CUSTOMER_REQUEST, GET_CUSTOMER_SUCCESS } from "../constants/customer"

const initialState = {
    isLoading: false,
    customerData: {},
}

const customerReducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {

        //Get customer data
        case GET_CUSTOMER_REQUEST:
            return {
                ...state,
                isLoading: true,
                customerData: {}
            }
        case GET_CUSTOMER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                customerData: { ...payload.data },
            }
        case GET_CUSTOMER_FAIL:
            return {
                ...state,
                isLoading: false,
                customerData: {}
            }

        //Change current debtor
        case CHANGE_DEBTOR_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case CHANGE_DEBTOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
            }
        case CHANGE_DEBTOR_FAIL:
            return {
                ...state,
                isLoading: false,
            }

        //Default
        default:
            return state;
    }
}

export { customerReducer }
