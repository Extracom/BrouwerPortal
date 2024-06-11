import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_USER } from "../constants/auth"


const initialState = {
    token: null,
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


        //Default
        default:
            return state;
    }
}

export { authReducer }
