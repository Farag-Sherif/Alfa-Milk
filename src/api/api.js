import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://admin.omdacoffee.com/api", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `${localStorage.getItem("authToken")}` || "",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.data.status === "success") {
      console.log(response.data.message || "Operation successful");
    }
    return response;
  },
  (error) => {
    // Handle errors based on the backend response structure
    if (error.response) {
      const { data } = error.response;

      if (data.status === "error" && data.errors) {
        const errorMessages = Object.entries(data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        console.error("Validation Errors:", errorMessages);
      } else {
        console.error(
          "Error response:",
          data.message || "An unknown error occurred"
        );
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
