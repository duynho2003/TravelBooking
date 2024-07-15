import axios from "axios";
import { GOONG_MAP_KEY, API_KEY } from "../../utils/Constants";

const goongApi = {
  geocoding: async (encodedAddress) => {
    const url = `https://rsapi.goong.io/geocode?address=${encodedAddress}&api_key=${API_KEY}`;
    try {
      const response = await axios.get(url);
      return response.data.results;
    } catch (error) {
      throw error;
    }
  },

  reverseGeocoding: async (latlng) => {
    const url = `https://rsapi.goong.io/geocode?latlng=${latlng}&api_key=${API_KEY}`;
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  direction: async (data) => {
    const { origin, destination } = data;
    const url = `https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&vehicle=bike&api_key=${API_KEY}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default goongApi;
