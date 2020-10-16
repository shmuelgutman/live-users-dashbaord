import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('App renders login on application startup', () => {
  const { getByLabelText } = render(<App />);
  const usernameInputElement = getByLabelText(/Username/i);
  expect(usernameInputElement).toBeInTheDocument();
  const passwordInputElement = getByLabelText(/Password/i);
  expect(passwordInputElement).toBeInTheDocument();
  expect(passwordInputElement).toHaveAttribute('type', 'password');
});
