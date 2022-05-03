import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PunkApi component', () => {
  render(<App />);
  expect(screen.getByTestId('punk-api')).toBeTruthy();
});
