import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import LayoutOne from "../../layouts/LayoutOne";
import { getCartItems } from "../../redux/actions/cartActions";
import { getWishlist } from "../../redux/actions/wishlistActions";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
// !DEL
const LoginRegister = ({ location, strings }) => {
  const { pathname } = location;
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [loginErrors, setLoginErrors] = useState({});
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    phone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    try {
      const response = await axiosInstance.post("/register", formData); // Assuming axiosInstance is used here
      if (response.data.status === "success") {
        setMsg(response.data.message);
        history.push("/my-account"); // Redirect to user dashboard
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "An unexpected error occurred." });
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginErrors({}); // Clear previous errors

    try {
      const response = await axiosInstance.post("/login", loginFormData);
      if (response.data.status === "success") {
        // Store the token and navigate to the user's profile page or dashboard
        localStorage.setItem("authToken", response.data.token);
        history.push("/my-account"); // Redirect to user dashboard
        dispatch(getWishlist());
        dispatch(getCartItems());
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setLoginErrors(error.response.data.errors);
      } else {
        setLoginErrors({
          general:
            "An unexpected error occurred. Please check your Phone number and password.",
        });
      }
    }
  };
  const handleLoginChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["elmoda"]} | {strings["login_register"]}
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
        {strings["login_register"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>{strings["login"]}</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>{strings["register"]}</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleLoginSubmit}>
                              <input
                                type="text"
                                name="phone"
                                placeholder={strings["phone_number"]}
                                value={loginFormData.phone}
                                onChange={handleLoginChange}
                              />
                              <input
                                type="password"
                                name="password"
                                placeholder={strings["password"]}
                                value={loginFormData.password}
                                onChange={handleLoginChange}
                              />
                              {loginErrors.general && (
                                <span className="error">
                                  {loginErrors.general}
                                </span>
                              )}
                              <div className="button-box">
                                <button type="submit">
                                  <span>{strings["login"]}</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleSubmit}>
                              <input
                                type="text"
                                name="fname"
                                placeholder={strings["first_name"]}
                                value={formData.fname}
                                onChange={handleChange}
                              />
                              {errors.fname && (
                                <span className="error">{errors.fname}</span>
                              )}

                              <input
                                type="text"
                                name="lname"
                                placeholder={strings["last_name"]}
                                value={formData.lname}
                                onChange={handleChange}
                              />
                              {errors.lname && (
                                <span className="error">{errors.lname}</span>
                              )}

                              <input
                                type="text"
                                name="phone"
                                placeholder={strings["phone"]}
                                value={formData.phone}
                                onChange={handleChange}
                              />
                              {errors.phone && (
                                <span className="error">{errors.phone}</span>
                              )}

                              <input
                                type="email"
                                name="email"
                                placeholder={strings["email"]}
                                value={formData.email}
                                onChange={handleChange}
                              />
                              {errors.email && (
                                <span className="error">{errors.email}</span>
                              )}

                              <input
                                type="password"
                                name="password"
                                placeholder={strings["password"]}
                                value={formData.password}
                                onChange={handleChange}
                              />
                              {errors.password && (
                                <span className="error">{errors.password}</span>
                              )}
                              {msg && (
                                <span
                                  style={{
                                    color: "green",
                                  }}
                                >
                                  {msg}
                                </span>
                              )}
                              <div className="button-box">
                                <button type="submit">
                                  <span>{strings["register"]}</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(LoginRegister);
