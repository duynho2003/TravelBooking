import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const regionApi = {
  getAllRegions: async (panigation) => {
    const { page, limit } = panigation;

    const url = `${API_ROUTE.GET_ALL_REGIONS}?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  createRegion: async (data) => {
    const url = `${API_ROUTE.CREATE_REGION}`;
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      return { error };
    }
  },

  getRegionById: async (regionId) => {
    const url = `${API_ROUTE.GET_REGION_BY_ID}${regionId}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },

  updateRegion: async (data) => {
    const { regionId, newData } = data;

    const url = `${API_ROUTE.UPDATE_REGION}${regionId}`;
    try {
      const response = await axiosClient.put(url, newData);
      return response;
    } catch (error) {
      return { error };
    }
  },

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

export default regionApi;
