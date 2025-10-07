import axios from 'axios'

const axiosClient = axios.create()

axiosClient.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export { axiosClient }
