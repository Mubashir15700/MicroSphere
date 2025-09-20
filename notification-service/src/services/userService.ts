import { Request } from 'express';
import axios from 'axios';
import { USER_SERVICE_URL } from '../config/envConfig';

export const getUserByID = async (req: Request, userId: string) => {
  const authHeader = req.headers['authorization'];

  try {
    const response = await axios.get(`${USER_SERVICE_URL}/userId/${userId}`, {
      headers: {
        Authorization: authHeader || '',
      },
    });
    return response.data;
  } catch (error) {
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
      message: 'Unexpected error while fetching user',
      source: 'Task Service',
    };
  }
};
