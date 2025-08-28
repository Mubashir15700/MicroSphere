import axios from "axios";
import { USER_SERVICE_URL } from "../config/envConfig";

export const createUser = async (userData: any) => {
  const response = await axios.post(`${USER_SERVICE_URL}/users`, userData);
  return response.data;
};

export const getUserByEmail = async (email: string) => {
  const response = await axios.get(`${USER_SERVICE_URL}/users/email/${email}`);
  return response.data;
};
