import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import SectionTitleThree from "../../components/section-title/SectionTitleThree";
import Product from "./Product";

// import ProductGridTwo from "./ProductGridTwo";
// !DEL
const TabProductFour = ({ spaceBottomClass, productTabClass, strings }) => {
  const [activeTab, setActiveTab] = useState("newArrival"); // Default active tab
  const [productsData, setProductsData] = useState({
    newArrival: [],
    bestSeller: [],
    saleItems: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch all data at once
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [newItems, bestItems, saleItems] = await Promise.all([
          axiosInstance.get("/new-items"),
          axiosInstance.get("/best-items"),
          axiosInstance.get("/sale-items"),
        ]);

        setProductsData({
          newArrival: newItems.data || [],
          bestSeller: bestItems.data || [],
          saleItems: saleItems.data || [],
        });
      } catch (err) {
        console.error("Error fetching products:", err);
        setProductsData({
          newArrival: [],
          bestSeller: [],
          saleItems: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Use the activeTab to display the corresponding data
  const products = productsData[activeTab] || [];
  return (
    <div className={`product-area ${spaceBottomClass ? spaceBottomClass : ""}`}>
      <div className="container">
        <SectionTitleThree
          titleText={strings["featuredProduct"]}
          positionClass="text-center"
        />
        <Tab.Container
          defaultActiveKey="saleItems"
          onSelect={(key) => setActiveTab(key)} // Update active tab
        >
          <Nav
            variant="pills"
            className={`product-tab-list pt-35 pb-60 text-center ${
              productTabClass ? productTabClass : ""
            }`}>
            <Nav.Item>
              <Nav.Link eventKey="bestSeller">
                <h4>{strings["bestSellers"]}</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="newArrival">
                <h4>{strings["newArrivals"]}</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="saleItems">
                <h4>{strings["saleItems"]}</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            {loading && <div className="loading-spinner"></div>}
            <Tab.Pane eventKey="newArrival">
              <div className="row">
                {products.map((product) => (
                  <Product product={product} key={product.id} />
                ))}
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="bestSeller">
              <div className="row">
                {products.map((product) => (
                  <Product product={product} key={product.id} />
                ))}
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="saleItems">
              <div className="row">
                {products.map((product) => (
                  <Product product={product} key={product.id} />
                ))}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link className="loadMore6" to={process.env.PUBLIC_URL + "/shop"}>
            {strings["viewMoreProducts"]}
          </Link>
        </div>
      </div>
    </div>
  );
};

TabProductFour.propTypes = {
  category: PropTypes.string,
  spaceBottomClass: PropTypes.string,
};

export default multilanguage(TabProductFour);
