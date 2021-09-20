import axios from "axios";

export const ROUTES = {
  LOGIN_USER: {
    url: "/login",
    method: "post",
  },
};

export const apiCall = async ({ method, url, data = {} }) => {
  try {
    const res = await axios({
      method,
      url,
      data,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (err) {
    const { data, status } = err.response;

    return data;
  }
};
