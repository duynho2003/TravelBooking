import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const tourApi = {
  getAllTours: async (panigation) => {
    const { page, limit } = panigation;

    const url = `${API_ROUTE.GET_ALL_TOURS}?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  getTourById: async (tourId) => {
    const url = `${API_ROUTE.GET_TOUR_BY_ID}${tourId}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  deleteTour: async (tourId) => {
    const url = `${API_ROUTE.DELETE_TOUR}${tourId}`;
    try {
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      return { error };
    }
  },
};

export default tourApi;
