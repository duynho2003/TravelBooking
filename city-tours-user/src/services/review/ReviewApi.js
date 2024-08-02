import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const reviewApi = {
  createHotelReview: async (data) => {
    const url = API_ROUTE.CREATE_HOTEL_REVIEW;
    try {
      const response = await axiosClient.post(url, data);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  getHotelReviewsByHotelId: async (hotelId) => {
    const url = `${API_ROUTE.GET_HOTEL_REVIEW_BY_HOTEL_ID}${hotelId}`;
    try {
      const response = await axiosClient.get(url);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  createTourReview: async (data) => {
    const url = API_ROUTE.CREATE_TOUR_REVIEW;
    try {
      const response = await axiosClient.post(url, data);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  getTourReviewsByTourId: async (tourId) => {
    const url = `${API_ROUTE.GET_TOUR_REVIEW_BY_TOUR_ID}${tourId}`;
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

export default reviewApi;
