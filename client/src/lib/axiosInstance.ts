import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function createAxiosInstance(token?: string) {
  return axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
