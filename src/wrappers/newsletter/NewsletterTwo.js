import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
// !DEL
const NewsletterTwo = ({ spaceTopClass, spaceBottomClass, strings }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "sending", "success", "error"
  const [message, setMessage] = useState("");

  const emailRef = useRef(null); // Using ref to get email input value

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const response = await axiosInstance.post("/subscriptions", { email });
    if (response.status === 200) {
      setStatus("success");
      setMessage(strings["subscribe_success"]);
    } else {
      setStatus("error");
      setMessage(strings["subscribe_error"]);
    }
  };

  const getStatusMessage = () => {
    let color, messageContent;

    switch (status) {
      case "sending":
        color = "#3498db";
        messageContent = strings["sending"];
        break;
      case "error":
        color = "#e74c3c";
        messageContent = message;
        break;
      case "success":
        color = "#2ecc71";
        messageContent = message;
        break;
      default:
        return null;
    }

    return (
      <div
        style={{ color, fontSize: "12px" }}
        dangerouslySetInnerHTML={{ __html: messageContent }}
      />
    );
  };

  return (
    <div
      className={`subscribe-area-3 ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      } `}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-5 col-lg-7 col-md-10 ml-auto mr-auto">
            <div className="subscribe-style-3 text-center">
              <h2>{strings["subscribe"]}</h2>
              <p>{strings["subscribe_message"]}</p>

              <form onSubmit={handleSubmit}>
                <div className="subscribe-form-3 pt-100">
                  <div className="mc-form">
                    <div>
                      <input
                        className="email"
                        ref={emailRef}
                        type="email"
                        placeholder={strings["email_placeholder"]}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === "sending"}
                      />
                    </div>
                    {getStatusMessage()}

                    <div className={`clear-3 green-subscribe`}>
                      <button
                        className="button"
                        disabled={status === "sending"}
                        type="submit"
                      >
                        {strings["subscribe_button"]}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

NewsletterTwo.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default multilanguage(NewsletterTwo);
