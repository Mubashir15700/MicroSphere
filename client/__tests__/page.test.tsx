import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page'; // adjust path if needed
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'; // for Link support

describe('LandingPage', () => {
  beforeEach(() => {
    render(<LandingPage />, { wrapper: MemoryRouterProvider });
  });

  it('renders the heading', () => {
    const heading = screen.getByRole('heading', { name: /task management made simple/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders subtext/description', () => {
    const description = screen.getByText(/stay organized and in control/i);
    expect(description).toBeInTheDocument();
  });

  it('renders Login and Register buttons with correct links', () => {
    const loginLink = screen.getByRole('link', { name: /login/i });
    const registerLink = screen.getByRole('link', { name: /register/i });

    expect(loginLink).toHaveAttribute('href', '/login');
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
