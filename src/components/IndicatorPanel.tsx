import React from 'react';
import { IndicatorData } from '../types/binance';

interface IndicatorPanelProps {
  data: IndicatorData;
}

export default function IndicatorPanel({ data }: IndicatorPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">RSI (14)</h3>
          <div className="flex items-center mt-1">
            <div className="w-full bg-gray-200 rounded h-2">
              <div
                className={`rounded h-2 ${getRSIColor(data.rsi)}`}
                style={{ width: `${data.rsi}%` }}
              />
            </div>
            <span className="ml-2 text-sm font-medium">{data.rsi.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">MACD</h3>
          <div className="grid grid-cols-2 gap-2 text-sm mt-1">
            <div>
              <span className="text-gray-500">MACD:</span>
              <span className={`ml-2 ${data.macd.macd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.macd.macd.toFixed(4)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Signal:</span>
              <span className="ml-2">{data.macd.signal.toFixed(4)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Moving Averages</h3>
          <div className="grid grid-cols-2 gap-2 text-sm mt-1">
            <div>
              <span className="text-gray-500">EMA 20:</span>
              <span className="ml-2">{data.ema20.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-gray-500">EMA 50:</span>
              <span className="ml-2">{data.ema50.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRSIColor(rsi: number): string {
  if (rsi >= 70) return 'bg-red-500';
  if (rsi <= 30) return 'bg-green-500';
  return 'bg-blue-500';
}