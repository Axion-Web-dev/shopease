import { env } from '../env'

describe('Environment validation', () => {
  it('should have required environment variables', () => {
    expect(env.NODE_ENV).toBeDefined()
    expect(env.DATABASE_URL).toBeDefined()
    expect(env.SESSION_SECRET).toBeDefined()
    expect(env.ALLOWED_ORIGINS).toBeDefined()
  })

  it('should have valid NODE_ENV', () => {
    expect(['development', 'production', 'test']).toContain(env.NODE_ENV)
  })

  it('should have SESSION_SECRET of sufficient length', () => {
    expect(env.SESSION_SECRET.length).toBeGreaterThanOrEqual(32)
  })

  it('should have valid DATABASE_URL', () => {
    expect(env.DATABASE_URL).toMatch(/^postgresql:\/\//)
  })
})
