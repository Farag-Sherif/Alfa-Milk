import React, { useState } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import PropTypes from "prop-types";
import { addToCart, updateQuantity } from "../../redux/actions/cartActions";
import { useToasts } from "react-toast-notifications";
import axiosInstance from "../../api/api";

// ─────────────────────────────────────────────
// مكوّن مستقل لكل منتج مقترح
// ─────────────────────────────────────────────
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
      .replace(/كجم/g, "kg")
      .replace(/كيلو/g, "kg")
      .replace(/جم/g, "gm")
      .replace(/جرام/g, "gm");
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
            src={item.image_path}
            alt={itemName}
            style={{
              width: "65px",
              height: "65px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
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
              {finalPrice.toFixed(2)} {strings["EG"] || "ج.م"}
            </span>
            {item.discount > 0 && (
              <span
                className="text-muted"
                style={{ textDecoration: "line-through", fontSize: "11px" }}>
                {basePrice.toFixed(2)} {strings["EG"] || "ج.م"}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() =>
            handleAddRelatedToCart(item, productForCart, selectedVar)
          }
          disabled={isLoading}
          title={strings["add_to_cart"] || "أضف للسلة"}
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

// ─────────────────────────────────────────────
// مكوّن عرض منتج داخل السلة (للمنتجات المضافة)
// ─────────────────────────────────────────────
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

  // جرب كل الأسماء الممكنة للكمية في الـ Redux state
  const qty = item.quantity ?? item.qty ?? item.count ?? item.amount ?? 1;

  return (
    <div
      className="d-flex align-items-center py-2 border-bottom"
      style={{ gap: "10px" }}>
      {/* صورة */}
      <img
        src={item.image_path}
        alt={itemName}
        style={{
          width: "55px",
          height: "55px",
          objectFit: "cover",
          borderRadius: "8px",
          flexShrink: 0,
        }}
      />

      {/* اسم + وزن */}
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
            {currentLanguageCode === "ar" ? "الوزن:" : "Weight:"}{" "}
            <strong>{item.selectedVariation.weight}</strong>
          </p>
        )}

        {/* السعر */}
        <div className="d-flex align-items-center" style={{ gap: "5px" }}>
          <span
            style={{ fontSize: "13px", fontWeight: "bold", color: "#731b26" }}>
            {(discountedPrice * qty).toFixed(2)} {strings["EG"] || "ج.م"}
          </span>
          {item.discount > 0 && (
            <span
              style={{
                fontSize: "11px",
                color: "#aaa",
                textDecoration: "line-through",
              }}>
              {(basePrice * qty).toFixed(2)} {strings["EG"] || "ج.م"}
            </span>
          )}
        </div>
      </div>

      {/* كنترول الكمية */}
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
          −
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

// ─────────────────────────────────────────────
// الـ Sidebar الرئيسي
// ─────────────────────────────────────────────
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

  // ✅ جلب كل منتجات السلة من Redux — بنجرب أكتر من مسار ممكن
  const cartItems = useSelector((state) => {
    const raw =
      state.cartData ??
      state.cart?.cartItems ??
      state.cart?.items ??
      state.cart ??
      [];
    // لو Array رجعه مباشرة، لو object جرب نأخذ أول قيمة array جوّاه
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object") {
      const found = Object.values(raw).find((v) => Array.isArray(v));
      return found || [];
    }
    return [];
  });

  const [loadingItemId, setLoadingItemId] = useState(null);

  const handleClose = () => dispatch({ type: "HIDE_CART_ADDED_SIDEBAR" });

  // ✅ حساب التوتال الكلي لكل منتجات السلة
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

  // ✅ تغيير كمية منتج موجود في السلة
  const handleQtyChange = (item, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity(item, addToast, newQty));
  };

  // ✅ إضافة منتج مقترح للسلة
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

  // إخفاء نفس المنتج الأخير من المقترحات
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
            ✓ {strings["added_to_cart"] || "تمت الإضافة إلى السلة"}
          </h5>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
            }}>
            ×
          </button>
        </div>

        {/* ✅ قسم: كل منتجات السلة */}
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
            {strings["cart_items"] || "منتجات السلة"}{" "}
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
              {strings["empty_cart"] || "السلة فارغة"}
            </p>
          )}
        </div>

        {/* ✅ التوتال الكلي لكل السلة */}
        <div
          className="d-flex justify-content-between align-items-center px-3 py-2 mb-3 rounded"
          style={{ background: "#f0f0f0" }}>
          <span className="fw-bold" style={{ fontSize: "14px" }}>
            {strings["cart_total"] || "إجمالي السلة"}:
          </span>
          <span
            className="fw-bold"
            style={{ color: "#731b26", fontSize: "16px" }}>
            {cartTotal.toFixed(2)} {strings["EG"] || "ج.م"}
          </span>
        </div>

        <hr style={{ margin: "0 0 12px" }} />

        {/* المنتجات المقترحة */}
        <h6
          className="mb-3"
          style={{
            fontSize: "12px",
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
          {strings["complementary_products"] || "منتجات مكملة يُنصح بها:"}
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
            {strings["no_related_products"] || "لا توجد منتجات مقترحة"}
          </p>
        )}

        {/* أزرار الـ CTA */}
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
            {strings["view_cart"] || "عرض السلة"}
          </Link>
          <button
            className="btn btn-outline-secondary btn-lg"
            onClick={handleClose}
            style={{ borderRadius: "6px" }}>
            {strings["continue_shopping"] || "متابعة التسوق"}
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
