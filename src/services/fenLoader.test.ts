import {loadFromFEN} from './fenLoader';

describe('fenLoader', () => {
  test('empty string should thorw error', () => {
    expect(() => {
      loadFromFEN('');
    }).toThrow();
  });

  test('should thorw error if not has 8 lines', () => {
    expect(() => {
      loadFromFEN('///');
    }).toThrowError('Invalid FEN string: ///');
  });

  test('output must have 64 length', () => {
    const input = '7k/8/7B/8/8/8/8/';
    expect(() => {
      expect(loadFromFEN(input));
    }).toThrowError(`Invalid FEN string: ${input}`);
  });
});
