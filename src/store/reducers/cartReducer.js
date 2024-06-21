import { groupBy } from "../../utils/methods/global"
import { ADD_TO_CART, CHANGE_PRIORITY_ADDRESS_FAIL, CHANGE_PRIORITY_ADDRESS_REQUEST, CHANGE_PRIORITY_ADDRESS_SUCCESS, DELETE_FROM_CART, EMPTY_CART, GET_ADDRESSES_FAIL, GET_ADDRESSES_REQUEST, GET_ADDRESSES_SUCCESS, PLACE_ORDER_FAIL, PLACE_ORDER_REQUEST, PLACE_ORDER_SUCCESS, UPDATED_CART } from "../constants/cart"

const initialState = {
    isLoading: false,
    addresses: [],
    cart: [],
    cartQuantity: 0
}

const cartReducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {

        //Get addresses
        case GET_ADDRESSES_REQUEST:
            return {
                ...state,
                isLoading: true,
                addresses: []
            }
        case GET_ADDRESSES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                addresses: [...payload.data],
            }
        case GET_ADDRESSES_FAIL:
            return {
                ...state,
                isLoading: false,
                addresses: []
            }

        //Change priority address
        case CHANGE_PRIORITY_ADDRESS_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case CHANGE_PRIORITY_ADDRESS_SUCCESS: {
            const addressId = action.payload.data
            const tmpAddresses = state.addresses.map((item) => {
                if (item.id === addressId) {
                    return {
                        ...item,
                        priority: 1
                    }
                } else {
                    return {
                        ...item,
                        priority: 0
                    }
                }
            })

            return {
                ...state,
                addresses: [...tmpAddresses],
                isLoading: false,
            }
        }

        case CHANGE_PRIORITY_ADDRESS_FAIL:
            return {
                ...state,
                isLoading: false,
            }

        //Add and remove from cart 
        case ADD_TO_CART:
            return {
                ...state,
                cart: [...state.cart, ...payload],
                cartQuantity: Object.keys(groupBy([...state.cart, ...payload], 'ean')).length,
            }

        case DELETE_FROM_CART:

            return {
                ...state,
                cart: [...state.cart].filter((product) => product.ean !== payload.ean),
                cartQuantity: (Object.keys(groupBy([...state.cart].filter((product) => product.ean !== payload.ean), 'ean'))).length
            }


        case UPDATED_CART:
            return {
                ...state,
                cart: payload,
            }

        case EMPTY_CART:
            return {
                ...state,
                cart: [],
                cartQuantity: 0
            }


        //Place order
        case PLACE_ORDER_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case PLACE_ORDER_SUCCESS:
            return {
                ...state,
                isLoading: false,
            }
        case PLACE_ORDER_FAIL:
            return {
                ...state,
                isLoading: false,
            }

        //Default
        default:
            return state;
    }
}

export { cartReducer }
