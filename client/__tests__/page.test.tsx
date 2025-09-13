import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCounterStore } from '@/store/useCounterStore';
import Home from '../src/app/page';

// Reset store state before each test (important with Zustand)
beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

describe('Home Page Counter', () => {
  it('renders initial count and updates on button clicks', async () => {
    render(<Home />);

    // Check initial count
    expect(screen.getByText(/counter:/i)).toHaveTextContent('Counter: 0');

    // Get buttons
    const decreaseBtn = screen.getByRole('button', { name: '-' });
    const increaseBtn = screen.getByRole('button', { name: '+' });

    // Click increase and check count
    await userEvent.click(increaseBtn);
    expect(screen.getByText(/counter:/i)).toHaveTextContent('Counter: 1');

    // Click decrease and check count
    await userEvent.click(decreaseBtn);
    expect(screen.getByText(/counter:/i)).toHaveTextContent('Counter: 0');
  });
});
