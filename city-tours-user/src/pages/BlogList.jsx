import { Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import { getAllBlogs } from "../features/blog/BlogSlice";
import List from "../components/blog/List";

export default function BlogList() {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogs = useSelector((state) => state.blogs?.list);
  const totalPages = useSelector((state) => state.blogs?.totals);
  const currentPage = useSelector((state) => state.blogs?.page);

  //Local State
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
  });
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllBlogs(pagination))
      .then(() => {
        scrollToTop();

        setTimeout(() => {
          setShowContent(true);
        }, 1000);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [dispatch, pagination]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTableChange = (current, pageSize) => {
    setShowContent(false);

    scrollToTop();

    setPagination({
      ...pagination,
      page: current,
      limit: pageSize,
    });
  };

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
          <List
            blogs={blogs}
            totalPages={totalPages}
            currentPage={currentPage}
            pagination={pagination}
            handleTableChange={handleTableChange}
          />
        </>
      )}
    </>
  );
}
