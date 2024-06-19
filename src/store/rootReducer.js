import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authReducer } from './reducers/authReducer'
import { messageApiReducer } from './reducers/messageApiReducer'
import { orderReducer } from './reducers/orderReducer'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth: authReducer,
    messageApi: messageApiReducer,
    order: orderReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default persistedReducer;

