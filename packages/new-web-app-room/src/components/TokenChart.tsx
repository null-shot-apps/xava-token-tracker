'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchTokenPriceHistory } from '@/lib/tokenApi';

interface TokenChartProps {
  tokenAddress: string;
}

export default function TokenChart({ tokenAddress }: TokenChartProps) {
  const [timeframe, setTimeframe] = useState('24h');

  const { data: priceHistory, isLoading } = useQuery({
    queryKey: ['priceHistory', tokenAddress, timeframe],
    queryFn: () => fetchTokenPriceHistory(tokenAddress, timeframe),
    refetchInterval: 60000, // Refresh every minute
  });

  const timeframes = [
    { label: '1H', value: '1h' },
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Price Chart</h3>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeframe === tf.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : priceHistory && priceHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (timeframe === '1h' || timeframe === '24h') {
                    return date.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                  }
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  });
                }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${value.toFixed(6)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleString();
                }}
                formatter={(value: number) => [`$${value.toFixed(6)}`, 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-lg mb-2">No chart data available</div>
              <div className="text-sm">Price history will appear here when available</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
