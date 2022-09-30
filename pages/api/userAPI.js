import axios from "axios";
import axiosClient from "./index";

import { API_URL } from "./url";

const getUsers = async () => {
  return axiosClient()({
    method: "GET",
    url: API_URL + `/users`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getUserById = async (id) => {
  return axiosClient()({
    method: "GET",
    url: API_URL + `/users/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const createUser = async (data) => {
  return axiosClient()({
    method: "POST",
    url: API_URL + `/users`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateUserById = async (data, id) => {
  return axiosClient()({
    method: "PUT",
    url: API_URL + `/users/${id}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const uploadImagesUser = async (data) => {
  console.log(data);
  return axios({
    method: "POST",
    headers: {
      'Content-Type':  'multipart/form-data',
    },
    url: API_URL + "/upload",
    data: data,
  });
};

export { getUsers, createUser, getUserById, updateUserById, uploadImagesUser };
