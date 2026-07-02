import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { connect } from "react-redux";
import { loadLanguages } from "redux-multilanguage";
import {
  AboutPage,
  AccountPage,
  AuthPage,
  BlogDetailPage,
  BlogPage,
  CartPage,
  CheckoutPage,
  ContactPage,
  HomePage,
  NotFoundPage,
  OffersPage,
  ProductPage,
  ShopPage,
  WishlistPage
} from "./neo/pages";
import { LoadingScreen } from "./neo/ui";

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  return null;
};

const App = ({ dispatch }) => {
  useEffect(() => {
    dispatch(loadLanguages({ languages: { ar: {}, en: {} } }));
  }, [dispatch]);

  return (
    <ToastProvider placement="top-right" autoDismiss autoDismissTimeout={3500}>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen label="Loading application" />}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/shop" component={ShopPage} />
            <Route exact path="/offers" component={OffersPage} />
            <Route exact path="/blog" component={BlogPage} />
            <Route exact path="/post" component={BlogDetailPage} />
            <Route exact path="/post/:postId" component={BlogDetailPage} />
            <Route exact path="/product/:slug" component={ProductPage} />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/contact" component={ContactPage} />
            <Route exact path="/my-account" component={AccountPage} />
            <Route exact path="/login-register" component={AuthPage} />
            <Route exact path="/cart" component={CartPage} />
            <Route exact path="/wishlist" component={WishlistPage} />
            <Route exact path="/checkout" component={CheckoutPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Suspense>
      </Router>
    </ToastProvider>
  );
};

export default connect()(App);
