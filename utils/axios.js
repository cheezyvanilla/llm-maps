import axios from "axios";

const instance = axios.create({
  baseURL: process.env.OLLAMA_BASE_URL || "", // optional: can override per request
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Export a generic request wrapper
export async function httpRequest({
  method,
  url,
  data = null,
  params = null,
  headers = {},
}) {
  const response = await instance.request({
    method,
    url,
    data,
    params,
    headers,
  });

  return response.data; // Axios auto-parses JSON
}
