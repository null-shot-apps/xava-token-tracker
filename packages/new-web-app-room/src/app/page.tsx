'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TokenTracker from '@/components/TokenTracker';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              XAVA Token Tracker
            </h1>
            <p className="text-gray-300 text-lg">
              Track $XAVA and custom tokens on Avalanche blockchain
            </p>
          </header>
          <TokenTracker />
        </div>
      </div>
    </QueryClientProvider>
  );
}

