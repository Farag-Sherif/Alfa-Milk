import React, { Fragment } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import LayoutOne from "../../layouts/LayoutOne";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
  getWishlist,
} from "../../redux/actions/wishlistActions";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Wishlist = ({
  location,
  addToCart,
  wishlistItems,
  deleteFromWishlist,
  currentLanguageCode,
  strings,
}) => {
  const { addToast } = useToasts();
  const { pathname } = location;
  const history = useHistory(); // هنستخدمها عشان نوجه العميل لصفحة المنتج لو متعدد الأوزان

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["elmoda"]} | {strings["wishlist"]}
        </title>
        <meta
          name="description"
          content="Wishlist page of flone react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["wishlist"]}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems && wishlistItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">
                  {strings["wishlist_page_title"]}
                </h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>{strings["image"]}</th>
                            <th>{strings["product_name"]}</th>
                            <th>{strings["unit_price"]}</th>
                            <th>{strings["add_to_cart"]}</th>
                            <th>{strings["action"]}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems.map((wishlistItem, key) => {
                            
                            // --- فحص الأوزان لكل منتج في الرغبات ---
                            let parsedVariations = [];
                            try {
                              if (wishlistItem?.variations) {
                                parsedVariations = typeof wishlistItem.variations === 'string' ? JSON.parse(wishlistItem.variations) : wishlistItem.variations;
                              }
                            } catch (error) {}
                            
                            const hasVariations = parsedVariations && parsedVariations.length > 0;
                            
                            // تحديد السعر اللي هيتعرض
                            const displayPrice = hasVariations 
                                ? (currentLanguageCode === "ar" ? "متعدد الأوزان" : "Multiple Weights")
                                : (wishlistItem?.price + " " + (strings["EG"] || "EG"));

                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem?.slug
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        wishlistItem?.image_path || "/deal.png"
                                      }
                                      alt="ITEMS"
                                    />
                                  </Link>
                                </td>

                                <td className="product-name text-center">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem?.slug
                                    }
                                  >
                                    {currentLanguageCode === "en"
                                      ? wishlistItem?.translations[1].name
                                      : wishlistItem?.translations[0].name ||
                                        "NO MAME"}
                                  </Link>
                                </td>

                                {/* عرض السعر المعدل */}
                                <td className="product-price-cart">
                                  <span style={{ fontWeight: hasVariations ? "normal" : "bold", color: hasVariations ? "#888" : "#333" }}>
                                    {displayPrice}
                                  </span>
                                </td>

                                <td className="product-wishlist-cart">
                                  {hasVariations ? (
                                    // زرار "اختر الوزن" لو المنتج متعدد الأوزان
                                    <button
                                      onClick={() => history.push(process.env.PUBLIC_URL + "/product/" + wishlistItem?.slug)}
                                      className="active"
                                      style={{ backgroundColor: "#731b26", color: "#fff", border: "none" }}
                                    >
                                      {currentLanguageCode === "ar" ? "اختر الوزن" : "Select Option"}
                                    </button>
                                  ) : (
                                    // زرار "أضف للسلة" العادي لو المنتج ملوش أوزان
                                    <button
                                      onClick={() =>
                                        addToCart(wishlistItem, addToast)
                                      }
                                      title={
                                        wishlistItem !== undefined
                                          ? "Added to cart"
                                          : "Add to cart"
                                      }
                                    >
                                      {strings["add_to_cart"]}
                                    </button>
                                  )}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      deleteFromWishlist(wishlistItem, addToast)
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to={process.env.PUBLIC_URL + "/shop"}>
                          {strings["continue_shopping"]}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {strings["EMPTY_TITLE"]} <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        {strings["shop"]}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    addToWishlist: (item, addToast, quantityCount) => {
      dispatch(addToWishlist(item, addToast, quantityCount));
    },
    deleteFromWishlist: (item, addToast, quantityCount) => {
      dispatch(deleteFromWishlist(item, addToast, quantityCount));
    },
    getWishlist: () => {
      dispatch(getWishlist());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(Wishlist));