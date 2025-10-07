import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.baseURL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000";

export { axiosClient };
