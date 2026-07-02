import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";

const ProductImageFixed = ({ product }) => {
  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = () => setMatches(media.matches);
      media.addEventListener("change", listener);

      return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
  };
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");

  return (
    <div className="product-large-image-wrapper">
      {product?.discount || product?.new ? (
        <div
          style={{
            zIndex: 973,
          }}
          className="product-img-badges"
        >
          {product?.discount ? (
            <span className="pink" style={{ color: "#FFF" }}>
              -{product?.discount}%
            </span>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      <div className="product-fixed-image">
        <div>
          {!isMobileOrTablet ? (
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Wristwatch by Ted Baker London",
                  isFluidWidth: true,
                  src: product?.image_path,
                },
                largeImage: {
                  src: product?.image_path,
                  width: 600,
                  height: 600,
                },
                lensStyle: {
                  width: 50,
                  height: 50,
                  background: "hsla(0, 0%, 100%, .3)",
                  border: "1px solid #ccc",
                },
              }}
              style={{
                zIndex: 953,
              }}
            />
          ) : (
            // Fallback for mobile/tablet
            <img
              src={product?.image_path}
              alt="Product"
              className="w-full h-auto"
              style={{
                marginBlock: "50px",
                width: "100%",
              }}
            />
          )}
        </div>
      </div>
      
      {/* التعديل السحري: إخفاء الغلاف لو مش مرفوع في الباك إند للشاشات الكبيرة */}
      {!isMobileOrTablet && product?.cover_path && !product.cover_path.endsWith('/images/') && (
        <img
        src={product?.cover_path}
        alt="COVER"
        loading="lazy"
        style={{
          marginBlock: "50px",
          width: "100%",
        }}
        onError={(e) => {
          e.target.style.display = 'none'; // السطر ده بيخفي الصورة فوراً لو الرابط بايظ أو مفيش صورة
        }}
      />
    )}
    </div>
  );
};

ProductImageFixed.propTypes = {
  product: PropTypes.object,
};

export default ProductImageFixed;