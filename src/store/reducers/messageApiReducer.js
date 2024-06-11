import { ADD_MESSAGE_API } from "../constants/messageApi";

const initialState = {
    messageApi: null
}

const messageApiReducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {

        case ADD_MESSAGE_API:
            return {
                ...state,
                messageApi: payload,
            }

        //Default
        default:
            return state;
    }
}

export { messageApiReducer }
