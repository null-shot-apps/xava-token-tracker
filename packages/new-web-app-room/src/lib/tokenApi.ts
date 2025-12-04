import axios from 'axios';

// Mock data for demonstration - in production, you'd use real APIs
const MOCK_TOKEN_DATA = {
  '0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4': {
    symbol: 'XAVA',
    name: 'Xava Token',
    decimals: 18,
    price: 0.000123,
    priceChange24h: 5.67,
    volume24h: 125000,
    marketCap: 2500000,
    totalSupply: 1000000000,
    holders: 1250
  }
};

export interface TokenData {
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
}

export interface TokenMetrics {
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  totalSupply: number;
  holders: number;
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface WalletBalance {
  balance: string;
  usdValue: number;
}

// Fetch basic token data
export async function fetchTokenData(address: string): Promise<TokenData> {
  try {
    // For XAVA token, return mock data
    if (address.toLowerCase() === '0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4') {
      const mockData = MOCK_TOKEN_DATA[address.toLowerCase() as keyof typeof MOCK_TOKEN_DATA];
      return {
        symbol: mockData.symbol,
        name: mockData.name,
        decimals: mockData.decimals,
        price: mockData.price + (Math.random() - 0.5) * 0.00001, // Add some variation
        priceChange24h: mockData.priceChange24h + (Math.random() - 0.5) * 2,
        volume24h: mockData.volume24h + Math.random() * 10000,
        marketCap: mockData.marketCap + Math.random() * 100000
      };
    }

    // For other tokens, try to fetch from a public API or return mock data
    // In production, you'd use APIs like:
    // - CoinGecko API
    // - Moralis API
    // - Alchemy API
    // - Avalanche C-Chain API
    
    // For now, return mock data for any token
    return {
      symbol: 'TOKEN',
      name: 'Custom Token',
      decimals: 18,
      price: Math.random() * 0.001,
      priceChange24h: (Math.random() - 0.5) * 20,
      volume24h: Math.random() * 50000,
      marketCap: Math.random() * 1000000
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
}

// Fetch detailed token metrics
export async function fetchTokenMetrics(address: string): Promise<TokenMetrics> {
  try {
    if (address.toLowerCase() === '0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4') {
      const mockData = MOCK_TOKEN_DATA[address.toLowerCase() as keyof typeof MOCK_TOKEN_DATA];
      return {
        price: mockData.price + (Math.random() - 0.5) * 0.00001,
        priceChange24h: mockData.priceChange24h + (Math.random() - 0.5) * 2,
        volume24h: mockData.volume24h + Math.random() * 10000,
        marketCap: mockData.marketCap + Math.random() * 100000,
        totalSupply: mockData.totalSupply,
        holders: mockData.holders + Math.floor(Math.random() * 10)
      };
    }

    return {
      price: Math.random() * 0.001,
      priceChange24h: (Math.random() - 0.5) * 20,
      volume24h: Math.random() * 50000,
      marketCap: Math.random() * 1000000,
      totalSupply: Math.random() * 1000000000,
      holders: Math.floor(Math.random() * 5000)
    };
  } catch (error) {
    console.error('Error fetching token metrics:', error);
    throw error;
  }
}

// Fetch token price history
export async function fetchTokenPriceHistory(address: string, timeframe: string): Promise<PricePoint[]> {
  try {
    // Generate mock price history data
    const now = Date.now();
    const points: PricePoint[] = [];
    
    let intervals: number;
    let intervalMs: number;
    
    switch (timeframe) {
      case '1h':
        intervals = 60;
        intervalMs = 60 * 1000; // 1 minute
        break;
      case '24h':
        intervals = 24;
        intervalMs = 60 * 60 * 1000; // 1 hour
        break;
      case '7d':
        intervals = 7;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '30d':
        intervals = 30;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '90d':
        intervals = 90;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      default:
        intervals = 24;
        intervalMs = 60 * 60 * 1000;
    }

    const basePrice = address.toLowerCase() === '0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4' 
      ? 0.000123 
      : Math.random() * 0.001;

    for (let i = intervals; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      const variation = (Math.random() - 0.5) * 0.1; // 10% variation
      const price = basePrice * (1 + variation);
      
      points.push({
        timestamp,
        price: Math.max(0, price)
      });
    }

    return points;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
}

// Fetch current token price
export async function fetchTokenPrice(address: string): Promise<number> {
  try {
    const data = await fetchTokenData(address);
    return data.price;
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
}

// Fetch wallet balances for tokens
export async function fetchWalletBalances(walletAddress: string, tokenAddresses: string[]): Promise<WalletBalance[]> {
  try {
    // In production, you'd use APIs like:
    // - Moralis API
    // - Alchemy API
    // - Avalanche C-Chain API
    // - Ethers.js with RPC calls
    
    // For now, return mock balances
    return tokenAddresses.map(address => {
      const balance = Math.random() * 1000;
      const price = address.toLowerCase() === '0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4' 
        ? 0.000123 
        : Math.random() * 0.001;
      
      return {
        balance: balance.toFixed(6),
        usdValue: balance * price
      };
    });
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    throw error;
  }
}

// Utility function to format large numbers
export function formatNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

// Utility function to format price
export function formatPrice(price: number): string {
  if (price < 0.000001) {
    return price.toExponential(2);
  }
  if (price < 0.01) {
    return price.toFixed(6);
  }
  if (price < 1) {
    return price.toFixed(4);
  }
  return price.toFixed(2);
}
