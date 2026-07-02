import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import Loading from "../../components/Loading";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Collapse from "react-bootstrap/Collapse";

// !DEL
const MyAccount = ({ location, strings, currentLanguageCode }) => {
  const history = useHistory();
  const [cities, setCities] = useState([]);

  const { pathname } = location;
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    addresses: [],
  });
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [openOrders, setOpenOrders] = useState({});

  const toggleOrder = (orderId) => {
    setOpenOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/user");
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch cities on component load
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user/edit_profile", user); // Adjust URL as needed
      if (response.status === 200) {
        addToast("User Details Updated", {
          appearance: "success",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Extract and display validation errors
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", "); // Combine all error messages into a single string
        addToast(errorMessages, {
          appearance: "error",
        });
      } else {
        addToast("An unexpected error occurred", {
          appearance: "error",
        });
      }
      console.error("Profile update error:", error);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      addToast("Passwords do not match", { appearance: "error" });
      return;
    }

    try {
      const response = await axiosInstance.post("/user/password", {
        password: passwords.password,
      });
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        addToast("Password successfully updated", { appearance: "success" });
        setPasswords({ password: "", confirmPassword: "" });
      } else {
        addToast("Failed to update password", { appearance: "error" });
      }
    } catch (error) {
      addToast("An error occurred while updating the password", {
        appearance: "error",
      });
      console.error("Password update error:", error);
    }
  };

  const handleAddressChange = (index, e) => {
    const updatedAddresses = user.addresses.map((address, i) => {
      if (i === index) {
        return { ...address, [e.target.name]: e.target.value };
      }
      return address;
    });
    setUser({ ...user, addresses: updatedAddresses });
  };

  const handleAddressSubmit = async (index, e) => {
    e.preventDefault();
    const address = user.addresses[index];
    try {
      const response = await axiosInstance.post(
        `/user/addresses/edit/${address.id}`,
        address
      );
      if (response.status === 200) {
        addToast("Address updated successfully", { appearance: "success" });
      }
    } catch (error) {
      console.error("Failed to update address:", error);
      addToast("Failed to update address", { appearance: "error" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("redux_localstorage_simple"); // Clear token
    localStorage.removeItem("authToken"); // Clear token
    history.push("/"); // Redirect to login page
  };

  if (loading) {
    return <Loading />;
  }
console.log(user);

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["elmoda"]} | {strings["my_account"]}
        </title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["my_account"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <button onClick={handleLogout} className="btn mb-4">
                    {strings["logout"]}
                  </button>
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            <span>1 .</span> {strings["points"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="pb-3 mb-3 border-bottom">
                            <h4>{strings["account_info"]}</h4>
                            <h5>{strings["personal_details"]}</h5>
                          </div>
                          <div
                            className={`d-flex justify-content-between ${
                              currentLanguageCode === "ar"
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            <div className="">
                              <h4 className="text-dark">
                                {strings["USER_POINTS"]}
                              </h4>
                            </div>
                            <div className="">
                              <h4 className="text-dark">{user.points}</h4>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            <span>2 .</span> {strings["your_orders"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="pb-3 mb-3 border-bottom">
                            <h4>{strings["personal_details"]}</h4>
                            <h5>{strings["order_history"]}</h5>
                          </div>
                          <div>
                            <div className="row align-items-center justify-content-between g-3">
                              <div className="col-3 col-md-2">
                                <h6 className="text-dark">
                                  {strings["order_id"]}
                                </h6>
                              </div>
                              <div className="col-3 col-md-2">
                                <h6 className="text-dark">
                                  {strings["order_date"]}
                                </h6>
                              </div>
                              <div className="col-3 col-md-2">
                                <h6 className="text-dark">
                                  {strings["order_status"]}
                                </h6>
                              </div>
                              <div className="col-3 col-md-2">
                                <h6 className="text-dark">
                                  {strings["total"]}
                                </h6>
                              </div>
                              <div className="col-3 col-md-2">
                                <h6 className="text-dark">
                                  {strings["action"]}
                                </h6>
                              </div>
                            </div>
                            <div className="mt-3">
                              {user.orders?.length > 0 ? (
                                user.orders.map((order) => (
                                  <React.Fragment key={order.id}>
                                    <div className="row align-items-center justify-content-between g-3">
                                      <div className="col-3 col-md-2">
                                        <h6 className="text-dark">
                                          {order.id}
                                        </h6>
                                      </div>
                                      <div className="col-3 col-md-2">
                                        <h6 className="text-dark">
                                          {new Date(
                                            order.created_at
                                          ).toLocaleDateString()}
                                        </h6>
                                      </div>
                                      <div className="col-3 col-md-2">
                                        <h6 className="text-dark">
                                          {currentLanguageCode === "ar" ? order.status.translations[0].name : order.status.translations[1].name}
                                        </h6>
                                      </div>
                                      <div className="col-3 col-md-2">
                                        <h6 className="text-dark">
                                          {order.totalCost}
                                        </h6>
                                      </div>
                                      <div className="col-3 col-md-2">
                                        <span
                                          role="button"
                                          className="text-success p-0"
                                          onClick={() => toggleOrder(order.id)}
                                        >
                                          {openOrders[order.id] ? (
                                            <>{strings["hide_details"]}</>
                                          ) : (
                                            <>{strings["View_details"]}</>
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    <Collapse in={openOrders[order.id]}>
                                      <div className="order-details my-2 p-3 bg-light rounded">
                                        <h6 className="mb-3 fw-bold">
                                          {strings["items"]} (
                                          {order.items.length})
                                        </h6>
                                        {order.items.map((item) => (
                                          <div
                                            key={item.id}
                                            className="item-detail mb-3"
                                          >
                                            <div className="row align-items-center g-3 mb-2">
                                              <div className="col-3 col-md-2">
                                                <img
                                                  width={80}
                                                  src={`https://admin.omdacoffee.com/en/images/${item.image}`}
                                                  alt={item.name}
                                                  className="img-fluid rounded shadow-sm"
                                                />
                                              </div>
                                              <div className="col-9 col-md-4">
                                                <div className="small text-muted">
                                                {strings["product_name"]}
                                                </div>
                                                <div>
                                                <div>{currentLanguageCode === 'ar' ? item.translations[0].name : item.translations[1].name}</div>
                                                </div>
                                              </div>
                                              <div className="col-4 col-md-2">
                                                <div className="small text-muted">
                                                  {strings["price"]}
                                                </div>
                                                <div>{item.price}</div>
                                              </div>
                                              <div className="col-4 col-md-2">
                                                <div className="small text-muted">
                                                {strings["quantity"]}
                                                </div>
                                                <div>{item.pivot.qty}</div>
                                              </div>
                                              <div className="col-4 col-md-2">
                                                <div className="small text-muted">
                                                {strings["weight"]}
                                                </div>
                                                <div>{currentLanguageCode === 'ar' ? item.translations[0].weight : item.translations[1].weight}</div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </Collapse>
                                  </React.Fragment>
                                ))
                              ) : (
                                <p>{strings["no_orders_found"]}</p>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="2">
                          <h3 className="panel-title">
                            <span>3 .</span> {strings["edit_account_info"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          <form
                            onSubmit={handleSubmit}
                            className="myaccount-info-wrapper"
                          >
                            <div className="account-info-wrapper">
                              <h4>{strings["account_info"]}</h4>
                              <h5>{strings["personal_details"]}</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{strings["first_name"]}</label>
                                  <input
                                    type="text"
                                    name="fname"
                                    value={user.fname || ""}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{strings["last_name"]}</label>
                                  <input
                                    type="text"
                                    name="lname"
                                    value={user.lname || ""}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{strings["email_address"]}</label>
                                  <input
                                    type="email"
                                    name="email"
                                    value={user.email || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{strings["telephone"]}</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    value={user.phone || ""}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">
                                  {strings["update"]}
                                </button>
                              </div>
                            </div>
                          </form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="3">
                          <h3 className="panel-title">
                            <span>4 .</span> {strings["change_password"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="3">
                        <Card.Body>
                          <form
                            onSubmit={handlePasswordSubmit}
                            className="myaccount-info-wrapper"
                          >
                            <div className="account-info-wrapper">
                              <h4>{strings["change_password"]}</h4>
                              <h5>{strings["password"]}</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{strings["password"]}</label>

                                  <input
                                    type="password"
                                    name="password"
                                    value={passwords.password}
                                    onChange={handlePasswordChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{strings["password_confirm"]}</label>
                                  <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">
                                  {strings["continue"]}
                                </button>
                              </div>
                            </div>
                          </form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="4">
                          <h3 className="panel-title">
                            <span>5 .</span> {strings["modify_address_book"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="4">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>{strings["address_book_entries"]}</h4>
                            </div>
                            {user?.addresses?.map((address, index) => (
                              <div key={index}>
                                <p>
                                  <span>{index + 1} .</span> Address {index + 1}
                                </p>
                                <form
                                  onSubmit={(e) =>
                                    handleAddressSubmit(index, e)
                                  }
                                >
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>{strings["first_name"]}</label>
                                        <input
                                          type="text"
                                          name="f_name"
                                          value={address.f_name}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>{strings["last_name"]}</label>
                                        <input
                                          type="text"
                                          name="l_name"
                                          value={address.l_name}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>{strings["country"]}</label>
                                        <input
                                          type="text"
                                          name="country"
                                          value={address.country}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>
                                          {strings["street_address"]}
                                        </label>
                                        <input
                                          placeholder={
                                            strings["apartment_suite"]
                                          }
                                          type="text"
                                          name="street"
                                          value={address.street}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <select
                                          name="city"
                                          value={address.city}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        >
                                          <option value="">
                                            {strings["select_city"]}
                                          </option>
                                          {cities.map((city) => (
                                            <option
                                              key={city.id}
                                              value={city.id}
                                            >
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
                                        <label>{strings["postcode_zip"]}</label>
                                        <input
                                          type="text"
                                          name="zip"
                                          value={address.zip}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>{strings["phone"]}</label>
                                        <input
                                          type="text"
                                          name="phone"
                                          value={address.phone}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>
                                          {strings["email_address"]}
                                        </label>
                                        <input
                                          type="text"
                                          name="email"
                                          value={address.email}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <button type="submit" className="btn">
                                    {strings["update"]}
                                  </button>
                                </form>
                              </div>
                            ))}
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

MyAccount.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(MyAccount);
