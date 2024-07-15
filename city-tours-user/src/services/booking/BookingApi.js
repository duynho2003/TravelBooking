import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const hotelApi = {
  getAllRoomBookingsByUserId: async (panigation) => {
    const { userId, page, limit } = panigation;

    const url = `${API_ROUTE.GET_ALL_ROOM_BOOKINGS_BY_USERID}${userId}?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  getAllTourBookingsByUserId: async (panigation) => {
    const { userId, page, limit } = panigation;

    const url = `${API_ROUTE.GET_ALL_TOUR_BOOKINGS_BY_USERID}${userId}?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },
};

export default hotelApi;
