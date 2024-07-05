import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const hotelApi = {
  getAllHotels: async (panigation) => {
    const { page, limit } = panigation;

    const url = `${API_ROUTE.GET_ALL_HOTELS}?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  getHotelById: async (hotelId) => {
    const url = `${API_ROUTE.GET_HOTEL_BY_ID}${hotelId}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  getRoomById: async (roomId) => {
    const url = `${API_ROUTE.GET_ROOM_BY_ID}${roomId}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  createRoom: async (data) => {
    const { hotelId, ...rest } = data;

    const newData = { ...rest };

    const url = `${API_ROUTE.CREATE_ROOM}${hotelId}/create`;
    try {
      const response = await axiosClient.post(url, newData);
      return response;
    } catch (error) {
      return { error };
    }
  },

  updateHotel: async (data) => {
    const { hotelId, ...rest } = data;

    const newData = { ...rest };

    const url = `${API_ROUTE.UPDATE_HOTEL}${hotelId}`;
    try {
      const response = await axiosClient.put(url, newData);
      return response;
    } catch (error) {
      return { error };
    }
  },

  updateRoom: async (data) => {
    const { roomId, ...rest } = data;

    const newData = { ...rest };

    const url = `${API_ROUTE.UPDATE_ROOM}${roomId}`;
    try {
      const response = await axiosClient.put(url, newData);
      return response;
    } catch (error) {
      return { error };
    }
  },

  deleteRoom: async (roomId) => {
    const url = `${API_ROUTE.DELETE_ROOM}${roomId}`;
    try {
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      return { error };
    }
  },
};

export default hotelApi;
