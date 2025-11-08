export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include', // Important for sending cookies
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.href = '/login';
    return Promise.reject(new Error('Unauthorized'));
  }

  return res;
}
