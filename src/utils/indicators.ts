export function calculateRSI(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 0;

  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);

  const avgGain = gains.slice(-period).reduce((sum, gain) => sum + gain) / period;
  const avgLoss = losses.slice(-period).reduce((sum, loss) => sum + loss) / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export function calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macd = ema12 - ema26;
  const signal = calculateEMA([macd], 9);
  const histogram = macd - signal;

  return { macd, signal, histogram };
}

export function calculateEMA(prices: number[], period: number): number {
  const multiplier = 2 / (period + 1);
  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}