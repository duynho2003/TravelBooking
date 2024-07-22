import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const blogApi = {
  getAllBlogs: async (panigation) => {
    const { page, limit } = panigation;

    const url = `${API_ROUTE.GET_ALL_BLOGS}?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  getBlogById: async (blogId) => {
    const url = `${API_ROUTE.GET_BLOG_BY_ID}${blogId}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  deleteBlog: async (blogId) => {
    const url = `${API_ROUTE.DELETE_BLOG}${blogId}`;
    try {
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      return { error };
    }
  },
};

export default blogApi;
