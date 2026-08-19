import '@testing-library/jest-dom/vitest';
import { afterAll, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());
