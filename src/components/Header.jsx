import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Dna, Sparkles, User, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';
import UserDashboard from './UserDashboard';

const Header = ({ onSelectAnalysis }) => {
  const { isAuthenticated, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-white/5 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-white/80">
              Scans from $0.25 • Detailed Reports $2.00
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUserDashboard(true)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-lg text-white"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
                <ConnectButton />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-lg text-white"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Login</span>
                </button>
                <ConnectButton />
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white p-2"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              <div className="text-sm text-white/80 py-2">
                Scans from $0.25 • Detailed Reports $2.00
              </div>
              
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setShowUserDashboard(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-lg text-white"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-lg text-white"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
              
              <div className="py-2">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      
      {showUserDashboard && (
        <UserDashboard 
          onClose={() => setShowUserDashboard(false)} 
          onSelectAnalysis={onSelectAnalysis}
        />
      )}
    </header>
  );
};

export default Header;
