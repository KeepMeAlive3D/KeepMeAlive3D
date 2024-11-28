import axios from "axios";


//TODO SET token header
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000,
})

export default service
