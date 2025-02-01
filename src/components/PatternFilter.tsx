import React from 'react';

const patterns = [
  { id: 'all', name: 'All Patterns' },
  { id: 'doji', name: 'Doji' },
  { id: 'hammer', name: 'Hammer' },
  { id: 'invertedHammer', name: 'Inverted Hammer' },
  { id: 'morningStar', name: 'Morning Star' },
  { id: 'bullishEngulfing', name: 'Bullish Engulfing' },
  { id: 'piercingLine', name: 'Piercing Line' },
  { id: 'threeWhiteSoldiers', name: 'Three White Soldiers' },
  { id: 'bullishHarami', name: 'Bullish Harami' },
  { id: 'tweezerBottom', name: 'Tweezer Bottom' },
  { id: 'risingThreeMethods', name: 'Rising Three Methods' }
];

interface PatternFilterProps {
  selectedPattern: string;
  onPatternChange: (pattern: string) => void;
}

export default function PatternFilter({ selectedPattern, onPatternChange }: PatternFilterProps) {
  return (
    <select
      value={selectedPattern}
      onChange={(e) => onPatternChange(e.target.value)}
      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {patterns.map(pattern => (
        <option key={pattern.id} value={pattern.id}>
          {pattern.name}
        </option>
      ))}
    </select>
  );
}