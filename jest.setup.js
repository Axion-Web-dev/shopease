import '@testing-library/jest-dom'

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.SESSION_SECRET = 'test-secret-for-testing-only-must-be-at-least-32-chars'
process.env.NODE_ENV = 'test'
process.env.ALLOWED_ORIGINS = 'http://localhost:3000'
