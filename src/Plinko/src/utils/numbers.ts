import type { RowCount } from '../types';
import { computed } from 'vue';
import Decimal from 'decimal.js';
/**
 * Calculate the probabilities of a ball falling into each bin (from left to right).
 *
 * It follows a [binomial distribution](https://en.wikipedia.org/wiki/Binomial_distribution),
 * where the probability of a ball falling into `k`th bin after `n` rows is:
 *
 * ```text
 * Pr(k; n, p) = C(n, k) * p^k * (1 - p)^(n - k)
 * ```
 *
 * , where `C(n, k) = n! / (k! * (n - k)!)` and `p = 0.5`.
 */
export function computeBinProbabilities(rowCount: RowCount): number[] {
  const p = 0.5; // probability of success on a single trial
  const probabilities:number[] = [];

  for (let k = 0; k <= rowCount; k++) {
    const binomialCoefficient = factorial(rowCount) / (factorial(k) * factorial(rowCount - k));
    const probability = binomialCoefficient * Math.pow(p, k) * Math.pow(1 - p, rowCount - k);
    probabilities.push(probability);
  }

  return probabilities;
}

/**
 * Converts `valueA` from `scaleA` to `scaleB`.
 *
 * @example
 * convertScale(0.25, [0, 1], [0, 100]); // 25
 */
export function convertScale(
  valueA: number,
  scaleA: [number, number],
  scaleB: [number, number],
): number {
  const [minA, maxA] = scaleA;
  const [minB, maxB] = scaleB;

  const percentage = (valueA - minA) / (maxA - minA);
  const valueB = percentage * (maxB - minB) + minB;

  return valueB;
}

/**
 * Counts how many times each value occurs in the given array.
 */
export function countValueOccurrences<T extends string | number>(values: T[]): Record<T, number> {
  const result = {} as Record<T, number>;
  for (const value of values) {
    result[value] = (result[value] || 0) + 1;
  }
  return result;
}

/**
 * Computes the dot product of two vectors.
 *
 * @remarks The two vectors must have the same length.
 *
 * @example
 * const a = [1, 2, 3];
 * const b = [4, 5, 6];
 * dotProduct(a, b); // 32  (1*4 + 2*5 + 3*6)
 */
export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((acc, value, index) => acc + value * b[index], 0);
}

export function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * @example
 * formatCurrency(123456.789); // "$123,456.79"
 * formatCurrency(2); // "$2.00"
 * formatCurrency(-2); // "-$2.00"
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'USD',
  });
}

/**
 * Gets a random number in the range of `[min, max]`.
 */
export function getRandomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export const getRandomElement = (array) => {
  if (!array || typeof array.length !== 'number' || array.length === 0) {
    throw new Error("Invalid array provided");
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};




export function useFormattedNumber(getter: () => number, setter: (value: number) => void, decimals = 6) {
  return computed({
    get() {
      const value = parseFloat(getter());
      return isNaN(value) ? '0.00000000' : new Decimal(value).toFixed(decimals);
    },
    set(newValue) {
      const parsedValue = parseFloat(newValue);
      setter(isNaN(parsedValue) ? 0 : parseFloat(new Decimal(parsedValue).toFixed(decimals)));
    },
  });
}


// 截斷到小數點後8位數
export const truncateToDecimals = (value: number, decimals: number = 8): number => {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
};



export const filterNonNumeric = (event) => {
  const input = event.target;
  const { value, selectionStart } = input; // 保存當前值和游標位置

  // 過濾掉非數字、小數點、+、- 的字符
  const sanitizedValue = value.replace(/[^0-9.]/g, '');

  // 確保只有一個小數點
  const decimalMatch = sanitizedValue.match(/\./g);
  const filteredValue =
    decimalMatch && decimalMatch.length > 1
      ? sanitizedValue.substring(0, sanitizedValue.lastIndexOf('.'))
      : sanitizedValue;

  // 更新輸入框的值
  input.value = filteredValue;

  // 修復游標位置
  const cursorOffset = value.length - filteredValue.length; // 計算字符長度變化
  const newCursorPosition = Math.max(selectionStart - cursorOffset, 0); // 調整游標位置
  input.setSelectionRange(newCursorPosition, newCursorPosition);
};
