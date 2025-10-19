import { NextApiRequest, NextApiResponse } from 'next';
import axiosInstance from '@/lib/axiosInstance';
import { handleAxiosError } from '@/lib/axiosHelpers';
import { serialize } from 'cookie';

async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await axiosInstance.post('/auth/login', req.body);
      const { token } = response.data;

      res.setHeader(
        'Set-Cookie',
        serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
      );

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
      const { token } = response.data;

      res.setHeader(
        'Set-Cookie',
        serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
      );

      return res.status(response.status).json(response.data);
    } catch (error: unknown) {
      return handleAxiosError(error, res);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function handleLogout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    res.setHeader(
      'Set-Cookie',
      serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
    );

    return res.status(200).json({ message: 'Logged out' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function handleProfile(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
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

async function handleUpdateProfile(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const response = await axiosInstance.put(`/users/userId/${req.query.id}`, req.body, {
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
      } else if (req.query.action === 'logout') {
        return handleLogout(req, res);
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
    case 'PUT':
      if (req.query.action === 'profile') {
        return handleUpdateProfile(req, res);
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
