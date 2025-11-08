import { NextApiResponse } from 'next';
import axios from 'axios';
import { serialize } from 'cookie';

export function handleAxiosError(error: unknown, res: NextApiResponse) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'An error occurred during the request.';
    const errorDetails = error.response?.data || null;

    console.error('Axios Error:', message, errorDetails);

    // Handle 401 Unauthorized: remove token
    if (status === 401) {
      res.setHeader('Set-Cookie', [
        serialize('token', '', {
          path: '/',
          expires: new Date(0), // Expire immediately
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        }),
      ]);

      return res.status(401).json({ message: 'Unauthorized. Redirect to login.' });
    }

    // Otherwise respond normally
    return res.status(status).json({
      message,
      ...(errorDetails && { error: errorDetails }),
    });
  }

  // Non-Axios errors
  console.error('Unexpected Error:', error);
  return res.status(500).json({
    message: 'An unexpected error occurred.',
  });
}
