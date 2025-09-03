import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import PaymentModal from './components/PaymentModal';
import useDnaAnalysis from './hooks/useDnaAnalysis';

function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analyzing, results
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paidForDetailed, setPaidForDetailed] = useState(false);
  const [error, setError] = useState(null);
  
  // Use our custom DNA analysis hook
  const { 
    isAnalyzing, 
    error: analysisError, 
    results: analysisData, 
    sequenceInfo,
    analyzeDNA, 
    getDetailedTraits, 
    resetAnalysis 
  } = useDnaAnalysis();
  
  // Update UI state based on analysis state
  useEffect(() => {
    if (isAnalyzing) {
      setCurrentStep('analyzing');
    } else if (analysisData) {
      setCurrentStep('results');
    }
    
    if (analysisError) {
      setError(analysisError);
      setCurrentStep('upload');
    }
  }, [isAnalyzing, analysisData, analysisError]);

  const handleFileUpload = async (sequence) => {
    setError(null);
    setCurrentStep('analyzing');
    
    try {
      // Use mock data in development, real API in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      await analyzeDNA(sequence, paidForDetailed, isDevelopment);
    } catch (err) {
      setError(err.message || 'Failed to analyze DNA sequence');
      setCurrentStep('upload');
    }
  };

  const handlePurchaseDetailed = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setPaidForDetailed(true);
    setShowPaymentModal(false);
    
    // If we already have analysis results, get detailed traits
    if (analysisData && analysisData.sequenceId && analysisData.snps) {
      try {
        setCurrentStep('analyzing');
        await getDetailedTraits(analysisData.sequenceId, analysisData.variantCallId);
      } catch (err) {
        setError(err.message || 'Failed to get detailed trait predictions');
      }
    }
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setPaidForDetailed(false);
    setError(null);
    resetAnalysis();
  };

  const handleSelectAnalysis = (analysis) => {
    if (!analysis) return;
    
    // Set analysis data and update UI state
    setCurrentStep('results');
    
    // Check if the analysis has detailed results
    if (analysis.hasDetailedResults()) {
      setPaidForDetailed(true);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header onSelectAnalysis={handleSelectAnalysis} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {currentStep === 'upload' && (
          <>
            <Hero />
            <FileUpload 
              onFileUpload={handleFileUpload} 
              error={error}
              onClearError={() => setError(null)}
            />
          </>
        )}
        
        {currentStep === 'analyzing' && (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 dna-helix rounded-full"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your DNA</h2>
              <p className="text-white/80">
                {sequenceInfo ? 
                  `Analyzing ${sequenceInfo.length} base pairs (${sequenceInfo.gcContent}% GC content)...` : 
                  'Scanning for SNPs and genetic patterns...'}
              </p>
              <div className="mt-4 w-48 mx-auto bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'results' && analysisData && (
          <AnalysisResults 
            data={analysisData}
            paidForDetailed={paidForDetailed}
            onPurchaseDetailed={handlePurchaseDetailed}
            onStartOver={handleStartOver}
            sequenceInfo={sequenceInfo}
          />
        )}
        
        {error && currentStep !== 'upload' && (
          <div className="max-w-md mx-auto mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
            <p className="text-red-200">{error}</p>
            <button 
              onClick={handleStartOver}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={2.00}
          itemDescription="Detailed DNA Analysis Report"
        />
      )}
    </div>
  );
}

export default App;
