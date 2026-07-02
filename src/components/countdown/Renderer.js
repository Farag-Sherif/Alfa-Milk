import PropTypes from "prop-types";
import React from "react";

const Renderer = ({ days, hours, minutes, seconds }) => {
  // قراءة اللغة من التخزين المحلي بدون استخدام Hooks لتجنب كراش الصفحة
  let isArabic = false;
  try {
    const reduxState = JSON.parse(localStorage.getItem("redux_localstorage_simple"));
    if (reduxState && reduxState.multilanguage && reduxState.multilanguage.currentLanguageCode === 'ar') {
      isArabic = true;
    }
  } catch (error) {
    // لو حصل أي مشكلة في القراءة، هيكمل إنجليزي عادي بدون ما يوقع الموقع
  }

  // تحديد الكلمات بناءً على اللغة
  const textDays = isArabic ? "أيام" : "Days";
  const textHours = isArabic ? "ساعات" : "Hours";
  const textMinutes = isArabic ? "دقائق" : "Minutes";
  const textSeconds = isArabic ? "ثواني" : "Secs";

  return (
    <div className="timer timer-style">
      <div>
        <span className="cdown day">
          {days} <p>{textDays}</p>
        </span>
        <span className="cdown hour">
          {hours} <p>{textHours}</p>
        </span>
        <span className="cdown minutes">
          {minutes} <p>{textMinutes}</p>
        </span>
        <span>
          {seconds} <p>{textSeconds}</p>
        </span>
      </div>
    </div>
  );
};

Renderer.propTypes = {
  days: PropTypes.number,
  hours: PropTypes.number,
  minutes: PropTypes.number,
  seconds: PropTypes.number,
};

export default Renderer;