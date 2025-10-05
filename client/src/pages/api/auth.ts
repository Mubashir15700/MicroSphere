import { NextApiRequest, NextApiResponse } from 'next';
// import { cookies } from 'next/headers';
import axiosInstance from '@/lib/axiosInstance';
import { handleAxiosError } from '@/lib/axiosHelpers';

async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await axiosInstance.post('/auth/login', req.body);
      return res.status(response.status).json(response.data);
    } catch (error: unknown) {
      return handleAxiosError(error, res);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function handleRegister(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await axiosInstance.post('/auth/register', req.body);
      return res.status(response.status).json(response.data);
    } catch (error: unknown) {
      return handleAxiosError(error, res);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function handleProfile(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // const cookieStore = await cookies(); // Get cookies in API route
      // const token = cookieStore.get('token')?.value; // Extract the token

      // const config = {
      //   headers: {
      //     Authorization: token ? `Bearer ${token}` : '', // Add token to headers if available
      //   },
      // };

      const response = await axiosInstance.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`,
        },
      });
      return res.status(response.status).json(response.data);
    } catch (error: unknown) {
      return handleAxiosError(error, res);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Main handler for all API requests to this file
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      if (req.query.action === 'login') {
        return handleLogin(req, res);
      } else if (req.query.action === 'register') {
        return handleRegister(req, res);
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
    case 'GET':
      if (req.query.action === 'profile') {
        return handleProfile(req, res);
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
