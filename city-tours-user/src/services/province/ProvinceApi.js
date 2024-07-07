import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const provinceApi = {
  getAllProvinces: async () => {
    const url = API_ROUTE.GET_ALL_PROVINCES;
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

export default provinceApi;
