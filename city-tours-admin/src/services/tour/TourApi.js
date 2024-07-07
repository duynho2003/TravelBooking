import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const tourApi = {
  getAllTours: async (panigation) => {
    const { page, limit, search, status } = panigation;

    const url = `${API_ROUTE.GET_ALL_TOURS}?page=${page}&limit=${limit}&search=${search}&status=${status}`;
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

  tourRoomBooking: async (data) => {
    const url = `${API_ROUTE.TOUR_ROOM_BOOKING}`;
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      return { error };
    }
  },
};

export default tourApi;
