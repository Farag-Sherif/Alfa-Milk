/**
 * Image Caching & Retry Resilience System for Alfa Milk
 * 
 * Features:
 * 1. Automatic retry on image failure (up to 3-4 times with incremental delay).
 * 2. Caching loaded images in CacheStorage and memory blob cache.
 * 3. Fallback to cached image if network fails.
 * 4. Safe fallback to placeholder (/deal.png) if retries are exhausted.
 * 5. Global capture listener to protect all <img> elements automatically.
 */

const CACHE_NAME = "alfa-milk-images-v1";
const MAX_RETRIES = 3;
const FALLBACK_PLACEHOLDER = "/deal.png";

// In-memory blob cache for environments where CacheStorage is restricted or for instant retrieval
const memoryImageCache = new Map();

/**
 * Checks if the browser supports CacheStorage API
 */
const hasCacheStorage = () => {
  return typeof window !== "undefined" && "caches" in window;
};

/**
 * Normalizes an image URL by removing retry cache-busting params
 */
export const getCleanImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  try {
    const parsed = new URL(url, window.location.href);
    parsed.searchParams.delete("_retry");
    parsed.searchParams.delete("_t");
    return parsed.toString();
  } catch (e) {
    return url.split("?")[0];
  }
};

/**
 * Saves a successfully loaded image response/blob into CacheStorage and in-memory cache
 */
export const saveImageToCache = async (url) => {
  if (!url || typeof url !== "string") return;
  if (
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.includes(FALLBACK_PLACEHOLDER)
  ) {
    return;
  }

  const cleanUrl = getCleanImageUrl(url);

  // If already in memory cache, skip
  if (memoryImageCache.has(cleanUrl)) return;

  try {
    const response = await fetch(cleanUrl, {
      mode: "cors",
      cache: "default"
    });

    if (response && response.ok) {
      if (hasCacheStorage()) {
        try {
          const cache = await window.caches.open(CACHE_NAME);
          await cache.put(cleanUrl, response.clone());
        } catch (cacheErr) {
          // Ignore cache quota or permission errors
        }
      }

      // Also store in memory as blob URL for immediate fallback
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      memoryImageCache.set(cleanUrl, blobUrl);
    }
  } catch (err) {
    // Silent fail if network or CORS prevents fetch caching
  }
};

/**
 * Retrieves a previously cached image (from memory or CacheStorage)
 */
export const getCachedImage = async (url) => {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = getCleanImageUrl(url);

  // 1. Check in-memory blob cache first (fastest)
  if (memoryImageCache.has(cleanUrl)) {
    return memoryImageCache.get(cleanUrl);
  }

  // 2. Check CacheStorage
  if (hasCacheStorage()) {
    try {
      const cache = await window.caches.open(CACHE_NAME);
      const matched = await cache.match(cleanUrl);
      if (matched && matched.ok) {
        const blob = await matched.blob();
        const blobUrl = URL.createObjectURL(blob);
        memoryImageCache.set(cleanUrl, blobUrl);
        return blobUrl;
      }
    } catch (e) {
      // Ignore CacheStorage errors
    }
  }

  return null;
};

/**
 * Handles image load errors:
 * 1. Checks if a previously cached copy exists and serves it.
 * 2. If not, retries fetching up to maxRetries times (with backoff & cache-busting).
 * 3. If all retries fail, displays the fallback placeholder (/deal.png).
 */
export const handleImageError = async (
  eventOrElement,
  fallback = FALLBACK_PLACEHOLDER,
  maxRetries = MAX_RETRIES
) => {
  const img = eventOrElement?.target || eventOrElement;
  if (!img || !(img instanceof HTMLElement)) return;

  const currentSrc = img.src || "";

  // If already displaying the fallback placeholder, stop immediately
  if (currentSrc.includes(fallback) || currentSrc === fallback) {
    return;
  }

  // Preserve the original URL
  if (!img.dataset.originalSrc) {
    img.dataset.originalSrc = currentSrc;
  }
  const originalSrc = img.dataset.originalSrc;
  const cleanUrl = getCleanImageUrl(originalSrc);

  // 1. Attempt to serve from previously cached image
  try {
    const cachedBlobUrl = await getCachedImage(cleanUrl);
    if (cachedBlobUrl && img.src !== cachedBlobUrl) {
      img.src = cachedBlobUrl;
      return;
    }
  } catch (err) {
    // Continue to retry if cache retrieval failed
  }

  // 2. Retry logic (up to maxRetries times)
  const retries = Number(img.dataset.retryCount || 0);

  if (retries < maxRetries) {
    const nextRetry = retries + 1;
    img.dataset.retryCount = nextRetry;

    // Incremental delay before retry: 400ms, 800ms, 1200ms
    const delay = nextRetry * 400;

    setTimeout(() => {
      // Append cache-busting parameters to bypass corrupted intermediate HTTP cache
      const sep = cleanUrl.includes("?") ? "&" : "?";
      img.src = `${cleanUrl}${sep}_retry=${nextRetry}&_t=${Date.now()}`;
    }, delay);
  } else {
    // All 3-4 retries exhausted -> fallback to placeholder
    img.onerror = null;
    img.src = fallback;
  }
};

/**
 * Handles image load success: caches the image and clears retry metadata
 */
export const handleImageSuccess = (eventOrElement) => {
  const img = eventOrElement?.target || eventOrElement;
  if (!img || !(img instanceof HTMLElement)) return;

  const src = img.src || "";
  if (!src.includes(FALLBACK_PLACEHOLDER)) {
    // Cache the successful image
    saveImageToCache(src);
  }
};

/**
 * Initializes global image event listeners across the entire document
 * using event capture so that every <img> tag is automatically protected.
 */
export const initGlobalImageProtection = () => {
  if (typeof window === "undefined") return;

  // Attach to window for direct inline onError/onLoad access
  window.handleImageError = handleImageError;
  window.handleImageSuccess = handleImageSuccess;

  // Use event capturing (true) to intercept non-bubbling error events on images
  window.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (target && target.tagName === "IMG") {
        handleImageError(target, FALLBACK_PLACEHOLDER, MAX_RETRIES);
      }
    },
    true
  );

  // Use event capturing to cache successfully loaded images
  window.addEventListener(
    "load",
    (event) => {
      const target = event.target;
      if (target && target.tagName === "IMG") {
        handleImageSuccess(target);
      }
    },
    true
  );
};

// Auto-attach to window immediately when module is loaded
if (typeof window !== "undefined") {
  window.handleImageError = handleImageError;
  window.handleImageSuccess = handleImageSuccess;
}

export default {
  handleImageError,
  handleImageSuccess,
  saveImageToCache,
  getCachedImage,
  initGlobalImageProtection,
};
