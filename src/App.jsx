import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import PaymentModal from './components/PaymentModal';
import { mockAnalyzeDNA } from './utils/dnaAnalysis';

function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analyzing, results
  const [analysisData, setAnalysisData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paidForDetailed, setPaidForDetailed] = useState(false);

  const handleFileUpload = async (sequence) => {
    setCurrentStep('analyzing');
    
    // Simulate API call delay
    setTimeout(() => {
      const results = mockAnalyzeDNA(sequence);
      setAnalysisData(results);
      setCurrentStep('results');
    }, 3000);
  };

  const handlePurchaseDetailed = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setPaidForDetailed(true);
    setShowPaymentModal(false);
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setAnalysisData(null);
    setPaidForDetailed(false);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {currentStep === 'upload' && (
          <>
            <Hero />
            <FileUpload onFileUpload={handleFileUpload} />
          </>
        )}
        
        {currentStep === 'analyzing' && (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 dna-helix rounded-full"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your DNA</h2>
              <p className="text-white/80">Scanning for SNPs and genetic patterns...</p>
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
          />
        )}
      </main>

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default App;