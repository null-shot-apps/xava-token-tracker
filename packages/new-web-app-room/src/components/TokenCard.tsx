'use client';

import { TrendingUp, TrendingDown, X } from 'lucide-react';

interface TokenCardProps {
  token: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    network: string;
  };
  data?: {
    price: number;
    priceChange24h: number;
    volume24h: number;
    marketCap: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

export default function TokenCard({ 
  token, 
  data, 
  isSelected, 
  onSelect, 
  onRemove, 
  canRemove 
}: TokenCardProps) {
  const priceChange = data?.priceChange24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div
      className={`relative bg-white/10 backdrop-blur-md rounded-lg p-4 cursor-pointer transition-all hover:bg-white/20 ${
        isSelected ? 'ring-2 ring-purple-500 bg-white/20' : ''
      }`}
      onClick={onSelect}
    >
      {canRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold text-white">{token.symbol}</h3>
          <p className="text-sm text-gray-400 truncate max-w-[120px]">{token.name}</p>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold">
            ${data?.price?.toFixed(6) || '0.000000'}
          </div>
          <div className={`flex items-center text-sm ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-400">Vol 24h:</span>
          <div className="text-white">
            ${data?.volume24h?.toLocaleString() || 'N/A'}
          </div>
        </div>
        <div>
          <span className="text-gray-400">Market Cap:</span>
          <div className="text-white">
            ${data?.marketCap?.toLocaleString() || 'N/A'}
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {token.address.slice(0, 6)}...{token.address.slice(-4)}
      </div>
    </div>
  );
}
