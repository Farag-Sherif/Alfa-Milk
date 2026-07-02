import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../../api/api";

// const CustomForm = ({ status, message, onValidated }) => {
//   let email;
//   const submit = () => {
//     email &&
//       email.value.indexOf("@") > -1 &&
//       onValidated({
//         EMAIL: email.value,
//       });

//     let emailInput = document.getElementById("mc-form-email");
//     emailInput.value = "";
//   };

//   return (
//     <div className="subscribe-form">
//       <div className="mc-form">
//         <div>
//           <input
//             id="mc-form-email"
//             className="email"
//             ref={(node) => (email = node)}
//             type="email"
//             placeholder="Enter your email address..."
//           />
//         </div>
//         <div className="clear">
//           <button className="button" onClick={submit}>
//             SUBSCRIBE
//           </button>
//         </div>
//       </div>

//       {status === "sending" && (
//         <div style={{ color: "#3498db", fontSize: "12px" }}>sending...</div>
//       )}
//       {status === "error" && (
//         <div
//           style={{ color: "#e74c3c", fontSize: "12px" }}
//           dangerouslySetInnerHTML={{ __html: message }}
//         />
//       )}
//       {status === "success" && (
//         <div
//           style={{ color: "#2ecc71", fontSize: "12px" }}
//           dangerouslySetInnerHTML={{ __html: message }}
//         />
//       )}
//     </div>
//   );
// };

const SubscribeEmail = ({ strings }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "sending", "success", "error"
  const [message, setMessage] = useState("");

  const emailRef = useRef(null); // Using ref to get email input value

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || email.indexOf("@") === -1) return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await axiosInstance.post("/subscriptions", { email });
      if (response.status === 200) {
        setStatus("success");
        setMessage(strings["subscribe_success"]);
      } else {
        setStatus("error");
        setMessage(strings["subscribe_error"]);
      }
    } catch (error) {
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
    <div className="subscribe-form">
      <form onSubmit={handleSubmit}>
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
          <div className="clear">
            <button
              className="button"
              disabled={status === "sending"}
              type="submit"
            >
              {strings["subscribe_button"]}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

SubscribeEmail.propTypes = {
  mailchimpUrl: PropTypes.string,
};

export default multilanguage(SubscribeEmail);
