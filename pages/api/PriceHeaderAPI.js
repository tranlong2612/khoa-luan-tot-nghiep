import axios from "axios";

import { API_URL } from "./url";

const getPriceHeaders = () => {
    return axios({
      method: "GET",
      url: API_URL + `/price-headers`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  
  const getPriceHeaderById = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/price-headers/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const createPriceHeader = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/price-headers`,
      data: data,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const deletePriceHeader = (data) => {
    return axios({
      method: "DELETE",
      url: API_URL + `/price-headers/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const updatePriceHeader = (data) => {
    return axios({
      method: "PUT",
      url: API_URL + `/price-headers/${data.id}`,
      data: data,
    })

      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

export { getPriceHeaderById,updatePriceHeader, getPriceHeaders, createPriceHeader, deletePriceHeader };