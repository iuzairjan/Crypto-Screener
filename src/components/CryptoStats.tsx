import React from 'react';
import { DetailedSymbolData } from '../types/binance';

interface CryptoStatsProps {
  data: DetailedSymbolData | null;
}

export default function CryptoStats({ data }: CryptoStatsProps) {
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem label="Price" value={`$${parseFloat(data.lastPrice).toFixed(4)}`} />
        <StatItem label="24h High" value={`$${parseFloat(data.high24h).toFixed(4)}`} />
        <StatItem label="24h Low" value={`$${parseFloat(data.low24h).toFixed(4)}`} />
        <StatItem label="24h Change" 
          value={`${parseFloat(data.priceChangePercent).toFixed(2)}%`}
          className={parseFloat(data.priceChangePercent) >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <StatItem label="Open" value={`$${parseFloat(data.openPrice).toFixed(4)}`} />
        <StatItem label="Volume" value={parseFloat(data.volume).toFixed(2)} />
        <StatItem label="Quote Volume" value={parseFloat(data.quoteVolume).toFixed(2)} />
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  className?: string;
}

function StatItem({ label, value, className = '' }: StatItemProps) {
  return (
    <div className="p-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${className}`}>{value}</div>
    </div>
  );
}