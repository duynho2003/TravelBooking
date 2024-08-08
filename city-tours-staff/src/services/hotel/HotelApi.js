import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const hotelApi = {
  getAllHotels: async (panigation) => {
    const { page, limit, search } = panigation;

    const url = `${API_ROUTE.GET_ALL_HOTELS}?page=${page}&limit=${limit}&search=${search}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },
};

export default hotelApi;
