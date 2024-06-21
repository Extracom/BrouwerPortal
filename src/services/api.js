import axios from "axios";
import { store } from "../store/store";
import { logoutAction } from "../store/actions/authActions";

const API = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
})

API.interceptors.request.use(async (config) => {
    const token = store.getState().auth.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

API.interceptors.response.use((res) => {
    return res;
}, (err) => {
    if (err.response.status === 401) {
        store.dispatch(logoutAction())
    }
    return Promise.reject(err)
})

export { API }