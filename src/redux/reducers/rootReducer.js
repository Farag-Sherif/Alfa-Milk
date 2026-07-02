import { combineReducers } from "redux";
import { createMultilanguageReducer } from "redux-multilanguage";
import cartReducer from "./cartReducer";
import compareReducer from "./compareReducer";
import currencyReducer from "./currencyReducer";
import wishlistReducer from "./wishlistReducer";
import cartAddedSidebarReducer from "./cartAddedSidebarReducer";

const rootReducer = combineReducers({
  multilanguage: createMultilanguageReducer({ currentLanguageCode: "ar" }),
  currencyData: currencyReducer,
  cartData: cartReducer,
  wishlistData: wishlistReducer,
  compareData: compareReducer,
  cartAddedSidebar: cartAddedSidebarReducer,
});

export default rootReducer;
