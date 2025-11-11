import React from 'react';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock the react-lottie library to prevent canvas errors in jsdom
vi.mock('react-lottie', () => ({
  __esModule: true,
  default: () => {
    return React.createElement('div', { 'data-testid': 'lottie-mock' });
  },
}));

afterEach(() => {
  cleanup();
});