import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BinanceService } from '../services/binanceService';
import { KlineData, CandlePattern, IndicatorData, DetailedSymbolData } from '../types/binance';
import { analyzeCandlePatterns } from '../utils/candlePatterns';
import IndicatorPanel from './IndicatorPanel';
import CryptoStats from './CryptoStats';
import PriceChart from './PriceChart';

export default function CryptoDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [patterns, setPatterns] = useState<CandlePattern[]>([]);
  const [indicators, setIndicators] = useState<IndicatorData | null>(null);
  const [symbolData, setSymbolData] = useState<DetailedSymbolData | null>(null);
  const binanceService = new BinanceService();

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      const [klines, stats, indicators] = await Promise.all([
        binanceService.getKlines(symbol, '15m', 100),
        binanceService.get24hrStats(),
        binanceService.getIndicators(symbol, '15m')
      ]);
      
      setKlineData(klines);
      setPatterns(analyzeCandlePatterns(klines));
      
      const symbolStats = stats.find(s => s.symbol === symbol);
      if (symbolStats) {
        setSymbolData(symbolStats as DetailedSymbolData);
      }
      setIndicators(indicators);
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{symbol} Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CryptoStats data={symbolData} />
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
            {klineData.length > 0 && <PriceChart data={klineData} />}
          </div>
        </div>

        <div className="space-y-4">
          {indicators && <IndicatorPanel data={indicators} />}

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Candlestick Patterns</h2>
            {patterns.map((pattern, index) => (
              <div key={index} className="mb-4 p-3 bg-blue-50 rounded">
                <h3 className="font-semibold text-lg">{pattern.pattern}</h3>
                <p className="text-gray-600">{pattern.description}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Strength: </span>
                  <div className="w-full bg-gray-200 rounded h-2 mt-1">
                    <div
                      className="bg-blue-600 rounded h-2"
                      style={{ width: `${(pattern.strength / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}