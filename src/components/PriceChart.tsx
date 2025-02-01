import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, CandlestickData } from 'lightweight-charts';
import { KlineData } from '../types/binance';

interface PriceChartProps {
  data: KlineData[];
  onChartReady?: (chart: IChartApi) => void;
}

export default function PriceChart({ data, onChartReady }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const candleData: CandlestickData[] = data.map((kline) => ({
      time: kline.openTime / 1000,
      open: parseFloat(kline.open),
      high: parseFloat(kline.high),
      low: parseFloat(kline.low),
      close: parseFloat(kline.close),
    }));

    candlestickSeries.setData(candleData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    if (onChartReady) {
      onChartReady(chart);
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, onChartReady]);

  return <div ref={chartContainerRef} className="w-full" />;
}