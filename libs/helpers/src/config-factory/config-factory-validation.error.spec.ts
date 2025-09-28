import { ConfigFactoryValidationError } from './config-factory-validation.error';

describe('ConfigFactoryValidationError', () => {
  it('should be an instance of Error', () => {
    const err = new ConfigFactoryValidationError('invalid config');
    expect(err).toBeInstanceOf(Error);
  });

  it('should be an instance of ConfigFactoryValidationError', () => {
    const err = new ConfigFactoryValidationError('invalid config');
    expect(err).toBeInstanceOf(ConfigFactoryValidationError);
  });

  it('should set the correct name', () => {
    const err = new ConfigFactoryValidationError('invalid config');
    expect(err.name).toBe('ConfigFactoryValidationError');
  });

  it('should pass the message and cause correctly', () => {
    const cause = new Error('root cause');
    const err = new ConfigFactoryValidationError('invalid config', cause);
    expect(err.message).toBe('invalid config');
    expect(err.cause).toBe(cause);
  });
});
