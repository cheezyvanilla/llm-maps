import axios from "axios";

class HttpClient {
  constructor(baseURL = "") {
    this.instance = axios.create({
      baseURL: baseURL, // Set from constructor parameter
      timeout: 10000, // 10 seconds
      headers: {
        "Content-Type": "application/json",
      },
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
