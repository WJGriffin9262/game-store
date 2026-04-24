import { formatDate, formatPrice, truncateText } from './helpers';

describe('helpers', () => {
  test('formatPrice returns USD currency string', () => {
    expect(formatPrice(19.99)).toBe('$19.99');
  });

  test('truncateText shortens long text', () => {
    expect(truncateText('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefghij...');
  });

  test('formatDate returns readable month/day/year', () => {
    expect(formatDate('2024-01-15')).toContain('2024');
  });
});
