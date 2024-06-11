import axios from "axios";
import { store } from "../store/store";

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

export { API }