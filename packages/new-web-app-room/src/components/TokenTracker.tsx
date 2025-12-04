'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, TrendingUp, TrendingDown, Wallet, Activity, Bell, Search } from 'lucide-react';
import TokenCard from './TokenCard';
import TokenChart from './TokenChart';
import WalletConnect from './WalletConnect';
import PriceAlerts from './PriceAlerts';
import { fetchTokenData, fetchTokenPrice, fetchTokenMetrics } from '@/lib/tokenApi';

// Default XAVA token
const XAVA_TOKEN = {
  address: '0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4',
  symbol: 'XAVA',
  name: 'Xava Token',
  decimals: 18,
  network: 'avalanche'
};

export default function TokenTracker() {
  const [watchlist, setWatchlist] = useState([XAVA_TOKEN]);
  const [selectedToken, setSelectedToken] = useState(XAVA_TOKEN);
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  // Fetch token data for watchlist
  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['tokens', watchlist.map(t => t.address)],
    queryFn: () => Promise.all(watchlist.map(token => fetchTokenData(token.address))),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch detailed metrics for selected token
  const { data: selectedTokenMetrics } = useQuery({
    queryKey: ['tokenMetrics', selectedToken.address],
    queryFn: () => fetchTokenMetrics(selectedToken.address),
    refetchInterval: 15000,
  });

  const addToken = async () => {
    if (!newTokenAddress) return;
    
    try {
      const tokenInfo = await fetchTokenData(newTokenAddress);
      const newToken = {
        address: newTokenAddress,
        symbol: tokenInfo.symbol || 'UNKNOWN',
        name: tokenInfo.name || 'Unknown Token',
        decimals: tokenInfo.decimals || 18,
        network: 'avalanche'
      };
      
      if (!watchlist.find(t => t.address.toLowerCase() === newTokenAddress.toLowerCase())) {
        setWatchlist([...watchlist, newToken]);
      }
      setNewTokenAddress('');
    } catch (error) {
      console.error('Error adding token:', error);
    }
  };

  const removeToken = (address: string) => {
    if (address === XAVA_TOKEN.address) return; // Don't allow removing XAVA
    setWatchlist(watchlist.filter(t => t.address !== address));
    if (selectedToken.address === address) {
      setSelectedToken(XAVA_TOKEN);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/10 backdrop-blur-md rounded-lg p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-gray-300 hover:bg-white/30'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'wallet' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-gray-300 hover:bg-white/30'
            }`}
          >
            <Wallet className="w-4 h-4 inline mr-2" />
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'alerts' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-gray-300 hover:bg-white/30'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Alerts
          </button>
        </div>

        {/* Add Token */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter token contract address..."
            value={newTokenAddress}
            onChange={(e) => setNewTokenAddress(e.target.value)}
            className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={addToken}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token Watchlist */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Watchlist</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-6 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {watchlist.map((token, index) => (
                  <TokenCard
                    key={token.address}
                    token={token}
                    data={tokenData?.[index]}
                    isSelected={selectedToken.address === token.address}
                    onSelect={() => setSelectedToken(token)}
                    onRemove={() => removeToken(token.address)}
                    canRemove={token.address !== XAVA_TOKEN.address}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Token Details & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Token Overview */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedToken.name}</h2>
                  <p className="text-gray-300">{selectedToken.symbol}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    ${selectedTokenMetrics?.price?.toFixed(6) || '0.000000'}
                  </div>
                  <div className={`flex items-center ${
                    (selectedTokenMetrics?.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(selectedTokenMetrics?.priceChange24h || 0) >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {selectedTokenMetrics?.priceChange24h?.toFixed(2) || '0.00'}%
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Market Cap</div>
                  <div className="text-white font-semibold">
                    ${selectedTokenMetrics?.marketCap?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">24h Volume</div>
                  <div className="text-white font-semibold">
                    ${selectedTokenMetrics?.volume24h?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Total Supply</div>
                  <div className="text-white font-semibold">
                    {selectedTokenMetrics?.totalSupply?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Holders</div>
                  <div className="text-white font-semibold">
                    {selectedTokenMetrics?.holders?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <TokenChart tokenAddress={selectedToken.address} />
          </div>
        </div>
      )}

      {activeTab === 'wallet' && (
        <WalletConnect 
          connectedWallet={connectedWallet}
          onConnect={setConnectedWallet}
          watchlist={watchlist}
        />
      )}

      {activeTab === 'alerts' && (
        <PriceAlerts watchlist={watchlist} />
      )}
    </div>
  );
}
