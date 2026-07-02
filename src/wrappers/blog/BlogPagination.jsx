import React from "react";
import PropTypes from "prop-types";

const BlogPagination = ({ currentPage, postsPerPage, totalPosts, onPageChange }) => {
  // حساب عدد الصفحات المطلوبة
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  // إنشاء مصفوفة تحتوي على أرقام الصفحات
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // دوال لتحديد الصفحة السابقة والتالية
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pro-pagination-style text-center mt-20">
      <ul>
        <li>
          <button className="prev" onClick={handlePrevPage} disabled={currentPage === 1}>
            <i className="fa fa-angle-double-left" />
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button className="next" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <i className="fa fa-angle-double-right" />
          </button>
        </li>
      </ul>
    </div>
  );
};

BlogPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  postsPerPage: PropTypes.number.isRequired,
  totalPosts: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default BlogPagination;
