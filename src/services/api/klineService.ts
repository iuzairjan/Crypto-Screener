import { KlineData } from '../../types/binance';
import { BINANCE_API } from './endpoints';

export async function fetchKlines(
  symbol: string,
  interval: string,
  limit: number
): Promise<KlineData[]> {
  const url = `${BINANCE_API.BASE_URL}${BINANCE_API.endpoints.KLINES}?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await fetch(url);
  const data = await response.json();
  
  return data.map((item: any[]) => ({
    openTime: item[0],
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
    volume: item[5],
    closeTime: item[6]
  }));
}