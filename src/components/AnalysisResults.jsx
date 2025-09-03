import React from 'react';
import { Dna, Sparkles, CreditCard, RotateCcw, Lock, Unlock } from 'lucide-react';

const AnalysisResults = ({ data, paidForDetailed, onPurchaseDetailed, onStartOver }) => {
  const { basicResults, detailedResults, snps } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
          <Dna className="w-12 h-12 text-cyan-400 mx-auto" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Your DNA Analysis Results
        </h1>
        <p className="text-white/80">
          We've identified {snps.length} SNPs and analyzed {basicResults.length} genetic traits
        </p>
      </div>

      {/* Basic Results (Free) */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Unlock className="w-5 h-5 mr-2 text-green-400" />
            Basic Trait Analysis
          </h2>
          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
            Included
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicResults.map((trait, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white text-sm">{trait.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  trait.confidence === 'High' 
                    ? 'bg-green-500/20 text-green-400'
                    : trait.confidence === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {trait.confidence}
                </span>
              </div>
              <p className="text-white/70 text-sm mb-2">{trait.prediction}</p>
              <p className="text-white/50 text-xs">{trait.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SNP Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Dna className="w-5 h-5 mr-2 text-purple-400" />
          Identified SNPs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {snps.slice(0, 8).map((snp, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-cyan-400 font-mono text-sm font-semibold">{snp.id}</div>
              <div className="text-white/60 text-xs mt-1">Position: {snp.position}</div>
              <div className="text-white/60 text-xs">Allele: {snp.allele}</div>
            </div>
          ))}
        </div>
        
        {snps.length > 8 && (
          <p className="text-white/60 text-sm mt-4 text-center">
            + {snps.length - 8} more SNPs identified
          </p>
        )}
      </div>

      {/* Detailed Results (Paid) */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Lock className="w-5 h-5 mr-2 text-purple-400" />
            Detailed Trait Report
          </h2>
          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
            Premium $2.00
          </span>
        </div>

        {!paidForDetailed ? (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">Unlock Detailed Insights</h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Get comprehensive trait analysis, health predispositions, ancestry insights, 
              and personalized recommendations based on your genetic profile.
            </p>
            <button
              onClick={onPurchaseDetailed}
              className="btn-primary flex items-center mx-auto"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Purchase Detailed Report - $2.00
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detailedResults.map((trait, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white">{trait.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trait.confidence === 'High' 
                      ? 'bg-green-500/20 text-green-400'
                      : trait.confidence === 'Medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trait.confidence}
                  </span>
                </div>
                <p className="text-white/80 mb-3">{trait.prediction}</p>
                <p className="text-white/60 text-sm mb-3">{trait.description}</p>
                <div className="bg-white/5 rounded p-3">
                  <h4 className="text-white/80 font-medium text-sm mb-1">Scientific Basis:</h4>
                  <p className="text-white/60 text-xs">{trait.scientificBasis}</p>
                </div>
                {trait.recommendation && (
                  <div className="mt-3 bg-cyan-500/10 border border-cyan-500/30 rounded p-3">
                    <h4 className="text-cyan-400 font-medium text-sm mb-1">Recommendation:</h4>
                    <p className="text-cyan-300 text-xs">{trait.recommendation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="text-center">
        <button
          onClick={onStartOver}
          className="btn-secondary flex items-center mx-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Analyze Another Sequence
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;