import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock para $app/environment
vi.mock('$app/environment', () => ({
  browser: false
}));

// Mock para $app/navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

// Mock para $app/stores
vi.mock('$app/stores', () => ({
  page: { subscribe: vi.fn() },
  navigating: { subscribe: vi.fn() },
  updated: { subscribe: vi.fn() }
}));

vi.stubGlobal('console', {
  ...console,
  error: () => {}
});

