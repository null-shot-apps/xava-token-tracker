'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { fetchWalletBalances } from '@/lib/tokenApi';

interface WalletConnectProps {
  connectedWallet: string | null;
  onConnect: (wallet: string) => void;
  watchlist: Array<{
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    network: string;
  }>;
}

export default function WalletConnect({ connectedWallet, onConnect, watchlist }: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch wallet balances for watchlist tokens
  const { data: balances, isLoading } = useQuery({
    queryKey: ['walletBalances', connectedWallet, watchlist.map(t => t.address)],
    queryFn: () => connectedWallet ? fetchWalletBalances(connectedWallet, watchlist.map(t => t.address)) : null,
    enabled: !!connectedWallet,
    refetchInterval: 30000,
  });

  const connectWallet = () => {
    if (walletAddress.trim()) {
      onConnect(walletAddress.trim());
      setWalletAddress('');
    }
  };

  const disconnectWallet = () => {
    onConnect('');
  };

  const copyAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openInExplorer = (address: string) => {
    window.open(`https://snowtrace.io/address/${address}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wallet Connection */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Wallet Connection</h2>
        
        {!connectedWallet ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              Connect your wallet to view token balances and transaction history
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter wallet address (0x...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={connectWallet}
                disabled={!walletAddress.trim()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Wallet className="w-5 h-5 inline mr-2" />
                Connect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 mb-2">Connected Wallet</p>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">
                    {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openInExplorer(connectedWallet)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Token Balances */}
      {connectedWallet && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Token Balances</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-6 bg-white/20 rounded"></div>
                </div>
              ))}
            </div>
          ) : balances && balances.length > 0 ? (
            <div className="space-y-4">
              {watchlist.map((token, index) => {
                const balance = balances[index];
                return (
                  <div key={token.address} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{token.symbol}</h4>
                        <p className="text-sm text-gray-400">{token.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {balance?.balance || '0.00'} {token.symbol}
                        </div>
                        <div className="text-gray-400 text-sm">
                          ${balance?.usdValue?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No token balances found</p>
            </div>
          )}
        </div>
      )}

      {/* Transaction History */}
      {connectedWallet && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Transactions</h3>
          
          <div className="text-center text-gray-400 py-8">
            <div className="text-lg mb-2">Transaction history coming soon</div>
            <div className="text-sm">View recent token transfers and trades</div>
          </div>
        </div>
      )}
    </div>
  );
}
