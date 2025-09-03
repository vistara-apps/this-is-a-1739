import React, { useState, useEffect } from 'react';
import { Dna, Calendar, ChevronRight, Search, AlertCircle } from 'lucide-react';
import { loadAnalyses } from '../services/storageService';
import ErrorMessage from './ErrorMessage';

/**
 * Analysis History Component
 * 
 * Displays a list of past DNA analyses.
 */
const AnalysisHistory = ({ onSelectAnalysis }) => {
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load analyses on mount
  useEffect(() => {
    try {
      const loadedAnalyses = loadAnalyses();
      setAnalyses(loadedAnalyses);
      setFilteredAnalyses(loadedAnalyses);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load analysis history');
      setIsLoading(false);
    }
  }, []);
  
  // Filter analyses when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAnalyses(analyses);
      return;
    }
    
    const filtered = analyses.filter(analysis => 
      analysis.sequenceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredAnalyses(filtered);
  }, [searchTerm, analyses]);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-white/70">Loading analysis history...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
      <h2 className="text-xl font-bold text-white flex items-center mb-6">
        <Dna className="w-5 h-5 mr-2 text-cyan-400" />
        Your Analysis History
      </h2>
      
      {error && (
        <ErrorMessage 
          error={error} 
          onDismiss={() => setError(null)} 
          className="mb-4"
        />
      )}
      
      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-white/40" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search analyses..."
          className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
        />
      </div>
      
      {/* Analysis List */}
      {filteredAnalyses.length > 0 ? (
        <div className="space-y-3">
          {filteredAnalyses.map((analysis, index) => (
            <button
              key={index}
              onClick={() => onSelectAnalysis(analysis.analysisId)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-colors text-left flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-white text-sm">
                  {analysis.sequenceName || `Analysis #${index + 1}`}
                </h3>
                <div className="flex items-center text-white/60 text-xs mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(analysis.timestamp)}
                  <span className="mx-2">•</span>
                  <span>{analysis.sequenceLength.toLocaleString()} bp</span>
                  {analysis.paymentStatus === 'paid_detailed' && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-purple-400">Detailed</span>
                    </>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          {searchTerm ? (
            <>
              <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/70 mb-1">No analyses match your search</p>
              <p className="text-white/50 text-sm">Try a different search term</p>
            </>
          ) : (
            <>
              <Dna className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/70 mb-1">No analysis history yet</p>
              <p className="text-white/50 text-sm">Upload a DNA sequence to get started</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;

