import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const websiteApi = {
  getWebsiteInfo: async (websiteId) => {
    const url = `${API_ROUTE.GET_WEBSITE_INFO}${websiteId}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      return { error };
    }
  },
};

export default websiteApi;
