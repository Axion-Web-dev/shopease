import { hashPassword, verifyPassword } from '../auth'

describe('Password hashing', () => {
  it('should hash a password', () => {
    const password = 'testPassword123'
    const hash = hashPassword(password)
    
    expect(hash).toContain(':')
    expect(hash.length).toBeGreaterThan(32)
  })

  it('should verify correct password', () => {
    const password = 'testPassword123'
    const hash = hashPassword(password)
    
    expect(verifyPassword(password, hash)).toBe(true)
  })

  it('should reject incorrect password', () => {
    const password = 'testPassword123'
    const wrongPassword = 'wrongPassword'
    const hash = hashPassword(password)
    
    expect(verifyPassword(wrongPassword, hash)).toBe(false)
  })

  it('should handle invalid hash format', () => {
    const password = 'testPassword123'
    const invalidHash = 'invalid-hash'
    
    expect(verifyPassword(password, invalidHash)).toBe(false)
  })
})
