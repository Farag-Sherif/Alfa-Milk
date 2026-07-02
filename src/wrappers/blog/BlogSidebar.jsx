import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const BlogSidebar = ({strings}) => {
  const [blogFeaturedData, setBlogFeaturedData] = useState([]);
  // get last 5 posts
  useEffect(() => {
    // fetch data from API
    const fetchItems = async () => {
      try {
        const response = await axios.get("https://admin.omdacoffee.com/api/blogs");
        const data = response.data.slice(0, 5);
        setBlogFeaturedData(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
    fetchItems();
  }, [])

  return (
    <div className="sidebar-style">
      <div className="sidebar-widget">
        <h4 className="pro-sidebar-title text-left">{strings["Recent_Posts"]}</h4>
        <div className="sidebar-project-wrap mt-30">
          {blogFeaturedData.map((single, key) => {
            return ( <div key={key} className="single-sidebar-blog">
                <div className="sidebar-blog-img">
                <Link to={`/post?postId=${single?.id}`}>
                    <img
                      src={
                        single?.image_path
                      }
                      alt=""
                    />
                  </Link>
                </div>
                <div className="sidebar-blog-content">
                  {/* <span>Photography</span> */}
                  <h4>
                    <Link to={`/post?postId=${single?.id}`}>
                      {single?.title}
                    </Link>
                  </h4>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* Categories */}
      {/* <div className="sidebar-widget mt-35">
        <h4 className="pro-sidebar-title">Categories</h4>
        <div className="sidebar-widget-list sidebar-widget-list--blog mt-20">
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <input type="checkbox" defaultValue />{" "}
                <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                  Women <span>4</span>{" "}
                </Link>
                <span className="checkmark" />
              </div>
            </li>
            <li>
              <div className="sidebar-widget-list-left">
                <input type="checkbox" defaultValue />{" "}
                <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                  Men <span>4</span>{" "}
                </Link>
                <span className="checkmark" />
              </div>
            </li>
            <li>
              <div className="sidebar-widget-list-left">
                <input type="checkbox" defaultValue />{" "}
                <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                  Bags <span>4</span>{" "}
                </Link>
                <span className="checkmark" />
              </div>
            </li>
            <li>
              <div className="sidebar-widget-list-left">
                <input type="checkbox" defaultValue />{" "}
                <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                  Accessories <span>4</span>{" "}
                </Link>
                <span className="checkmark" />
              </div>
            </li>
          </ul>
        </div>
      </div> */}
      {/* Tag */}
      {/* <div className="sidebar-widget mt-50">
        <h4 className="pro-sidebar-title">Tag </h4>
        <div className="sidebar-widget-tag mt-25">
          <ul>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                Clothing
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                Accessories
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                For Men
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>Women</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                Fashion
              </Link>
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default multilanguage(BlogSidebar);
