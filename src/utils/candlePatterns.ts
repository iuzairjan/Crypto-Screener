import { KlineData, CandlePattern } from '../types/binance';
import { isDoji, isHammer, isInvertedHammer } from './patterns/basicPatterns';
import {
  isMorningStar,
  isBullishEngulfing,
  isPiercingLine,
  isThreeWhiteSoldiers,
  isBullishHarami,
  isTweezerBottom,
  isRisingThreeMethods
} from './patterns/complexPatterns';

export function analyzeCandlePatterns(klines: KlineData[]): CandlePattern[] {
  const patterns: CandlePattern[] = [];
  
  // Basic patterns
  if (isDoji(klines[klines.length - 1])) {
    patterns.push({
      pattern: 'Doji',
      strength: 6,
      description: 'Indicates market indecision, potential trend reversal'
    });
  }

  if (isHammer(klines[klines.length - 1])) {
    patterns.push({
      pattern: 'Hammer',
      strength: 7,
      description: 'Bullish reversal pattern indicating potential bottom'
    });
  }

  if (isInvertedHammer(klines[klines.length - 1])) {
    patterns.push({
      pattern: 'Inverted Hammer',
      strength: 6,
      description: 'Bullish reversal pattern often seen at market bottoms'
    });
  }

  // Complex patterns
  if (isMorningStar(klines)) {
    patterns.push({
      pattern: 'Morning Star',
      strength: 8,
      description: 'Strong bullish reversal pattern indicating market bottom'
    });
  }

  if (isBullishEngulfing(klines)) {
    patterns.push({
      pattern: 'Bullish Engulfing',
      strength: 8,
      description: 'Strong bullish reversal showing buyers taking control'
    });
  }

  if (isPiercingLine(klines)) {
    patterns.push({
      pattern: 'Piercing Line',
      strength: 7,
      description: 'Bullish reversal pattern showing strong buying pressure'
    });
  }

  if (isThreeWhiteSoldiers(klines)) {
    patterns.push({
      pattern: 'Three White Soldiers',
      strength: 9,
      description: 'Very strong bullish reversal indicating sustained buying'
    });
  }

  if (isBullishHarami(klines)) {
    patterns.push({
      pattern: 'Bullish Harami',
      strength: 6,
      description: 'Moderate bullish reversal showing potential trend change'
    });
  }

  if (isTweezerBottom(klines)) {
    patterns.push({
      pattern: 'Tweezer Bottom',
      strength: 7,
      description: 'Bullish reversal showing support level formation'
    });
  }

  if (isRisingThreeMethods(klines)) {
    patterns.push({
      pattern: 'Rising Three Methods',
      strength: 8,
      description: 'Bullish continuation pattern confirming uptrend'
    });
  }

  return patterns;
}