import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Dna, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Dna className="w-8 h-8 text-cyan-400" />
              <Sparkles className="w-4 h-4 text-purple-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">GeneGroove</h1>
              <p className="text-xs text-white/60 hidden sm:block">Uncover Your DNA's Fun Secrets</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-white/80">
              Scans from $0.25 • Detailed Reports $2.00
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;