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
};

export default customerApi;
