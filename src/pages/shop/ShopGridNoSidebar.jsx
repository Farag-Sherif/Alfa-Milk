import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Paginator from "react-hooks-paginator";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import Loading from "../../components/Loading";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopProducts from "../../wrappers/product/ShopProducts";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import { useLocation } from "react-router-dom";
import Icons from "../../components/icons/Icons.jsx";

const ShopGridNoSidebar = ({ strings }) => {
  const [layout, setLayout] = useState("grid three-column");
  const [filterSortValue, setFilterSortValue] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [allData, setAllData] = useState([]);
  const pageLimit = 20;
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { pathname } = location;

  const getLayout = (layout) => setLayout(layout);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(location.search);
        const category = params.get("category"); // slug e.g. "turkish-coffee"

        let data = [];

        if (category) {
          // ✅ response.data.data.items
          const response = await axiosInstance.get(`/cafes/find/${category}`);
          data = response.data?.data?.items || [];
        } else {
          const response = await axiosInstance.get("/items");
          data = Array.isArray(response.data)
            ? response.data
            : response.data?.data || [];
        }

        setAllData(data);
        setCurrentPage(1);
        setOffset(0);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("حدث خطأ أثناء تحميل المنتجات، حاول مرة أخرى.");
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [location.search]);

  useEffect(() => {
    let sortedProducts = Array.isArray(allData) ? [...allData] : [];

    if (filterSortValue === "high-to-low") {
      sortedProducts.sort(
        (a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0),
      );
    } else if (filterSortValue === "low-to-high") {
      sortedProducts.sort(
        (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0),
      );
    }

    setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
  }, [allData, filterSortValue, offset]);

  if (loading) return <Loading />;

  return (
    <Fragment>
      <MetaTags>
        <title>{strings["shop"]}</title>
        <meta
          name="description"
          content="Shop page of flone react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["shop"]}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />

        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ShopTopbar
                  getLayout={getLayout}
                  getFilterSortParams={setFilterSortValue}
                  productCount={allData.length}
                  sortedProductCount={currentData.length}
                />

                {error ? (
                  <p style={{ color: "red" }}>{error}</p>
                ) : (
                  <ShopProducts layout={layout} products={currentData} />
                )}

                <div className="pro-pagination-style text-center mt-30">
                  <Paginator
                    totalRecords={allData.length}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    setOffset={setOffset}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Icons />
      </LayoutOne>
    </Fragment>
  );
};

ShopGridNoSidebar.propTypes = {
  location: PropTypes.object,
  products: PropTypes.array,
};

export default connect()(multilanguage(ShopGridNoSidebar));
