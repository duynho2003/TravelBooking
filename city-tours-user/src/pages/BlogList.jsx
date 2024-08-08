import { Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const initialSearch = urlSearchParams.get("search");

  //Local State
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    search: initialSearch,
  });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setPagination((prevState) => ({
      ...prevState,
      search: initialSearch,
    }));
  }, [initialSearch]);

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

  const handleTableChange = (current, pageSize, search) => {
    setShowContent(false);

    scrollToTop();

    setPagination({
      ...pagination,
      page: current,
      limit: pageSize,
      search: search,
    });

    urlSearchParams.set("search", search);

    navigate(`${location.pathname}?${urlSearchParams.toString()}`);
  };

  const sortedBlogs = blogs
    ?.filter((blog) => blog?.activeStatus === "ACTIVE")
    .sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));

  console.log("sortedBlogs: ", sortedBlogs);

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
            blogs={sortedBlogs}
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
