import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import axiosInstance from "../../api/api";
import LayoutOne from "../../layouts/LayoutOne";
import { multilanguage } from "redux-multilanguage";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ReviewSection from "../../components/addReview/AddReview.jsx";
import Icons from "../../components/icons/Icons.jsx";
import ProductReviews from "../../components/product/ProductReviews.js";

const ProductFixedImage = ({ location, currentLanguageCode, strings }) => {
  const [product, setProduct] = useState(null);
  const [RelatedProduct, setRelatedProduct] = useState([]);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { pathname } = location;
  const PRODUCT_ID = pathname.split("/")[2];

  // دالة جلب المنتج (تُستخدم عند التحميل الأول وعند إضافة تقييم جديد)
  const fetchProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/item/${PRODUCT_ID}`);

      const fetchedProduct = response.data.item;
      let related = response.data.related || [];
      setIcons(response.data.icons || []);
      setProduct(fetchedProduct);
      console.log(fetchedProduct)

      // ✅ لو المنتجات المشابهة أقل من 4، كمّل من المنتجات العامة
      if (related.length < 4) {
        try {
          const existingIds = new Set([
            parseInt(PRODUCT_ID),
            ...related.map((r) => r.id),
          ]);

          const fillResponse = await axiosInstance.get("/items");
          const allProducts =
            fillResponse.data?.data || fillResponse.data || [];

          const extras = allProducts
            .filter((p) => !existingIds.has(p.id))
            .slice(0, 4 - related.length);

          related = [...related, ...extras];
        } catch (fillError) {
          // لو الـ endpoint مش متاح، اكتفي بالـ related الموجود
          console.warn(
            "Could not fetch extra products to fill related:",
            fillError,
          );
        }
      }

      setRelatedProduct(related);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // جلب المنتج عند تحميل الصفحة
  useEffect(() => {
    if (PRODUCT_ID) {
      fetchProductData();
    }
  }, [PRODUCT_ID]);

  // دالة تُستدعى بعد إضافة تقييم بنجاح
  const handleReviewSuccess = () => {
    fetchProductData();
  };

  function ProductDescriptionInEnglish(product) {
    const name =
      product?.translations[1]?.name || product?.name || "Premium Product";
    const category =
      product?.category?.translations[1]?.name || product?.category?.name || "";
    const origin =
      product?.translations[1]?.country_origin || product?.country_origin;
    const weight = product?.translations[1]?.weight || product?.weight;
    const price = product?.price;
    const discount = product?.discount;

    const isTool =
      category?.toLowerCase().includes("tool") ||
      category?.toLowerCase().includes("equipment") ||
      category?.toLowerCase().includes("accessories") ||
      category?.toLowerCase().includes("gear");

    let description = "";
    if (isTool) {
      description = `${name} is a professional-grade coffee tool designed to elevate your brewing experience.`;
      if (origin) description += ` Crafted with precision in ${origin}.`;
      if (weight) description += ` Weight: ${weight}.`;
      description += ` Perfect for coffee enthusiasts who demand accuracy and consistency.`;
    } else {
      description = `${name} is a carefully selected coffee that delivers an exceptional cup every time.`;
      if (origin) description += ` Sourced and processed in ${origin}.`;
      if (weight) description += ` Available in ${weight}.`;
      description += ` Known for its rich flavor, deep aroma, and smooth finish.`;
    }

    if (price) {
      const finalPrice =
        discount > 0 ? (price - (price * discount) / 100).toFixed(0) : price;
      description += ` Now available for ${finalPrice} EGP.`;
    }
    if (discount && discount > 0) {
      description += ` Don't miss a ${discount}% discount for a limited time!`;
    }
    return description;
  }

  function ProductDescriptionInArabic(product) {
    const name =
      product?.translations[0]?.name || product?.name || "منتج عالي الجودة";
    const category =
      product?.category?.translations[0]?.name || product?.category?.name || "";
    const origin = product?.translations[0]?.country_origin || "مصر";
    const weight = product?.translations[0]?.weight || product?.weight;
    const price = product?.price;
    const discount = product?.discount;

    const isTool =
      category?.toLowerCase().includes("أداة") ||
      category?.toLowerCase().includes("tool") ||
      category?.toLowerCase().includes("معدات");

    let description = "";
    if (isTool) {
      description = `${name} من أفضل أدوات تحضير القهوة المصممة لتجربة احترافية.`;
      if (origin) description += ` مصنوعة بدقة عالية في ${origin}.`;
      if (weight) description += ` الوزن: ${weight}.`;
      description += ` مثالية لعشاق القهوة الذين يبحثون عن الدقة والاحترافية.`;
    } else {
      description = `${name} قهوة مختارة بعناية لتمنحك تجربة استثنائية في كل كوب.`;
      if (origin)
        description += ` تُزرع وتُعالج في ${origin} وفق أعلى معايير الجودة.`;
      if (weight)
        description += ` متوفرة بحجم ${weight}، مناسبة للاستخدام اليومي.`;
      description += ` تتميز بنكهة غنية ورائحة أصيلة.`;
    }

    if (price) {
      const finalPrice =
        discount > 0 ? (price - (price * discount) / 100).toFixed(0) : price;
      description += ` متوفر الآن بسعر ${finalPrice} جنيه مصري.`;
    }
    if (discount && discount > 0) {
      description += ` لا تفوت خصم ${discount}% لفترة محدودة!`;
    }
    return description;
  }

  if (loading) {
    return (
      <div className="flone-preloader-wrapper">
        <div className="flone-preloader">
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-5">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center py-5">No product found.</div>;
  }

  return (
    <Fragment>
      <MetaTags>
        <title>
          {currentLanguageCode === "ar"
            ? product?.translations[0]?.name
            : product?.translations[1]?.name || ""}
        </title>
        <meta
          name="description"
          content={
            currentLanguageCode === "ar"
              ? product?.translations[0]?.description
              : product?.translations[1]?.description || ""
          }
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["shopProduct"]}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />

        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
          icons={icons}
          galleryType="fixedImage"
          related={RelatedProduct}
        />

        <ReviewSection item_id={product.id} />

        <ProductDescriptionTab
          spaceBottomClass="pb-50"
          productFullDesc={
            currentLanguageCode === "ar"
              ? product?.translations[0]?.description || ProductDescriptionInArabic(product)
              : product?.translations[1]?.description || ProductDescriptionInEnglish(product)
          }
        />

        <RelatedProductSlider
          spaceTopClass="pt-100"
          spaceBottomClass="pb-50"
          category={RelatedProduct}
        />

        {/* Product Reviews */}
        <ProductReviews
          product={product}
          currentLanguageCode={currentLanguageCode}
          strings={strings}
          onReviewSuccess={handleReviewSuccess}
        />

        <Icons />
      </LayoutOne>
    </Fragment>
  );
};

ProductFixedImage.propTypes = {
  location: PropTypes.object,
};

export default connect()(multilanguage(ProductFixedImage));
