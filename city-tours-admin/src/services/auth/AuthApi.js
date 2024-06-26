import axiosClient from "../AxiosClient";
import { API_ROUTE } from "../../utils/Constants";

const authApi = {
  register: async (data) => {
    const url = API_ROUTE.REGISTER;
    try {
      const response = await axiosClient.post(url, data);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  login: async (data) => {
    const url = API_ROUTE.LOGIN;
    try {
      const response = await axiosClient.post(url, data);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },

  logout: async () => {
    const url = API_ROUTE.LOGOUT;
    try {
      const response = await axiosClient.post(url);
      console.log("response Api: ", response);
      return response;
    } catch (error) {
      console.log("response Api error: ", error);
      return { error };
    }
  },
};

export default authApi;
