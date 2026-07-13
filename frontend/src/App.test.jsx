import { render, screen } from '@testing-library/react';
import App from './App';

test('renders GitGGu editor title', () => {
  render(<App />);
  expect(screen.getByText('GitGGu')).toBeInTheDocument();
});
