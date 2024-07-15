import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const customerApi = {
  createCustomer: async (data) => {
    const url = API_ROUTE.CREATE_CUSTOMER;
    try {
      const response = await axiosClient.post(url, data);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  updateCustomer: async (data) => {
    const { userId, ...rest } = data;
    const newData = { ...rest };

    const url = `${API_ROUTE.UPDATE_CUSTOMER}${userId}`;
    try {
      const response = await axiosClient.put(url, newData);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  getInfoCustomer: async (customerId) => {
    const url = `${API_ROUTE.GET_INFO_CUSTOMER}${customerId}`;
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

export default customerApi;
