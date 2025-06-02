import axios from "axios";

class HttpClient {
  constructor(baseURL = "") {
    this.instance = axios.create({
      baseURL: baseURL, // Set from constructor parameter
      timeout: 30000, // 30 seconds local ollama take so long to response
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });

    // Add interceptors
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Axios error:", error?.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async request({ method, url, data = null, params = null, headers = {} }) {
    if (method !== "GET") headers["Content-Type"] = "application/json";
    const response = await this.instance.request({
      method,
      url,
      data,
      params,
      headers,
    });

    return response.data;
  }
}

export default HttpClient;
