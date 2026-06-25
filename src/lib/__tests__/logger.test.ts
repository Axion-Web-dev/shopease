import { logger } from '../logger'

describe('Logger', () => {
  it('should have log methods', () => {
    expect(logger.debug).toBeDefined()
    expect(logger.info).toBeDefined()
    expect(logger.warn).toBeDefined()
    expect(logger.error).toBeDefined()
  })

  it('should log info messages', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    logger.info('Test message')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should log error messages', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    logger.error('Test error', new Error('Test'))
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
