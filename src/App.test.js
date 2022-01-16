import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import App from './App';

test('renders learn react link', () => {
  render(<Suspense>
		<App />
	</Suspense>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
