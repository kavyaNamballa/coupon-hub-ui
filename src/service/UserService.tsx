import api from "../api/instance.ts";
import { UserData, LoginResponse } from "../models/UserData.ts";

const nameSpace = "/api/auth";

const registerUser = (payload: UserData): Promise<any> => {
  localStorage.removeItem("token");
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

const loginUser = (payload: UserData): Promise<LoginResponse> => {
  localStorage.removeItem("token");
  return new Promise((resolve, reject) => {
    api
      .post(`${nameSpace}/login`, payload)
      .then((res) => {
        const response: LoginResponse = {
          token: res.data.token || res.data,
          user: res.data.user || {
            id: 1,
            firstName: "User",
            lastName: "Name",
            email: payload.email,
          },
        };
        localStorage.setItem("token", response.token);
        resolve(response);
      })
      .catch((e) =>
        reject(e.response?.data?.message || e.response?.data || "Login Failed")
      );
  });
};

export const UserService = { registerUser, loginUser };
