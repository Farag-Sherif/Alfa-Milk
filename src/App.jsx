import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { connect } from "react-redux";
import { loadLanguages } from "redux-multilanguage";
import { LoadingScreen } from "./neo/ui";

const HomePage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.HomePage })));
const ShopPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.ShopPage })));
const OffersPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.OffersPage })));
const BlogPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.BlogPage })));
const BlogDetailPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.BlogDetailPage })));
const ProductPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.ProductPage })));
const AboutPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.ContactPage })));
const AccountPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.AccountPage })));
const AuthPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.AuthPage })));
const CartPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.CartPage })));
const WishlistPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.WishlistPage })));
const CheckoutPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.CheckoutPage })));
const NotFoundPage = React.lazy(() => import("./neo/pages").then((m) => ({ default: m.NotFoundPage })));

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  return null;
};

const App = ({ dispatch, currentLanguageCode }) => {
  useEffect(() => {
    dispatch(loadLanguages({ languages: { ar: {}, en: {} } }));
  }, [dispatch]);

  useEffect(() => {
    if (currentLanguageCode) {
      const isRtl = currentLanguageCode !== "en";
      document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
      if (isRtl) {
        document.documentElement.classList.add("rtl");
      } else {
        document.documentElement.classList.remove("rtl");
      }
    }
  }, [currentLanguageCode]);

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

const mapStateToProps = (state) => {
  return {
    currentLanguageCode: state.multilanguage
      ? state.multilanguage.currentLanguageCode
      : "ar",
  };
};

export default connect(mapStateToProps)(App);
