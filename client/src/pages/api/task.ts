import { NextApiRequest, NextApiResponse } from 'next';
import { handleAxiosError } from '@/lib/axiosHelpers';
import { createAxiosInstance } from '@/lib/axiosInstance';

async function handleGetAllTasks(req: NextApiRequest, res: NextApiResponse, token?: string) {
  if (req.method === 'GET') {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.get('/tasks');
      return res.status(response.status).json(response.data);
    } catch (error: unknown) {
      return handleAxiosError(error, res);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function handleGetTask(req: NextApiRequest, res: NextApiResponse, token?: string) {
  {
    if (req.method === 'GET') {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`/tasks/${req.query.id}`);
        return res.status(response.status).json(response.data);
      } catch (error: unknown) {
        return handleAxiosError(error, res);
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
}

// Main handler for all API requests to this file
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  switch (req.method) {
    case 'GET':
      if (req.query.action === 'getAll') {
        return handleGetAllTasks(req, res, token);
      } else if (req.query.action === 'getById') {
        return handleGetTask(req, res, token);
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
