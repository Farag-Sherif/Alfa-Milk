import React, { Fragment } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";

import LayoutOne from "../../layouts/LayoutOne";
import {
  addToCart,
  deleteAllFromCart,
  deleteFromCart,
  updateQuantity,
} from "../../redux/actions/cartActions";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

// ─── Styles ───────────────────────────────────────────────────────────────────
const cartStyles = `
  @media (max-width: 767px) {
    .cart-table-content,
    .cart-shiping-update-wrapper,
    .grand-totall {
      display: none !important;
    }
    .cart-mobile-list {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    .cart-mobile-card {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 100%;
      padding: 14px 0;
      border-bottom: 1px solid #ececec;
      direction: rtl;
      gap: 0;
    }
    .cart-mobile-card__image { flex-shrink: 0; width: 80px; }
    .cart-mobile-card__image img {
      width: 80px; height: 95px;
      object-fit: cover; border-radius: 8px; display: block;
    }
    .cart-mobile-card__center {
      flex: 1; display: flex; flex-direction: column;
      gap: 5px; padding: 0 12px;
    }
    .cart-mobile-card__name {
      font-size: 14px; font-weight: 700; color: #1a1a1a;
      text-decoration: none; line-height: 1.4;
    }
    .cart-mobile-card__name:hover { color: #555; text-decoration: none; }
    .cart-mobile-card__meta { font-size: 12px; color: #888; line-height: 1.75; }
    .cart-mobile-card__meta span { display: block; }
    .cart-mobile-card__qty {
      display: flex; align-items: center;
      margin-top: 6px; direction: ltr; width: fit-content;
    }
    .cart-mobile-card__qty-btn {
      width: 30px; height: 30px; border: 1.5px solid #bbb;
      border-radius: 6px; background: #fff; font-size: 18px;
      cursor: pointer; display: flex; align-items: center;
      justify-content: center; color: #333; line-height: 1;
      transition: border-color 0.15s; padding: 0;
    }
    .cart-mobile-card__qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .cart-mobile-card__qty-btn:not(:disabled):hover { border-color: #555; }
    .cart-mobile-card__qty-value {
      min-width: 32px; text-align: center;
      font-size: 14px; font-weight: 600; color: #1a1a1a;
    }
    .cart-mobile-card__actions {
      display: flex; align-items: center;
      gap: 16px; margin-top: 8px; direction: ltr;
    }
    .cart-mobile-card__action-btn {
      background: none; border: none; cursor: pointer;
      padding: 0; color: #aaa; font-size: 15px;
      display: flex; align-items: center; transition: color 0.15s;
    }
    .cart-mobile-card__action-btn:hover { color: #444; }
    .cart-mobile-card__action-btn.remove:hover { color: #e74c3c; }
    .cart-mobile-card__left {
      flex-shrink: 0; display: flex; flex-direction: column;
      align-items: flex-start; justify-content: flex-start;
      min-width: 80px; padding-top: 2px;
    }
    .cart-mobile-card__price {
      font-size: 13px; font-weight: 700;
      color: #1a1a1a; white-space: nowrap;
    }
    .cart-mobile-summary { padding: 16px 0 0; direction: rtl; }
    .cart-mobile-summary__row {
      display: flex; justify-content: space-between; align-items: flex-start;
    }
    .cart-mobile-summary__title { font-size: 15px; font-weight: 700; color: #1a1a1a; }
    .cart-mobile-summary__note {
      font-size: 11px; color: #aaa; margin-top: 3px;
      max-width: 200px; line-height: 1.5;
    }
    .cart-mobile-summary__amount {
      font-size: 15px; font-weight: 700; color: #1a1a1a; white-space: nowrap;
    }
    .cart-mobile-checkout {
      display: block; width: 100%; background: #1a1a1a;
      color: #fff !important; text-align: center; padding: 15px;
      border-radius: 10px; font-size: 15px; font-weight: 600;
      text-decoration: none !important; margin-top: 16px; border: none; cursor: pointer;
    }
    .cart-mobile-checkout:hover { background: #333; }
    .cart-mobile-continue {
      display: block; text-align: center; margin-top: 10px;
      font-size: 13px; color: #999; text-decoration: underline;
    }
  }

  @media (min-width: 768px) {
    .cart-mobile-list,
    .cart-mobile-summary,
    .cart-mobile-checkout,
    .cart-mobile-continue {
      display: none !important;
    }
  }
`;

// ─── Cart Page ────────────────────────────────────────────────────────────────
const Cart = ({
  location,
  deleteAllFromCart,
  strings,
  currentLanguageCode,
  cartItems,
}) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const currency = strings["CURRENCY"] || "LE";

  const cartTotalPrice = cartItems?.items?.reduce((total, item) => {
    const qty = item.pivot?.qty || item.qty || 1;
    return total + (item?.price - (item?.price * item?.discount) / 100) * qty;
  }, 0);

  return (
    <Fragment>
      <style>{cartStyles}</style>

      <MetaTags>
        <title>
          {strings["elmoda"]} | {strings["CART_Title"]}
        </title>
        <meta
          name="description"
          content="Cart page of flone react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["CART_HOME"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["CART_Title"]}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems?.items?.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">
                  {strings["CART_PAGE_TITLE"]}
                </h3>

                {/* ── DESKTOP table ── */}
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>{strings["CART_TABLE_IMAGE"]}</th>
                            <th>{strings["CART_TABLE_PRODUCT_NAME"]}</th>
                            <th>{strings["CART_TABLE_UNIT_PRICE"]}</th>
                            <th>{strings["CART_TABLE_QTY"]}</th>
                            <th>{strings["CART_TABLE_SUBTOTAL"]}</th>
                            <th>{strings["CART_TABLE_ACTION"]}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems?.items?.map((cartItem) => (
                            <DesktopRow
                              cartItem={cartItem}
                              key={cartItem.id}
                              currentLanguageCode={currentLanguageCode}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* ── MOBILE card list ── */}
                <div className="cart-mobile-list">
                  {cartItems?.items?.map((cartItem) => (
                    <MobileCard
                      cartItem={cartItem}
                      key={cartItem.id}
                      currentLanguageCode={currentLanguageCode}
                      currency={currency}
                    />
                  ))}

                  <div className="cart-mobile-summary">
                    <div className="cart-mobile-summary__row" dir={currentLanguageCode === "ar" ? "rtl" : "ltr"}>
                      <div>
                        <div className="cart-mobile-summary__title" style={{ textAlign: currentLanguageCode === "ar" ? "right" : "left" }}>
                          {strings["CART_GRAND_TOTAL"] || "المجموع الفرعي"}
                        </div>
                        <div className="cart-mobile-summary__note">
                          {strings["CART_TAX_NOTE"] ||
                            "شاملة الضريبة. يتم حساب الشحن عند الدفع."}
                        </div>
                      </div>
                      <div className="cart-mobile-summary__amount">
                        {cartTotalPrice.toFixed(2)}{" "}
                        {currentLanguageCode === "ar" ? "ج.م" : "L.E"}
                      </div>
                    </div>
                    <Link
                      to={process.env.PUBLIC_URL + "/checkout"}
                      className="cart-mobile-checkout">
                      {strings["CART_PROCEED_TO_CHECKOUT"] || "إتمام الشراء"}
                    </Link>
                    <Link
                      to={process.env.PUBLIC_URL + "/shop"}
                      className="cart-mobile-continue">
                      {strings["CART_CONTINUE_SHOPPING"] || "متابعة التسوق"}
                    </Link>
                  </div>
                </div>

                {/* ── DESKTOP grand total ── */}
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to={process.env.PUBLIC_URL + "/shop"}>
                          {strings["CART_CONTINUE_SHOPPING"]}
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => deleteAllFromCart(addToast)}>
                          {strings["CART_CLEAR_CART"]}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          {strings["CART_GRAND_TOTAL"]}
                        </h4>
                      </div>
                      <h4 className="grand-totall-title">
                        {strings["CART_GRAND_TOTAL"]}{" "}
                        <span>{cartTotalPrice.toFixed(2)}</span>
                      </h4>
                      <Link to={process.env.PUBLIC_URL + "/checkout"}>
                        {strings["CART_PROCEED_TO_CHECKOUT"]}
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {strings["CART_EMPTY_TITLE"]} <br />
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        {strings["CART_EMPTY_BUTTON"]}
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

// ─── Redux ────────────────────────────────────────────────────────────────────
const mapStateToProps = (state) => ({
  cartItems: state.cartData,
  currency: state.currencyData,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (item, addToast, qty) => dispatch(addToCart(item, addToast, qty)),
  updateQuantity: (item, addToast, qty) =>
    dispatch(updateQuantity(item, addToast, qty)),
  deleteFromCart: (item, addToast) => dispatch(deleteFromCart(item, addToast)),
  deleteAllFromCart: (addToast) => dispatch(deleteAllFromCart(addToast)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(multilanguage(Cart));

// ─────────────────────────────────────────────────────────────────────────────
// ✅ useQty — hook مشترك
// qty بتيجي من Redux (cartItem.pivot?.qty || cartItem.qty)
// مش من useState محلي — ده بيضمن إن Desktop وMobile دايماً
// شايفين نفس الرقم لأنهم بيقروا من نفس المصدر (Redux store)
// ─────────────────────────────────────────────────────────────────────────────
const useQty = (cartItem) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  // ✅ القيمة بتيجي من الـ Redux store مش من state محلي
  // لما الـ reducer يحدّث cartItem.pivot.qty أو cartItem.qty
  // الكومبوننت بيـre-render تلقائياً بالقيمة الجديدة في الاتنين
  const qty = cartItem.pivot?.qty ?? cartItem?.qty ?? 1;

  const finalPrice =
    cartItem?.price - (cartItem?.price * cartItem?.discount) / 100;

  const itemTotalPrice = finalPrice * qty;

  const handleIncrease = () => {
    if (!cartItem.is_available) return;
    const newQty = qty + 1;
    dispatch(updateQuantity(cartItem, addToast, newQty));
  };

  const handleDecrease = () => {
    if (qty <= 1) return;
    const newQty = qty - 1;
    dispatch(updateQuantity(cartItem, addToast, newQty));
  };

  const handleDelete = () => dispatch(deleteFromCart(cartItem, addToast));

  return {
    qty,
    finalPrice,
    itemTotalPrice,
    handleIncrease,
    handleDecrease,
    handleDelete,
  };
};

// ─── Desktop Row ──────────────────────────────────────────────────────────────
const DesktopRow = ({ cartItem, currentLanguageCode }) => {
  const { qty, itemTotalPrice, handleIncrease, handleDecrease, handleDelete } =
    useQty(cartItem);

  const productName =
    currentLanguageCode === "ar"
      ? cartItem.translations[0]?.name
      : cartItem.translations[1]?.name;

  return (
    <tr>
      <td className="product-thumbnail">
        <Link to={process.env.PUBLIC_URL + "/product/" + cartItem.slug}>
          <img
            className="img-fluid"
            src={cartItem.image_path}
            alt={cartItem.name}
            width={110}
            height={140}
          />
        </Link>
      </td>

      <td className="product-name">
        <Link to={process.env.PUBLIC_URL + "/product/" + cartItem.slug}>
          {productName}
        </Link>
      </td>

      <td className="product-price-cart">
        {cartItem.price ? (
          <div className="product-img-badges">
            <span className="pink" style={{ color: "#FFF" }}>
              {cartItem.price}
            </span>
          </div>
        ) : (
          ""
        )}
      </td>

      <td className="product-quantity">
        <div className="cart-plus-minus">
          <button
            className="dec qtybutton"
            onClick={handleDecrease}
            disabled={qty <= 1}>
            -
          </button>
          <input
            type="text"
            className="cart-plus-minus-box"
            value={qty}
            readOnly
          />
          <button
            className="inc qtybutton"
            onClick={handleIncrease}
            disabled={!cartItem.is_available}>
            +
          </button>
        </div>
      </td>

      <td className="product-subtotal">
        {itemTotalPrice.toFixed(2)}
        <br />
        <span className="purple">-{cartItem.discount}%</span>
      </td>

      <td className="product-remove">
        <button onClick={handleDelete}>
          <i className="fa fa-times"></i>
        </button>
      </td>
    </tr>
  );
};

// ─── Mobile Card ──────────────────────────────────────────────────────────────
const MobileCard = ({ cartItem, currentLanguageCode, currency }) => {
  const { qty, itemTotalPrice, handleIncrease, handleDecrease, handleDelete } =
    useQty(cartItem);

  const isAr = currentLanguageCode === "ar";

  const productName = isAr
    ? cartItem.translations[0]?.name
    : cartItem.translations[1]?.name;

  const imageEl = (
    <div className="cart-mobile-card__image">
      <Link to={process.env.PUBLIC_URL + "/product/" + cartItem.slug}>
        <img src={cartItem.image_path} alt={cartItem.name} />
      </Link>
    </div>
  );

  const priceEl = (
    <div className="cart-mobile-card__left">
      <span className="cart-mobile-card__price">
        {itemTotalPrice.toFixed(2)} {isAr ? "ج.م" : "L.E"}
      </span>
    </div>
  );

  return (
    <div className="cart-mobile-card" dir={isAr ? "rtl" : "ltr"}>
      {/* عربي:    [السعر] [المحتوى] [الصورة]  ← يمين لشمال */}
      {/* إنجليزي: [الصورة] [المحتوى] [السعر]  ← شمال ليمين */}
      {isAr ? priceEl : imageEl}

      <div className="cart-mobile-card__center">
        <Link
          className="cart-mobile-card__name"
          to={process.env.PUBLIC_URL + "/product/" + cartItem.slug}>
          {productName}
        </Link>

        <div className="cart-mobile-card__meta">
          {cartItem.bottle_size && (
            <span>Bottle Size: {cartItem.bottle_size}</span>
          )}
          {cartItem.addition && <span>Addition: {cartItem.addition}</span>}
          {cartItem.type && (
            <span>
              {isAr ? "نوع" : "Type"}:{" "}
              {isAr
                ? cartItem.category.translations[0].name
                : cartItem.category.translations[1].name}
            </span>
          )}
          {cartItem.discount > 0 && (
            <span style={{ color: "#c0335a", fontWeight: 600 }}>
              -{cartItem.discount}%
            </span>
          )}
        </div>

        <div className="cart-mobile-card__qty">
          <button
            className="cart-mobile-card__qty-btn"
            onClick={handleIncrease}
            disabled={!cartItem.is_available}>
            +
          </button>
          <span className="cart-mobile-card__qty-value">{qty}</span>
          <button
            className="cart-mobile-card__qty-btn"
            onClick={handleDecrease}
            disabled={qty <= 1}>
            −
          </button>
        </div>

        <div className="cart-mobile-card__actions">
          <button
            className="cart-mobile-card__action-btn remove"
            onClick={handleDelete}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      </div>

      {isAr ? imageEl : priceEl}
    </div>
  );
};
