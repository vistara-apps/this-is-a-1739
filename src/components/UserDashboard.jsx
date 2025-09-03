import React, { useState } from 'react';
import { X, User, History, Settings, LogOut } from 'lucide-react';
import UserProfile from './UserProfile';
import AnalysisHistory from './AnalysisHistory';
import { useAuth } from '../hooks/useAuth';
import { loadAnalysisById } from '../services/storageService';

/**
 * User Dashboard Component
 * 
 * Displays user profile, analysis history, and settings.
 */
const UserDashboard = ({ onClose, onSelectAnalysis }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { isAuthenticated, logout } = useAuth();
  
  const handleAnalysisSelect = (analysisId) => {
    try {
      const analysis = loadAnalysisById(analysisId);
      if (analysis && onSelectAnalysis) {
        onSelectAnalysis(analysis);
        if (onClose) onClose();
      }
    } catch (err) {
      console.error('Failed to load analysis:', err);
    }
  };
  
  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };
  
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
          <div className="text-center py-8">
            <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Not Logged In</h2>
            <p className="text-white/70 mb-6">
              Please connect your wallet to access your dashboard.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Your Dashboard</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile' 
                ? 'text-white border-b-2 border-cyan-400' 
                : 'text-white/60 hover:text-white/90'
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'history' 
                ? 'text-white border-b-2 border-cyan-400' 
                : 'text-white/60 hover:text-white/90'
            }`}
          >
            <History className="w-4 h-4 mr-2" />
            Analysis History
          </button>
          <div className="flex-grow"></div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-sm font-medium text-white/60 hover:text-white/90 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <UserProfile onClose={onClose} />
          )}
          
          {activeTab === 'history' && (
            <AnalysisHistory onSelectAnalysis={handleAnalysisSelect} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
