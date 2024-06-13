import { GET_ACCOUNT_INFO_FAIL, GET_ACCOUNT_INFO_REQUEST, GET_ACCOUNT_INFO_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_USER } from "../constants/auth"


const initialState = {
    token: null,
    userInfo: null
}

const authReducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {

        //login
        case LOGIN_REQUEST:
            return {
                ...state,
                token: null,
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: payload.token ?? null,
            }
        case LOGIN_FAIL:
            return {
                ...state,
                token: null,
            }

        //logout
        case LOGOUT_USER:
            {
                return initialState
            }

        // Account info
        case GET_ACCOUNT_INFO_REQUEST:
            return {
                ...state,
            }
        case GET_ACCOUNT_INFO_SUCCESS:
            return {
                ...state,
                userInfo: { ...payload.userInfo },
            }
        case GET_ACCOUNT_INFO_FAIL:
            return {
                ...state,
            }


        //Default
        default:
            return state;
    }
}

export { authReducer }
