import axios from 'axios';
import { INTERNAL_AUTH, USER_SERVICE_SECRET, USER_SERVICE_URL } from '../config/envConfig';

const headers = {
  'x-service-secret': USER_SERVICE_SECRET,
  'x-internal-auth': INTERNAL_AUTH,
};

const parseAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.status || error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      source: 'User Service',
    };
  }

  return {
    status: 500,
    message: 'Unexpected internal error',
    source: 'Auth Service',
  };
};

export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}`, userData, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw parseAxiosError(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/email/${email}`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw parseAxiosError(error);
  }
};

export const getAdminId = async () => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/admin/id`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw parseAxiosError(error);
  }
};
