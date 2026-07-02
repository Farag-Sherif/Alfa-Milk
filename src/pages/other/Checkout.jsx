import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import CheckoutModal from "../../components/product/CheckoutModal";
import LayoutOne from "../../layouts/LayoutOne";
import { deleteAllFromCart } from "../../redux/actions/cartActions";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

const Checkout = ({ location, strings, currentLanguageCode, cartItems }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    address_id: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    zip: "",
    street: "",
    notes: "",
  });
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [type, setType] = useState("cod");
  const [modalShow, setModalShow] = useState(false);
  const [cities, setCities] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState(0);
  const [freeDeliveryAt, setFreeDeliveryAt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("authToken")) {
        try {
          const response = await axiosInstance.get("/user");
          setUser(response.data.user);
          setAddresses(response.data.user.addresses);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/settings")
      .then((res) => {
        const val = res.data?.settings?.free_delivery_at ?? null;
        if (val !== null) setFreeDeliveryAt(parseFloat(val));
      })
      .catch((err) => console.error("Failed to fetch settings:", err));
  }, []);

  const cartTotalPrice =
    cartItems?.items?.reduce((total, item) => {
      const price = parseFloat(item?.price) || 0;
      const discount = parseFloat(item?.discount) || 0;
      const qty = item?.pivot?.qty || item?.qty || 1;
      const discountedPrice = price - (price * discount) / 100;
      return total + discountedPrice * qty;
    }, 0) || 0;

  const handleAddressSelect = (value) => {
    const numericValue = parseInt(value, 10);
    setSelectedAddress(numericValue);

    const selectedAddr = addresses.find((a) => a.id === numericValue);
    if (selectedAddr) {
      const selectedCity = cities.find(
        (c) => c.id === parseInt(selectedAddr.city)
      );
      if (selectedCity) {
        setDeliveryFees(selectedCity.delivery_tax);
      }
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      addToast(strings["address_required"], { appearance: "error" });
      return;
    }

    const checkoutData = {
      address_id: selectedAddress,
      type,
      notes: formData.notes,
    };

    try {
      await axiosInstance.post("/checkout", checkoutData);
      addToast(strings["order_placed"], { appearance: "success" });
      dispatch(deleteAllFromCart(addToast));
    } catch (error) {
      console.error("Checkout failed:", error);
      addToast(strings["checkout_failed"], { appearance: "error" });
    }
  };

  useEffect(() => {
    axiosInstance
      .get("/cities")
      .then((res) => {
        setCities(res.data);
      })
      .catch((error) => {
        console.error("Error fetching cities", error);
        setCities([]);
      });
  }, []);

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find(
      (city) => city.id === parseInt(selectedCityId)
    );

    setFormData((prevData) => ({
      ...prevData,
      address_id: selectedCity ? selectedCity.id : "",
      city: selectedCity ? selectedCity.id : "",
    }));

    setDeliveryFees(selectedCity ? selectedCity.delivery_tax : 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user/addresses/add", {
        f_name: formData.fName,
        l_name: formData.lName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        address_id: formData.address_id,
        city: formData.address_id,
        zip: formData.zip,
        street: formData.street,
        notes: formData.notes,
        type: "cod",
      });
      if (response.data.status === "success") {
        setAddresses([...addresses, response.data.address]);
        setSelectedAddress(response.data.address.id);
        addToast(strings["address_added_success"], { appearance: "success" });
      }
    } catch (error) {
      console.error("Failed to add new address:", error);
      addToast(strings["address_add_failed"], { appearance: "error" });
    }
  };

  let currentTax = deliveryFees;
  if (user && addresses.length > 0 && currentTax === 0) {
    const initialCity = cities?.find(
      (c) =>
        c.id ===
        parseInt(
          selectedAddress
            ? addresses.find((a) => a.id === selectedAddress)?.city
            : addresses[0]?.city
        )
    );
    currentTax = initialCity ? initialCity.delivery_tax : 0;
  }

  const isFreeShipping =
    freeDeliveryAt !== null && cartTotalPrice >= freeDeliveryAt;
  const lastTax = isFreeShipping ? 0 : currentTax;

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["Zain"]} | {strings["checkout"]}
        </title>
        <meta
          name="description"
          content="Checkout page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["checkout"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            <div className="col-lg-12">
              <div className="billing-info mb-20">
                {!user && (
                  <h2 className="text-center my-4">{strings["CASHBACK"]}</h2>
                )}
              </div>
            </div>
            {cartItems && cartItems?.items?.length >= 1 ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>{strings["billing_details"]}</h3>

                    {/* ✅ الـ Accordion والفورم بيظهروا بس لو الـ user مسجل */}
                    {user && (
                      <>
                        <Accordion defaultActiveKey="0">
                          <Card className="single-my-account mb-20">
                            <Card.Header className="panel-heading">
                              <Accordion.Toggle variant="link" eventKey="0">
                                <h3 className="panel-title">
                                  <span></span> {strings["chose_address"]}
                                </h3>
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>
                                {addresses.map((address) => (
                                  <div
                                    className="address-item"
                                    key={address.id}>
                                    <input
                                      type="radio"
                                      name="address_id"
                                      id={`address-${address.id}`}
                                      className="address-radio"
                                      value={address.id}
                                      onChange={(e) =>
                                        handleAddressSelect(e.target.value)
                                      }
                                      checked={selectedAddress === address.id}
                                    />
                                    <label
                                      htmlFor={`address-${address.id}`}
                                      className="address-label">
                                      {address.f_name} {address.l_name} -{" "}
                                      {address.street}, {address.city},{" "}
                                      {address.country}
                                    </label>
                                  </div>
                                ))}
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        </Accordion>

                        <form onSubmit={handleAddNewAddress}>
                          <div className="my-5">
                            <h3
                              className={`${currentLanguageCode === "ar"
                                  ? "text-right"
                                  : "text-left"
                                }`}>
                              {strings["add_new_address"]}
                            </h3>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>{strings["first_name"]}*</label>
                                <input
                                  type="text"
                                  name="fName"
                                  value={formData.fName}
                                  onChange={handleInputChange}
                                  placeholder={strings["first_name"]}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>{strings["last_name"]}*</label>
                                <input
                                  type="text"
                                  name="lName"
                                  value={formData.lName}
                                  onChange={handleInputChange}
                                  placeholder={strings["last_name"]}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>{strings["country"]}*</label>
                                <input
                                  type="text"
                                  name="country"
                                  value={formData.country}
                                  onChange={handleInputChange}
                                  placeholder={strings["country"]}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>{strings["street_address"]}*</label>
                                <input
                                  type="text"
                                  name="street"
                                  value={formData.street}
                                  onChange={handleInputChange}
                                  placeholder={strings["street"]}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>{strings["city"]}*</label>
                                <select
                                  name="city"
                                  value={formData.city}
                                  onChange={handleCityChange}>
                                  <option value="">
                                    {strings["select_city"]}
                                  </option>
                                  {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                      {currentLanguageCode === "ar"
                                        ? city.translations[0].name
                                        : city.translations[1].name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>
                                  {strings["postcode_zip"]}{" "}
                                  <span
                                    className="text-muted"
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "normal",
                                    }}>
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  name="zip"
                                  value={formData.zip}
                                  onChange={handleInputChange}
                                  placeholder={strings["zip_code"]}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>{strings["phone"]}*</label>
                                <input
                                  type="text"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder={strings["phone"]}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>{strings["email_address"]}*</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder={strings["email"]}
                                />
                              </div>
                            </div>
                          </div>
                          <button className="btn" type="submit">
                            Submit address
                          </button>
                        </form>
                      </>
                    )}

                    <div className="additional-info-wrap">
                      <h4>{strings["additional_information"]}</h4>
                      <div className="additional-info">
                        <label>{strings["order_notes"]}</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder={strings["notes"]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>{strings["your_order"]}</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        {user && (
                          <div
                            className="your-order-top mb-3"
                            style={{ color: "#77543A" }}>
                            <ul>
                              <li>{strings["USER_POINTS"]}</li>
                              <li>{user?.points}</li>
                            </ul>
                          </div>
                        )}
                        <div className="your-order-top">
                          <ul>
                            <li>{strings["product"]}</li>
                            <li>{strings["total"]}</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems?.items.map((cartItem, key) => {
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {currentLanguageCode === "ar"
                                      ? cartItem?.translations[0]?.name
                                      : cartItem?.translations[1]?.name}{" "}
                                    X{" "}
                                    {cartItem.pivot?.qty ||
                                      cartItem?.qty ||
                                      1}
                                  </span>{" "}
                                  <span className="order-price">
                                    {(
                                      (cartItem?.price -
                                        (cartItem?.price *
                                          cartItem?.discount) /
                                        100) *
                                      (cartItem?.pivot?.qty ||
                                        cartItem?.qty ||
                                        1)
                                    ).toFixed(2)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">
                              {strings["shipping"]}
                            </li>
                            <li>
                              {isFreeShipping ? (
                                <span
                                  style={{
                                    color: "#2d7a2d",
                                    fontWeight: "bold",
                                  }}>
                                  {strings["free_shipping"] || "شحن مجاني 🎉"}
                                </span>
                              ) : (
                                lastTax
                              )}
                            </li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">{strings["total"]}</li>
                            <li
                              style={{
                                direction:
                                  currentLanguageCode === "en" ? "ltr" : "rtl",
                              }}>
                              {(lastTax + cartTotalPrice).toFixed(2)}{" "}
                              {strings["EG"]}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method"></div>
                    </div>
                    <div className="place-order mt-25">
                      {user && (
                        <button
                          className="btn-hover mb-3"
                          onClick={() => {
                            setType("points");
                            handleCheckout();
                          }}
                          disabled={
                            Number(user?.points) <= Number(cartTotalPrice)
                          }
                          style={{
                            display:
                              Number(user?.points) <= Number(cartTotalPrice)
                                ? "none"
                                : "block",
                          }}
                          id="points-button">
                          {strings["place_order_with_points"]}
                        </button>
                      )}
                      {user && (
                        <button
                          className="btn-hover"
                          onClick={() => {
                            setType("cod");
                            handleCheckout();
                          }}
                          id="cod-button">
                          {strings["place_order_with_cod"]}
                        </button>
                      )}
                      <div className="">
                        {!user && (
                          <button
                            className="order-now"
                            onClick={() => setModalShow(true)}>
                            <span>{strings["order_now"]}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24px"
                              viewBox="0 0 24 24"
                              fill="#FFF">
                              <path d="M0 0h24v24H0V0z" fill="none"></path>
                              <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                            </svg>
                          </button>
                        )}
                        <CheckoutModal
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                          products={cartItems?.items}
                          currentLanguageCode={currentLanguageCode}
                          strings={strings}
                          quantityCount={1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {strings["no_items_in_cart"]} <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        {strings["shop_now"]}
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
    currency: state.currencyData,
  };
};

export default connect(mapStateToProps)(multilanguage(Checkout));