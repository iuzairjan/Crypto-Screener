import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { BinanceService } from '../services/binanceService';
import { SymbolData, KlineData } from '../types/binance';
import { analyzeCandlePatterns } from '../utils/candlePatterns';
import PatternFilter from './PatternFilter';

const timeFrames = ['15m', '1h', '4h', '1d'];

interface EnhancedSymbolData extends SymbolData {
  patterns: string[];
}

export default function CryptoList() {
  const [symbols, setSymbols] = useState<EnhancedSymbolData[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('15m');
  const [selectedPattern, setSelectedPattern] = useState('all');
  const [loading, setLoading] = useState(false);
  const binanceService = new BinanceService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await binanceService.get24hrStats();
        
        // Sort by volatility and get top 20
        let topStats = stats
          .sort((a, b) => Math.abs(parseFloat(b.priceChangePercent)) - Math.abs(parseFloat(a.priceChangePercent)))
          .slice(0, 20);

        // Fetch klines and analyze patterns for each symbol
        const symbolsWithPatterns = await Promise.all(
          topStats.map(async (stat) => {
            const klines = await binanceService.getKlines(stat.symbol, selectedTimeFrame, 100);
            const patterns = analyzeCandlePatterns(klines);
            return {
              ...stat,
              patterns: patterns.map(p => p.pattern)
            };
          })
        );

        // Filter by selected pattern if not 'all'
        const filteredSymbols = selectedPattern === 'all'
          ? symbolsWithPatterns
          : symbolsWithPatterns.filter(symbol => 
              symbol.patterns.includes(selectedPattern)
            );

        setSymbols(filteredSymbols);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [selectedTimeFrame, selectedPattern]);

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Top 20 USDT Pairs</h1>
          <div className="flex gap-4">
            <PatternFilter
              selectedPattern={selectedPattern}
              onPatternChange={setSelectedPattern}
            />
            <div className="flex gap-2">
              {timeFrames.map(tf => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeFrame(tf)}
                  className={`px-4 py-2 rounded ${
                    selectedTimeFrame === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {symbols.map(symbol => (
            <Link
              key={symbol.symbol}
              to={`/crypto/${symbol.symbol}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{symbol.symbol}</h2>
                <span className={`flex items-center ${
                  parseFloat(symbol.priceChangePercent) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {parseFloat(symbol.priceChangePercent) >= 0 ? (
                    <ArrowUpCircle className="w-5 h-5 mr-1" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5 mr-1" />
                  )}
                  {Math.abs(parseFloat(symbol.priceChangePercent)).toFixed(2)}%
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Price:</span>
                  <span className="ml-2">${parseFloat(symbol.lastPrice).toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Volume:</span>
                  <span className="ml-2">{parseFloat(symbol.volume).toFixed(2)}</span>
                </div>
              </div>
              {symbol.patterns.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-blue-600">
                    Patterns: {symbol.patterns.join(', ')}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}