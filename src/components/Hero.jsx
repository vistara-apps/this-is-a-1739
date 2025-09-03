import React from 'react';
import { Dna, Zap, Shield, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="text-center py-16">
      <div className="relative mb-8">
        <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
          <Dna className="w-16 h-16 text-cyan-400 mx-auto animate-float" />
        </div>
        <Sparkles className="w-6 h-6 text-purple-400 absolute top-0 right-0 animate-pulse" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
        Uncover Your DNA's
        <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Fun Secrets
        </span>
      </h1>
      
      <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
        Upload your DNA sequence and discover fascinating traits hidden in your genetic code. 
        From taste preferences to unique characteristics - science meets fun!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Fast Analysis</h3>
          <p className="text-sm text-white/70">Get results in minutes with our advanced SNP identification</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Privacy First</h3>
          <p className="text-sm text-white/70">Your genetic data is processed securely and never stored</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Fun Insights</h3>
          <p className="text-sm text-white/70">Discover quirky traits and fascinating genetic patterns</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;