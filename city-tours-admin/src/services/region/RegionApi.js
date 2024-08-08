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
};

export default regionApi;
