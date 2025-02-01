export interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

export interface SymbolData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  lastPrice: string;
  volatility: number;
}

export interface DetailedSymbolData extends SymbolData {
  high24h: string;
  low24h: string;
  openPrice: string;
}

export interface IndicatorData {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  ema20: number;
  ema50: number;
}

export interface CandlePattern {
  pattern: string;
  strength: number;
  description: string;
}