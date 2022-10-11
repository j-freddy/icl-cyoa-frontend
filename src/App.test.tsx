import { render, screen } from '@testing-library/react';
import App from './App';

test('renders heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to create your own adventure book!/i);
  expect(linkElement).toBeInTheDocument();
});
