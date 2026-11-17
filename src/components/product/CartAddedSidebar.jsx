import React, { useState } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import PropTypes from "prop-types";
import { addToCart, updateQuantity } from "../../redux/actions/cartActions";
import { useToasts } from "react-toast-notifications";
import axiosInstance from "../../api/api";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Ù…ÙƒÙˆÙ‘Ù† Ù…Ø³ØªÙ‚Ù„ Ù„ÙƒÙ„ Ù…Ù†ØªØ¬ Ù…Ù‚ØªØ±Ø­
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const RelatedProductRow = ({
  item,
  itemName,
  parsedVariations,
  hasVariations,
  strings,
  currentLanguageCode,
  loadingItemId,
  handleAddRelatedToCart,
  handleClose,
}) => {
  const [selectedVar, setSelectedVar] = useState(
    parsedVariations.length > 0 ? parsedVariations[0] : null,
  );

  const basePrice = selectedVar
    ? parseFloat(selectedVar.price)
    : parseFloat(item.price || 0);

  const finalPrice =
    item.discount > 0
      ? basePrice - (basePrice * item.discount) / 100
      : basePrice;

  const productForCart = {
    ...item,
    price: basePrice,
    weight: selectedVar?.weight || null,
    size: selectedVar?.weight || null,
    selectedProductSize: selectedVar?.weight || null,
    selectedVariation: selectedVar,
    cartItemId: selectedVar ? `${item.id}-${selectedVar.weight}` : item.id,
  };

  const loadingKey = selectedVar ? `${item.id}-${selectedVar.weight}` : item.id;
  const isLoading = loadingItemId === loadingKey;

  const formatWeight = (w) => {
    if (!w) return "";
    if (currentLanguageCode === "ar") return w;
    return w
      .toString()
      .replace(/ÙƒØ¬Ù…/g, "kg")
      .replace(/ÙƒÙŠÙ„Ùˆ/g, "kg")
      .replace(/Ø¬Ù…/g, "gm")
      .replace(/Ø¬Ø±Ø§Ù…/g, "gm");
  };

  return (
    <div
      className="mb-3 pb-3 border-bottom"
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        <Link
          to={`/product/${item.slug}`}
          onClick={handleClose}
          style={{ flexShrink: 0 }}>
          <img
            loading="lazy"
            decoding="async"
            src={item.image_path}
            alt={itemName}
            style={{
              width: "65px",
              height: "65px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
           onError={(e) => { if (window.handleImageError) window.handleImageError(e); else { e.target.onerror = null; e.target.src = "/deal.png"; } }} onLoad={(e) => { if (window.handleImageSuccess) window.handleImageSuccess(e); }} />
        </Link>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Link
            to={`/product/${item.slug}`}
            onClick={handleClose}
            style={{
              fontSize: "13px",
              display: "block",
              marginBottom: "3px",
              color: "#333",
              fontWeight: "600",
              lineHeight: "1.3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {itemName}
          </Link>
          <div className="d-flex align-items-center" style={{ gap: "6px" }}>
            <span
              style={{
                fontWeight: "bold",
                color: "#731b26",
                fontSize: "13px",
              }}>
              {finalPrice.toFixed(2)} {strings["EG"] || "Ø¬.Ù…"}
            </span>
            {item.discount > 0 && (
              <span
                className="text-muted"
                style={{ textDecoration: "line-through", fontSize: "11px" }}>
                {basePrice.toFixed(2)} {strings["EG"] || "Ø¬.Ù…"}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() =>
            handleAddRelatedToCart(item, productForCart, selectedVar)
          }
          disabled={isLoading}
          title={strings["add_to_cart"] || "Ø£Ø¶Ù Ù„Ù„Ø³Ù„Ø©"}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "2px solid #731b26",
            background: isLoading ? "#731b26" : "#fff",
            color: isLoading ? "#fff" : "#731b26",
            fontSize: isLoading ? "11px" : "20px",
            lineHeight: "1",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "#731b26";
              e.currentTarget.style.color = "#fff";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#731b26";
            }
          }}>
          {isLoading ? "..." : "+"}
        </button>
      </div>

      {hasVariations && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            paddingInlineStart: "75px",
          }}>
          {parsedVariations.map((varItem, idx) => {
            const isSelected = selectedVar?.weight === varItem.weight;
            return (
              <button
                key={idx}
                onClick={() => setSelectedVar(varItem)}
                style={{
                  padding: "3px 12px",
                  borderRadius: "20px",
                  border: isSelected ? "2px solid #731b26" : "1px solid #ddd",
                  backgroundColor: isSelected ? "#731b26" : "#fff",
                  color: isSelected ? "#fff" : "#666",
                  fontSize: "11px",
                  fontWeight: isSelected ? "bold" : "normal",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                  direction: "ltr",
                  whiteSpace: "nowrap",
                }}>
                {formatWeight(varItem.weight)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Ù…ÙƒÙˆÙ‘Ù† Ø¹Ø±Ø¶ Ù…Ù†ØªØ¬ Ø¯Ø§Ø®Ù„ Ø§Ù„Ø³Ù„Ø© (Ù„Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù…Ø¶Ø§ÙØ©)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CartItemRow = ({ item, currentLanguageCode, strings, onQtyChange }) => {
  const itemName =
    currentLanguageCode === "ar"
      ? item.translations?.[0]?.name || item.name
      : item.translations?.[1]?.name || item.name;

  const basePrice = item.selectedVariation
    ? parseFloat(item.selectedVariation.price)
    : parseFloat(item.price || 0);

  const discountedPrice =
    item.discount > 0
      ? basePrice - (basePrice * item.discount) / 100
      : basePrice;

  // Ø¬Ø±Ø¨ ÙƒÙ„ Ø§Ù„Ø£Ø³Ù…Ø§Ø¡ Ø§Ù„Ù…Ù…ÙƒÙ†Ø© Ù„Ù„ÙƒÙ…ÙŠØ© ÙÙŠ Ø§Ù„Ù€ Redux state
  const qty = item.quantity ?? item.qty ?? item.count ?? item.amount ?? 1;

  return (
    <div
      className="d-flex align-items-center py-2 border-bottom"
      style={{ gap: "10px" }}>
      {/* ØµÙˆØ±Ø© */}
      <img
        loading="lazy"
        decoding="async"
        src={item.image_path}
        alt={itemName}
        style={{
          width: "55px",
          height: "55px",
          objectFit: "cover",
          borderRadius: "8px",
          flexShrink: 0,
        }}
       onError={(e) => { if (window.handleImageError) window.handleImageError(e); else { e.target.onerror = null; e.target.src = "/deal.png"; } }} onLoad={(e) => { if (window.handleImageSuccess) window.handleImageSuccess(e); }} />

      {/* Ø§Ø³Ù… + ÙˆØ²Ù† */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
          {itemName}
        </p>
        {item.selectedVariation?.weight && (
          <p style={{ fontSize: "11px", color: "#888", marginBottom: "2px" }}>
            {currentLanguageCode === "ar" ? "Ø§Ù„ÙˆØ²Ù†:" : "Weight:"}{" "}
            <strong>{item.selectedVariation.weight}</strong>
          </p>
        )}

        {/* Ø§Ù„Ø³Ø¹Ø± */}
        <div className="d-flex align-items-center" style={{ gap: "5px" }}>
          <span
            style={{ fontSize: "13px", fontWeight: "bold", color: "#731b26" }}>
            {(discountedPrice * qty).toFixed(2)} {strings["EG"] || "Ø¬.Ù…"}
          </span>
          {item.discount > 0 && (
            <span
              style={{
                fontSize: "11px",
                color: "#aaa",
                textDecoration: "line-through",
              }}>
              {(basePrice * qty).toFixed(2)} {strings["EG"] || "Ø¬.Ù…"}
            </span>
          )}
        </div>
      </div>

      {/* ÙƒÙ†ØªØ±ÙˆÙ„ Ø§Ù„ÙƒÙ…ÙŠØ© */}
      <div
        className="d-flex align-items-center"
        style={{
          border: "1px solid #ddd",
          borderRadius: "20px",
          background: "#fff",
          flexShrink: 0,
        }}>
        <button
          onClick={() => onQtyChange(item, qty - 1)}
          disabled={qty <= 1}
          style={{
            width: "26px",
            height: "26px",
            border: "none",
            background: "transparent",
            cursor: qty <= 1 ? "not-allowed" : "pointer",
            fontSize: "15px",
            color: qty <= 1 ? "#ccc" : "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}>
          âˆ’
        </button>
        <span
          style={{
            minWidth: "24px",
            textAlign: "center",
            fontSize: "13px",
            fontWeight: "bold",
          }}>
          {qty}
        </span>
        <button
          onClick={() => onQtyChange(item, qty + 1)}
          style={{
            width: "26px",
            height: "26px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "15px",
            color: "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}>
          +
        </button>
      </div>
    </div>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Ø§Ù„Ù€ Sidebar Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CartAddedSidebar = ({ strings, currentLanguageCode, addToCart }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const { show, addedProduct, relatedProducts } = useSelector(
    (state) =>
      state.cartAddedSidebar || {
        show: false,
        addedProduct: null,
        relatedProducts: [],
      },
  );

  // âœ… Ø¬Ù„Ø¨ ÙƒÙ„ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø³Ù„Ø© Ù…Ù† Redux â€” Ø¨Ù†Ø¬Ø±Ø¨ Ø£ÙƒØªØ± Ù…Ù† Ù…Ø³Ø§Ø± Ù…Ù…ÙƒÙ†
  const cartItems = useSelector((state) => {
    const raw =
      state.cartData ??
      state.cart?.cartItems ??
      state.cart?.items ??
      state.cart ??
      [];
    // Ù„Ùˆ Array Ø±Ø¬Ø¹Ù‡ Ù…Ø¨Ø§Ø´Ø±Ø©ØŒ Ù„Ùˆ object Ø¬Ø±Ø¨ Ù†Ø£Ø®Ø° Ø£ÙˆÙ„ Ù‚ÙŠÙ…Ø© array Ø¬ÙˆÙ‘Ø§Ù‡
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object") {
      const found = Object.values(raw).find((v) => Array.isArray(v));
      return found || [];
    }
    return [];
  });

  const [loadingItemId, setLoadingItemId] = useState(null);

  const handleClose = () => dispatch({ type: "HIDE_CART_ADDED_SIDEBAR" });

  // âœ… Ø­Ø³Ø§Ø¨ Ø§Ù„ØªÙˆØªØ§Ù„ Ø§Ù„ÙƒÙ„ÙŠ Ù„ÙƒÙ„ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø³Ù„Ø©
  const cartTotal = cartItems.reduce((sum, item) => {
    const basePrice = item.selectedVariation
      ? parseFloat(item.selectedVariation.price)
      : parseFloat(item.price || 0);
    const discountedPrice =
      item.discount > 0
        ? basePrice - (basePrice * item.discount) / 100
        : basePrice;
    return sum + discountedPrice * (item.quantity || 1);
  }, 0);

  // âœ… ØªØºÙŠÙŠØ± ÙƒÙ…ÙŠØ© Ù…Ù†ØªØ¬ Ù…ÙˆØ¬ÙˆØ¯ ÙÙŠ Ø§Ù„Ø³Ù„Ø©
  const handleQtyChange = (item, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity(item, addToast, newQty));
  };

  // âœ… Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬ Ù…Ù‚ØªØ±Ø­ Ù„Ù„Ø³Ù„Ø©
  const handleAddRelatedToCart = async (item, productForCart, selectedVar) => {
    const loadingKey = selectedVar
      ? `${item.id}-${selectedVar.weight}`
      : item.id;
    setLoadingItemId(loadingKey);
    try {
      const res = await axiosInstance.get(`/item/${item.slug}`);
      const fetchedRelated = res.data.related || [];
      addToCart(productForCart, fetchedRelated, addToast, 1);
    } catch (error) {
      console.error("Failed to fetch related for item:", item.id, error);
      addToCart(productForCart, [], addToast, 1);
    } finally {
      setLoadingItemId(null);
    }
  };

  if (!show || !addedProduct) return null;

  // Ø¥Ø®ÙØ§Ø¡ Ù†ÙØ³ Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ø£Ø®ÙŠØ± Ù…Ù† Ø§Ù„Ù…Ù‚ØªØ±Ø­Ø§Øª
  const filteredRelated = (relatedProducts || []).filter(
    (item) => item.id !== addedProduct.id,
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          zIndex: 9999999999999,
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          maxWidth: "100%",
          height: "100%",
          background: "#fff",
          zIndex: 99999999999,
          overflowY: "auto",
          padding: "20px",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
        }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0" style={{ color: "#2d7a2d" }}>
            âœ“ {strings["added_to_cart"] || "ØªÙ…Øª Ø§Ù„Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ø³Ù„Ø©"}
          </h5>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
            }}>
            Ã—
          </button>
        </div>

        {/* âœ… Ù‚Ø³Ù…: ÙƒÙ„ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø³Ù„Ø© */}
        <div
          className="p-3 border rounded mb-3"
          style={{ background: "#fafafa" }}>
          <h6
            className="mb-3"
            style={{
              fontSize: "12px",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
            {strings["cart_items"] || "Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø³Ù„Ø©"}{" "}
            <span
              style={{
                background: "#731b26",
                color: "#fff",
                borderRadius: "50%",
                padding: "1px 6px",
                fontSize: "11px",
                fontWeight: "bold",
              }}>
              {cartItems.length}
            </span>
          </h6>

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItemRow
                key={item.cartItemId || item.id}
                item={item}
                currentLanguageCode={currentLanguageCode}
                strings={strings}
                onQtyChange={handleQtyChange}
              />
            ))
          ) : (
            <p className="text-muted small text-center py-2">
              {strings["empty_cart"] || "Ø§Ù„Ø³Ù„Ø© ÙØ§Ø±ØºØ©"}
            </p>
          )}
        </div>

        {/* âœ… Ø§Ù„ØªÙˆØªØ§Ù„ Ø§Ù„ÙƒÙ„ÙŠ Ù„ÙƒÙ„ Ø§Ù„Ø³Ù„Ø© */}
        <div
          className="d-flex justify-content-between align-items-center px-3 py-2 mb-3 rounded"
          style={{ background: "#f0f0f0" }}>
          <span className="fw-bold" style={{ fontSize: "14px" }}>
            {strings["cart_total"] || "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø³Ù„Ø©"}:
          </span>
          <span
            className="fw-bold"
            style={{ color: "#731b26", fontSize: "16px" }}>
            {cartTotal.toFixed(2)} {strings["EG"] || "Ø¬.Ù…"}
          </span>
        </div>

        <hr style={{ margin: "0 0 12px" }} />

        {/* Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù…Ù‚ØªØ±Ø­Ø© */}
        <h6
          className="mb-3"
          style={{
            fontSize: "12px",
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
          {strings["complementary_products"] || "Ù…Ù†ØªØ¬Ø§Øª Ù…ÙƒÙ…Ù„Ø© ÙŠÙÙ†ØµØ­ Ø¨Ù‡Ø§:"}
        </h6>

        {filteredRelated.length > 0 ? (
          filteredRelated.map((item) => {
            let parsedVariations = [];
            try {
              if (item?.variations) {
                parsedVariations =
                  typeof item.variations === "string"
                    ? JSON.parse(item.variations)
                    : item.variations;
              }
            } catch (e) {}

            const itemName =
              currentLanguageCode === "ar"
                ? item.translations?.[0]?.name || item.name
                : item.translations?.[1]?.name || item.name;

            return (
              <RelatedProductRow
                key={item.id}
                item={item}
                itemName={itemName}
                parsedVariations={parsedVariations}
                hasVariations={parsedVariations.length > 0}
                strings={strings}
                currentLanguageCode={currentLanguageCode}
                loadingItemId={loadingItemId}
                handleAddRelatedToCart={handleAddRelatedToCart}
                handleClose={handleClose}
              />
            );
          })
        ) : (
          <p className="text-muted small">
            {strings["no_related_products"] || "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù†ØªØ¬Ø§Øª Ù…Ù‚ØªØ±Ø­Ø©"}
          </p>
        )}

        {/* Ø£Ø²Ø±Ø§Ø± Ø§Ù„Ù€ CTA */}
        <div
          className="mt-auto pt-3 border-top"
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            to="/cart"
            className="btn btn-lg"
            onClick={handleClose}
            style={{
              background: "#731b26",
              color: "#fff",
              borderRadius: "6px",
              fontWeight: "bold",
              textAlign: "center",
            }}>
            {strings["view_cart"] || "Ø¹Ø±Ø¶ Ø§Ù„Ø³Ù„Ø©"}
          </Link>
          <button
            className="btn btn-outline-secondary btn-lg"
            onClick={handleClose}
            style={{ borderRadius: "6px" }}>
            {strings["continue_shopping"] || "Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ØªØ³ÙˆÙ‚"}
          </button>
        </div>
      </div>
    </>
  );
};

CartAddedSidebar.propTypes = {
  strings: PropTypes.object,
  currentLanguageCode: PropTypes.string,
  addToCart: PropTypes.func,
};

const mapStateToProps = (state) => ({
  currentLanguageCode: state.multilanguage.currentLanguageCode,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (item, related, addToast, qty) => {
    dispatch(addToCart(item, related, addToast, qty));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(multilanguage(CartAddedSidebar));
