'use client';

import { useState } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceAlert {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  type: 'above' | 'below';
  price: number;
  isActive: boolean;
  createdAt: Date;
}

interface PriceAlertsProps {
  watchlist: Array<{
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    network: string;
  }>;
}

export default function PriceAlerts({ watchlist }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    tokenAddress: '',
    type: 'above' as 'above' | 'below',
    price: ''
  });

  const addAlert = () => {
    if (!newAlert.tokenAddress || !newAlert.price) return;

    const token = watchlist.find(t => t.address === newAlert.tokenAddress);
    if (!token) return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      tokenAddress: newAlert.tokenAddress,
      tokenSymbol: token.symbol,
      type: newAlert.type,
      price: parseFloat(newAlert.price),
      isActive: true,
      createdAt: new Date()
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ tokenAddress: '', type: 'above', price: '' });
    setShowAddForm(false);
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Price Alerts</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Alert
          </button>
        </div>

        <p className="text-gray-300">
          Set up price alerts to get notified when your tokens reach target prices
        </p>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Alert</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Token</label>
              <select
                value={newAlert.tokenAddress}
                onChange={(e) => setNewAlert({ ...newAlert, tokenAddress: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select token</option>
                {watchlist.map(token => (
                  <option key={token.address} value={token.address} className="bg-gray-800">
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Alert Type</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as 'above' | 'below' })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="above" className="bg-gray-800">Price goes above</option>
                <option value="below" className="bg-gray-800">Price goes below</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Target Price ($)</label>
              <input
                type="number"
                step="0.000001"
                placeholder="0.000000"
                value={newAlert.price}
                onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={addAlert}
              disabled={!newAlert.tokenAddress || !newAlert.price}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Create Alert
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
        
        {alerts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No alerts set up</p>
            <p className="text-sm">Create your first price alert to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`bg-white/5 rounded-lg p-4 border-l-4 ${
                  alert.isActive 
                    ? alert.type === 'above' 
                      ? 'border-green-500' 
                      : 'border-red-500'
                    : 'border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      alert.type === 'above' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {alert.type === 'above' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {alert.tokenSymbol} {alert.type === 'above' ? 'above' : 'below'} ${alert.price.toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Created {alert.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        alert.isActive
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {alert.isActive ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-blue-400 font-semibold mb-1">How alerts work</h4>
            <p className="text-blue-300 text-sm">
              Alerts are checked every minute against current market prices. When triggered, 
              you'll see a notification in the dashboard. For real-time notifications, 
              consider enabling browser notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
