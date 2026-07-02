// Extract this logic to avoid parsing multiple times and handle possible nulls safely.
export const getIsFavoriteFromLocalStorage = (product) => {
  const storageData = localStorage.getItem("redux_localstorage_simple");
  if (storageData) {
    const wishlistData = JSON.parse(storageData).wishlistData;
    return wishlistData.some((el) => el?.id === product?.id);
  }
  return false;
};
