import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const tourBookingApi = {
  getAllTourBookings: async (panigation) => {
    const { page, limit, tourName, tourId } = panigation;

    const url = `${API_ROUTE.GET_ALL_TOUR_BOOKINGS}?page=${page}&limit=${limit}&tourName=${tourName}&tourId=${tourId}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  getAllRoomBookings: async (panigation) => {
    const { page, limit, hotelName, hotelId } = panigation;

    const url = `${API_ROUTE.GET_ALL_ROOM_BOOKINGS}?page=${page}&limit=${limit}&hotelName=${hotelName}&hotelId=${hotelId}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  // getAccountById: async (userId) => {
  //   const url = `${API_ROUTE.GET_USER_BY_ID}${userId}`;
  //   try {
  //     const response = await axiosClient.get(url);
  //     return response;
  //   } catch (error) {
  //     return { error };
  //   }
  // },

  // createAccount: async (data) => {
  //   const url = `${API_ROUTE.CREATE_USER}`;

  //   try {
  //     const response = await axiosClient.post(url, data);
  //     return response;
  //   } catch (error) {
  //     return { error };
  //   }
  // },

  // updateAccount: async (data) => {
  //   const { userId, ...rest } = data;

  //   const newData = { ...rest };

  //   const url = `${API_ROUTE.UPDATE_USER}${userId}`;

  //   try {
  //     const response = await axiosClient.put(url, newData);
  //     return response;
  //   } catch (error) {
  //     return { error };
  //   }
  // },

  // deleteAccount: async (userId) => {
  //   const url = `${API_ROUTE.UPDATE_USER}${userId}`;

  //   try {
  //     const response = await axiosClient.delete(url);
  //     return response;
  //   } catch (error) {
  //     return { error };
  //   }
  // },
};

export default tourBookingApi;
