import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'
import rootReducer from './rootReducer';
import persistStore from 'redux-persist/es/persistStore';


const updatedApplyMiddleware = applyMiddleware(thunk)
const store = createStore(
    rootReducer,
    updatedApplyMiddleware
);

let persistor = persistStore(store)


export { persistor, store };