import { NextApiResponse } from 'next';
import axios from 'axios';

export function handleAxiosError(error: unknown, res: NextApiResponse) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'An error occurred during the request.';
    const errorDetails = error.response?.data || null;

    // Log error details for debugging
    console.error('Axios Error:', message, errorDetails);

    return res.status(status).json({
      message,
      ...(errorDetails && { error: errorDetails }), // Include detailed error response if available
    });
  }

  // Handle non-Axios errors
  console.error('Unexpected Error:', error);
  return res.status(500).json({
    message: 'An unexpected error occurred.',
  });
}
