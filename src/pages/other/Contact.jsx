import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
// !DEL
const Contact = ({ strings, currentLanguageCode }) => {
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactFormErrors, setContactFormErrors] = useState({});
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addresse, setAddresse] = useState(""); // To store fetched email
  const [email, setEmail] = useState(""); // To store fetched email
  const [mobiles, setMobiles] = useState([]); // To store fetched email
  const [socails, setSocails] = useState([]); // To store fetched email

  const handleInputChange = (e) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setContactFormErrors({});
    setSubmitting(true);

    try {
      const response = await axiosInstance.post("/contact", contactFormData);
      if (response.data.status === "success") {
        setContactFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setContact("Message Sent Successfully");
      } else if (response.data.status === "error") {
        setContactFormErrors(response.data.errors);
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emailRes, mobilesRes, socailsRes, addresseRes] =
          await Promise.all([
            axiosInstance.get("/emails"),
            axiosInstance.get("/mobiles"),
            axiosInstance.get("/socails"),
            axiosInstance.get("/addresse"),
          ]);

        if (emailRes.data?.length > 0) {
          setEmail(emailRes.data[0].email);
        }
        setMobiles(mobilesRes.data || []);
        setSocails(socailsRes.data || []);
        setAddresse(addresseRes.data || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["elmoda"]} | {strings["CONTACT_pageTitle"]}
        </title>
        <meta
          name="description"
          content="Contact of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/contact"}>
        {strings["CONTACT"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="contact-area pt-100 pb-100">
          <div className="container">
            <div className="contact-map mb-10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d71510.25909363896!2d31.18061091217867!3d30.05946551899679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e1!3m2!1sen!2sus!4v1774428581349!5m2!1sen!2sus"
                width="1200"
                height="500"
                style={{
                  border: 0,
                  width: "100%",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MAP"
              ></iframe>
            </div>
            <div className="custom-row-2">
              <div className="col-lg-4 col-md-5">
                <div className="contact-info-wrap">
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-phone" />
                    </div>
                    <div className="contact-info-dec">
                      {mobiles?.map((el, key) => (
                        <div key={key}>
                          <p>{el.mobile}</p>
                          <p>
                            {currentLanguageCode === "en"
                              ? el.translations[1]?.name
                              : el.translations[0]?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-globe" />
                    </div>
                    <div className="contact-info-dec">
                      <p>
                        <a href={`mailto:${email}`}>{email}</a>
                      </p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-map-marker" />
                    </div>
                    <div className="contact-info-dec">
                      <p>{addresse}</p>
                    </div>
                  </div>
                  <div className="contact-social text-center">
                    <h3>{strings["CONTACT_SOCIAL_TITLE"]}</h3>
                    <ul>
                      {socails?.map((el, index) => (
                        <li key={el.id || index} className="social-media-item">
                          <a
                            href={el.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`https://admin.omdacoffee.com/images/${el.icon}`}
                              alt={`Social media icon ${index + 1}`}
                              className="social-media-icon"
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-7">
                <div className="contact-form">
                  <div className="contact-title mb-30">
                    <h2>{strings["CONTACT_FORM_TITLE"]}</h2>
                  </div>
                  <form className="contact-form-style" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <input
                          name="name"
                          placeholder={strings["CONTACT_FORM_NAME_PLACEHOLDER"]}
                          type="text"
                          value={contactFormData.name}
                          onChange={handleInputChange}
                        />
                        {contactFormErrors.name && (
                          <span className="error">
                            {contactFormErrors.name[0]}
                          </span>
                        )}
                      </div>
                      <div className="col-lg-6">
                        <input
                          name="email"
                          placeholder={
                            strings["CONTACT_FORM_EMAIL_PLACEHOLDER"]
                          }
                          type="email"
                          value={contactFormData.email}
                          onChange={handleInputChange}
                        />
                        {contactFormErrors.email && (
                          <span className="error">
                            {contactFormErrors.email[0]}
                          </span>
                        )}
                      </div>
                      <div className="col-lg-12">
                        <input
                          name="subject"
                          placeholder={
                            strings["CONTACT_FORM_SUBJECT_PLACEHOLDER"]
                          }
                          type="text"
                          value={contactFormData.subject}
                          onChange={handleInputChange}
                        />
                        {contactFormErrors.subject && (
                          <span className="error">
                            {contactFormErrors.subject[0]}
                          </span>
                        )}
                      </div>
                      <div className="col-lg-12">
                        <textarea
                          name="message"
                          placeholder={
                            strings["CONTACT_FORM_MESSAGE_PLACEHOLDER"]
                          }
                          value={contactFormData.message}
                          onChange={handleInputChange}
                        />
                        {contactFormErrors.message && (
                          <span className="error">
                            {contactFormErrors.message[0]}
                          </span>
                        )}
                        {contact && (
                          <p style={{ color: "green", paddingBlock: "10px" }}>
                            {contact}
                          </p>
                        )}
                        <button
                          className="submit"
                          type="submit"
                          disabled={submitting}
                        >
                          {strings["CONTACT_FORM_SUBMIT_BUTTON"]}
                        </button>
                      </div>
                    </div>
                  </form>
                  <p className="form-messege" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Contact.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(Contact);
