import React from "react";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { load, save } from "redux-localstorage-simple";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import App from "./App";
import "./neo/styles.css";
import rootReducer from "./redux/reducers/rootReducer";
import * as serviceWorker from "./serviceWorker";
import { getCartItems } from "./redux/actions/cartActions";
import { getWishlist } from "./redux/actions/wishlistActions";

const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(thunk, save()))
);

if (localStorage.getItem("authToken")) {
  store.dispatch(getWishlist());
  store.dispatch(getCartItems());
}

window.process = window.process || { env: {} };

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

serviceWorker.unregister();
