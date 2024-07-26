import { Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBlogs, getBlogById } from "../features/blog/BlogSlice";
import Content from "../components/blog/Content";
import { useParams } from "react-router-dom";
import Loading from "../components/common/Loading";

export default function BlogDetail() {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux Store
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs?.list);
  const blog = useSelector((state) => state.blogs?.selectedBlog);
  const { blogId } = useParams();

  //Local State
  const [showContent, setShowContent] = useState(false);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: INIT_LIMIT,
  });

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllBlogs(pagination));

    dispatch(getBlogById(blogId))
      .then(() => {
        setTimeout(() => {
          setShowContent(true);
        }, 1000);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [dispatch]);

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show content */}
      {showContent && (
        <>
          <Row
            style={{
              width: "100%",
              height: "110px",
            }}
          ></Row>
          <Content blogs={blogs} blog={blog} />
        </>
      )}
    </>
  );
}
