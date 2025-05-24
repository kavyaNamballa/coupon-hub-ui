import api from "../api/instance.ts";
import { UserData } from "../models/UserData.ts";

const nameSpace = "/api/auth";

const registerUser = (payload: UserData) => {
  return new Promise((resolve, reject) => {
    api
      .post(`${nameSpace}/register`, payload)
      .then((res) => resolve(res.data))
      .catch((e) =>
        reject(
          e.response?.data?.message ||
            e.response?.data ||
            "Registration failed!"
        )
      );
  });
};

const loginUser = (payload: UserData) => {
  return new Promise((resolve, reject) => {
    api
      .post(`${nameSpace}/login`, payload)
      .then((res) => {
        console.log("kavya res, ", res);
        resolve(res.data);
      })
      .catch((e) =>
        reject(e.response?.data?.message || e.response?.data || "Login Failed")
      );
  });
};

export const UserService = { registerUser, loginUser };
