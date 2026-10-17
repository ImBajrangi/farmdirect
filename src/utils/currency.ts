/**
 * Exact integer paise currency formatting for Indian financial accuracy.
 * Never uses floating point math for prices.
 * ₹1 = 100 paise.
 */

export function paiseToRupees(paise: number): number {
  return Math.floor(paise) / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function formatPaise(paise: number, locale: 'en' | 'hi' = 'en'): string {
  const safePaise = Math.max(0, Math.round(paise));
  const rupees = safePaise / 100;

  if (locale === 'hi') {
    // Hindi currency formatting with Indian grouping (₹1,500.00)
    return `₹${rupees.toLocaleString('hi-IN', {
      minimumFractionDigits: safePaise % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `₹${rupees.toLocaleString('en-IN', {
      minimumFractionDigits: safePaise % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
  })}`;
}

export function formatWeight(
  quantity: number,
  unit: string,
  locale: 'en' | 'hi' = 'en'
): string {
  if (locale === 'hi') {
    const unitMap: Record<string, string> = {
      kg: 'कि.ग्रा.',
      gram: 'ग्राम',
      piece: 'नग',
      dozen: 'डझन',
      quintal: 'क्विंटल',
      crate: 'क्रेट',
    };
    return `${quantity} ${unitMap[unit] || unit}`;
  }
  return `${quantity} ${unit}`;
}
