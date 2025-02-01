import { KlineData } from '../../types/binance';

export function isMorningStar(candles: KlineData[]): boolean {
  if (candles.length < 3) return false;
  
  const [first, second, third] = candles.slice(-3);
  const firstBearish = parseFloat(first.close) < parseFloat(first.open);
  const thirdBullish = parseFloat(third.close) > parseFloat(third.open);
  const secondSmallBody = Math.abs(parseFloat(second.close) - parseFloat(second.open)) < 
    Math.abs(parseFloat(first.close) - parseFloat(first.open)) * 0.3;
  
  return firstBearish && secondSmallBody && thirdBullish;
}

export function isBullishEngulfing(candles: KlineData[]): boolean {
  if (candles.length < 2) return false;
  
  const [prev, current] = candles.slice(-2);
  return parseFloat(prev.close) < parseFloat(prev.open) && // Previous bearish
         parseFloat(current.close) > parseFloat(current.open) && // Current bullish
         parseFloat(current.open) < parseFloat(prev.close) && // Opens below previous close
         parseFloat(current.close) > parseFloat(prev.open); // Closes above previous open
}

export function isPiercingLine(candles: KlineData[]): boolean {
  if (candles.length < 2) return false;
  
  const [prev, current] = candles.slice(-2);
  const prevBody = parseFloat(prev.open) - parseFloat(prev.close);
  const currBody = parseFloat(current.close) - parseFloat(current.open);
  const penetration = currBody / prevBody;
  
  return prevBody > 0 && currBody > 0 && // Previous bearish, current bullish
         parseFloat(current.open) < parseFloat(prev.close) && // Opens below previous close
         penetration > 0.5; // Closes above 50% of previous body
}

export function isThreeWhiteSoldiers(candles: KlineData[]): boolean {
  if (candles.length < 3) return false;
  
  const allBullish = candles.slice(-3).every(candle => 
    parseFloat(candle.close) > parseFloat(candle.open)
  );
  
  const increasingCloses = 
    parseFloat(candles[2].close) > parseFloat(candles[1].close) &&
    parseFloat(candles[1].close) > parseFloat(candles[0].close);
  
  return allBullish && increasingCloses;
}

export function isBullishHarami(candles: KlineData[]): boolean {
  if (candles.length < 2) return false;
  
  const [prev, current] = candles.slice(-2);
  return parseFloat(prev.close) < parseFloat(prev.open) && // Previous bearish
         parseFloat(current.close) > parseFloat(current.open) && // Current bullish
         parseFloat(current.open) > parseFloat(prev.close) && // Opens inside previous body
         parseFloat(current.close) < parseFloat(prev.open); // Closes inside previous body
}

export function isTweezerBottom(candles: KlineData[]): boolean {
  if (candles.length < 2) return false;
  
  const [prev, current] = candles.slice(-2);
  const sameLow = Math.abs(parseFloat(prev.low) - parseFloat(current.low)) < 
    parseFloat(current.low) * 0.001; // 0.1% tolerance
  
  return parseFloat(prev.close) < parseFloat(prev.open) && // Previous bearish
         parseFloat(current.close) > parseFloat(current.open) && // Current bullish
         sameLow;
}

export function isRisingThreeMethods(candles: KlineData[]): boolean {
  if (candles.length < 5) return false;
  
  const [first, ...rest] = candles.slice(-5);
  const lastCandle = rest[3];
  
  const firstBullish = parseFloat(first.close) > parseFloat(first.open);
  const lastBullish = parseFloat(lastCandle.close) > parseFloat(lastCandle.open);
  const containedBodies = rest.slice(0, 3).every(candle => 
    parseFloat(candle.high) < parseFloat(first.high) &&
    parseFloat(candle.low) > parseFloat(first.low)
  );
  
  return firstBullish && containedBodies && lastBullish &&
         parseFloat(lastCandle.close) > parseFloat(first.close);
}