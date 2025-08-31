import axios from 'axios';
import { SHARED_SECRET, USER_SERVICE_URL } from '../config/envConfig';

const headers = {
  'x-service-secret': SHARED_SECRET,
};

export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}`, userData, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.status || 500;
      const message = error.response?.data?.message || error.message;

      throw {
        status,
        message,
        source: 'User Service',
      };
    }
    throw {
      status: 500,
      message: 'Unexpected error while creating user',
      source: 'Auth Service',
    };
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/email/${email}`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.status || 500;
      const message = error.response?.data?.message || error.message;

      throw {
        status,
        message,
        source: 'User Service',
      };
    }
    throw {
      status: 500,
      message: 'Unexpected error while getting user by email',
      source: 'Auth Service',
    };
  }
};
