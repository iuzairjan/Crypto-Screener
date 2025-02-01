import { KlineData, SymbolData, IndicatorData } from '../types/binance';
import { calculateRSI, calculateMACD, calculateEMA } from '../utils/indicators';
import { BINANCE_API } from './api/endpoints';
import { fetchKlines } from './api/klineService';

export class BinanceService {
  private ws: WebSocket | null = null;
  private subscribers: ((data: any) => void)[] = [];

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.ws = new WebSocket(BINANCE_API.WS_URL);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.subscribers.forEach(callback => callback(data));
    };

    this.ws.onclose = () => {
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  async getKlines(
    symbol: string,
    interval: string,
    limit: number = 100
  ): Promise<KlineData[]> {
    return fetchKlines(symbol, interval, limit);
  }

  async get24hrStats(): Promise<SymbolData[]> {
    const response = await fetch(`${BINANCE_API.BASE_URL}${BINANCE_API.endpoints.TICKER_24HR}`);
    const data = await response.json();
    return data
      .filter((item: any) => item.symbol.endsWith('USDT'))
      .map((item: any) => ({
        symbol: item.symbol,
        priceChange: item.priceChange,
        priceChangePercent: item.priceChangePercent,
        volume: item.volume,
        quoteVolume: item.quoteVolume,
        lastPrice: item.lastPrice,
        high24h: item.highPrice,
        low24h: item.lowPrice,
        openPrice: item.openPrice,
        volatility: parseFloat(item.priceChangePercent)
      }));
  }

  async getIndicators(symbol: string, interval: string): Promise<IndicatorData> {
    const klines = await this.getKlines(symbol, interval, 100);
    const closes = klines.map(k => parseFloat(k.close));
    
    return {
      rsi: calculateRSI(closes),
      macd: calculateMACD(closes),
      ema20: calculateEMA(closes, 20),
      ema50: calculateEMA(closes, 50)
    };
  }

  subscribeToTicker(callback: (data: any) => void) {
    this.subscribers.push(callback);
  }

  unsubscribeFromTicker(callback: (data: any) => void) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }
}