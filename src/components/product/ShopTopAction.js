import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { setActiveLayout } from "../../helpers/product";

const ShopTopAction = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("default");
  const dropdownRef = useRef(null);

  // قراءة اللغة بأمان من الذاكرة المحلية
  let isArabic = false;
  try {
    const reduxState = JSON.parse(localStorage.getItem("redux_localstorage_simple"));
    if (reduxState && reduxState.multilanguage && reduxState.multilanguage.currentLanguageCode === 'ar') {
      isArabic = true;
    }
  } catch (error) {}

  // نصوص الترجمة
  const textDefault = isArabic ? "الترتيب الافتراضي" : "Default";
  const textHighToLow = isArabic ? "السعر: من الأعلى للأقل" : "Price - High to Low";
  const textLowToHigh = isArabic ? "السعر: من الأقل للأعلى" : "Price - Low to High";
  const textShowing = isArabic 
    ? `عرض ${sortedProductCount} من أصل ${productCount} منتج` 
    : `Showing ${sortedProductCount} of ${productCount} result`;

  const options = [
    { value: "default", label: textDefault },
    { value: "high-to-low", label: textHighToLow },
    { value: "low-to-high", label: textLowToHigh },
  ];

  // الدالة المعدلة: بتوقف أي تداخل وبتنفذ الفلتر فوراً
  const handleSelect = (e, value) => {
    e.preventDefault();
    e.stopPropagation(); // السر هنا: بيمنع التداخل مع القفل التلقائي
    setSelectedValue(value);
    getFilterSortParams(value); // إرسال أمر الترتيب للموقع
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const currentLabel = options.find(opt => opt.value === selectedValue)?.label || textDefault;

  return (
    <div className="shop-top-bar mb-35" style={{ direction: isArabic ? "rtl" : "ltr" }}>
      <div className="select-shoing-wrap" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        
        <div className="custom-shop-select" ref={dropdownRef} style={{ position: "relative", minWidth: "240px", zIndex: 99 }}>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            style={{
              padding: "10px 20px",
              border: isOpen ? "2px solid #731b26" : "1px solid #ddd",
              borderRadius: "50px",
              backgroundColor: "#fff",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
              color: "#333",
              transition: "all 0.3s ease",
              boxShadow: isOpen ? "0 4px 10px rgba(115, 27, 38, 0.1)" : "none"
            }}
          >
            <span>{currentLabel}</span>
            <i className={`fa fa-angle-${isOpen ? 'up' : 'down'}`} style={{ marginLeft: isArabic ? '0' : '10px', marginRight: isArabic ? '10px' : '0' }}></i>
          </div>

          {isOpen && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "8px",
              backgroundColor: "#fff",
              border: "1px solid #eee",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              overflow: "hidden"
            }}>
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={(e) => handleSelect(e, opt.value)}
                  style={{
                    padding: "12px 20px",
                    cursor: "pointer",
                    backgroundColor: selectedValue === opt.value ? "#731b26" : "#fff",
                    color: selectedValue === opt.value ? "#fff" : "#555",
                    fontWeight: selectedValue === opt.value ? "bold" : "normal",
                    transition: "all 0.2s ease",
                    borderBottom: "1px solid #f5f5f5"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedValue !== opt.value) e.target.style.backgroundColor = "#f9f9f9";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedValue !== opt.value) e.target.style.backgroundColor = "#fff";
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{ margin: 0, fontWeight: "500", color: "#666", fontSize: "15px" }}>
          {textShowing}
        </p>
      </div>

      <div className="shop-tab">
        <button
          onClick={(e) => {
            getLayout("grid two-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th-large" />
        </button>
        <button
          onClick={(e) => {
            getLayout("grid three-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th" />
        </button>
        <button
          onClick={(e) => {
            getLayout("list");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-list-ul" />
        </button>
      </div>
    </div>
  );
};

ShopTopAction.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  productCount: PropTypes.number,
  sortedProductCount: PropTypes.number,
};

export default ShopTopAction;