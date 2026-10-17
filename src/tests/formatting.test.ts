import { describe, it, expect } from 'vitest';
import { formatPaise, rupeesToPaise, paiseToRupees, formatWeight } from '../lib/formatting/currency';
import { sanitizeSlug } from '../lib/formatting/slug';

describe('Financial Math & Integer Paise Integrity', () => {
  it('converts rupees to exact integer paise without floating point error', () => {
    expect(rupeesToPaise(12.5)).toBe(1250);
    expect(rupeesToPaise(28.0)).toBe(2800);
    expect(rupeesToPaise(950)).toBe(95000);
  });

  it('converts paise to rupees correctly', () => {
    expect(paiseToRupees(1250)).toBe(12.5);
    expect(paiseToRupees(2800)).toBe(28);
    expect(paiseToRupees(95000)).toBe(950);
  });

  it('formats paise with correct currency symbol and Indian numbering', () => {
    expect(formatPaise(2800, 'en')).toBe('₹28');
    expect(formatPaise(2850, 'en')).toBe('₹28.50');
    expect(formatPaise(95000, 'en')).toBe('₹950');
  });

  it('protects against negative amounts', () => {
    expect(formatPaise(-500, 'en')).toBe('₹0');
  });

  it('formats weight units in English and Hindi', () => {
    expect(formatWeight(5, 'kg', 'en')).toBe('5 kg');
    expect(formatWeight(5, 'kg', 'hi')).toBe('5 कि.ग्रा.');
    expect(formatWeight(1, 'piece', 'hi')).toBe('1 नग');
  });
});

describe('Devanagari URL Sanitization Rule', () => {
  it('correctly handles Devanagari text and avoids double-encoding loops', () => {
    const rawDevanagari = 'नाशिक-गावरान-लाल-कांदा';
    const slug1 = sanitizeSlug(rawDevanagari);
    expect(slug1).toBeTruthy();

    // Re-sanitizing must be idempotent and not cause %252F loops
    const slug2 = sanitizeSlug(slug1);
    expect(slug2).toBe(slug1);
  });

  it('cleans special characters and punctuations', () => {
    const input = 'Fresh Tomato! (Vein-Ripened) #1';
    const slug = sanitizeSlug(input);
    expect(slug).toBe('fresh-tomato-vein-ripened-1');
  });
});
