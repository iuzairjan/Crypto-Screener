import { KlineData } from '../../types/binance';

export function isDoji(candle: KlineData): boolean {
  const open = parseFloat(candle.open);
  const close = parseFloat(candle.close);
  const high = parseFloat(candle.high);
  const low = parseFloat(candle.low);
  
  const bodySize = Math.abs(open - close);
  const totalSize = high - low;
  
  return bodySize / totalSize < 0.1;
}

export function isHammer(candle: KlineData): boolean {
  const open = parseFloat(candle.open);
  const close = parseFloat(candle.close);
  const high = parseFloat(candle.high);
  const low = parseFloat(candle.low);
  
  const bodySize = Math.abs(open - close);
  const lowerWick = Math.min(open, close) - low;
  const upperWick = high - Math.max(open, close);
  
  return lowerWick > (bodySize * 2) && upperWick < bodySize;
}

export function isInvertedHammer(candle: KlineData): boolean {
  const open = parseFloat(candle.open);
  const close = parseFloat(candle.close);
  const high = parseFloat(candle.high);
  const low = parseFloat(candle.low);
  
  const bodySize = Math.abs(open - close);
  const lowerWick = Math.min(open, close) - low;
  const upperWick = high - Math.max(open, close);
  
  return upperWick > (bodySize * 2) && lowerWick < bodySize;
}