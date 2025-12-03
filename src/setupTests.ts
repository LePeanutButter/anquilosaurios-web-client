import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('$app/environment', () => ({
	browser: false
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$app/stores', () => ({
	page: { subscribe: vi.fn() },
	navigating: { subscribe: vi.fn() },
	updated: { subscribe: vi.fn() }
}));

vi.stubGlobal('console', {
	...console,
	error: () => {}
});
