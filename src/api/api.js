import axios from "axios";

// In-memory cache and in-flight request tracker for GET requests
export const apiCache = new Map();
export const inFlightRequests = new Map();

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://admin.alfa-milk.com/api", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `${localStorage.getItem("authToken")}` || "",
  },
});

/**
 * Generates a normalized cache key for a request URL and config.
 */
export const getCacheKey = (configOrUrl, maybeConfig = {}) => {
  let config = {};
  if (typeof configOrUrl === "string") {
    config = { ...maybeConfig, url: configOrUrl };
  } else if (configOrUrl && typeof configOrUrl === "object") {
    config = { ...configOrUrl, ...(maybeConfig || {}) };
  }

  try {
    const fullUrl = axiosInstance.getUri(config);
    const [base, query] = fullUrl.split("?");
    if (!query) return base;
    const searchParams = new URLSearchParams(query);
    searchParams.sort();
    return `${base}?${searchParams.toString()}`;
  } catch (e) {
    const url = config.url || "";
    const params = config.params ? JSON.stringify(config.params) : "";
    return `${url}?${params}`;
  }
};

/**
 * Clears the in-memory API cache completely, or deletes entries matching a given key/substring.
 */
export const clearApiCache = (keyOrUrl) => {
  if (!keyOrUrl) {
    apiCache.clear();
  } else {
    for (const key of apiCache.keys()) {
      if (key === keyOrUrl || key.includes(keyOrUrl)) {
        apiCache.delete(key);
      }
    }
  }
};

// Resolve the default Axios network adapter before overriding
const defaultAdapter = axios.getAdapter(axiosInstance.defaults.adapter);

// Custom caching & deduplication adapter for GET requests
axiosInstance.defaults.adapter = async function (config) {
  const method = (config.method || "get").toLowerCase();

  // Only GET requests are cached and deduplicated; skip if config.skipCache is set
  if (method !== "get" || config.skipCache) {
    const adapterToUse =
      config.adapter && config.adapter !== axiosInstance.defaults.adapter
        ? axios.getAdapter(config.adapter)
        : defaultAdapter;
    return adapterToUse(config);
  }

  const cacheKey = getCacheKey(config);

  // 1. If cached in apiCache, return immediately without network call
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    return {
      data: cachedData,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      cached: true,
    };
  }

  // 2. If identical request is currently in-flight, return existing promise (deduplication)
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // 3. Otherwise, initiate network request and track it
  const adapterToUse =
    config.adapter && config.adapter !== axiosInstance.defaults.adapter
      ? axios.getAdapter(config.adapter)
      : defaultAdapter;

  const requestPromise = (async () => {
    try {
      const response = await adapterToUse(config);
      // Once successful response (status 200/201) arrives, store data in cache
      if (response && (response.status === 200 || response.status === 201)) {
        apiCache.set(cacheKey, response.data);
      }
      return response;
    } finally {
      // Clean up in-flight tracker on completion or error
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

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
    if (response.data && response.data.status === "success") {
      console.log(response.data.message || "Operation successful");
    }
    return response;
  },
  (error) => {
    // Handle errors based on the backend response structure
    if (error.response) {
      const { data } = error.response;

      if (data && data.status === "error" && data.errors) {
        const errorMessages = Object.entries(data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        console.error("Validation Errors:", errorMessages);
      } else {
        console.error(
          "Error response:",
          (data && data.message) || "An unknown error occurred"
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

// Attach helper properties onto axiosInstance for convenience
axiosInstance.apiCache = apiCache;
axiosInstance.inFlightRequests = inFlightRequests;
axiosInstance.clearApiCache = clearApiCache;
axiosInstance.getCacheKey = getCacheKey;

export default axiosInstance;
