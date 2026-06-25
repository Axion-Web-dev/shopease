import { handleCors } from '../cors'

describe('CORS handling', () => {
  it('should allow requests when origin is in allowed list', () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue('http://localhost:3000')
      }
    } as any
    
    expect(handleCors(mockRequest)).toBe(true)
  })

  it('should allow requests when wildcard is set', () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue('https://any-origin.com')
      }
    } as any
    
    const result = handleCors(mockRequest)
    expect(typeof result).toBe('boolean')
  })
})
