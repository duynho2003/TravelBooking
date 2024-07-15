import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const wishlistApi = {
  createWishlist: async (data) => {
    const url = API_ROUTE.CREATE_WISHLIST;
    try {
      const response = await axiosClient.post(url, data);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  deleteWishlist: async (wishlistId) => {
    const url = `${API_ROUTE.DELETE_WISHLIST}${wishlistId}`;
    try {
      const response = await axiosClient.delete(url);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  getAllWishlistsByUserId: async (userId) => {
    const url = `${API_ROUTE.GET_ALL_WISHLISTS_BY_USERID}${userId}`;
    try {
      const response = await axiosClient.get(url);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },
};

export default wishlistApi;
