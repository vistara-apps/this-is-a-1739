import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';

const FileUpload = ({ onFileUpload, error: externalError, onClearError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sequence, setSequence] = useState('');
  const [error, setError] = useState('');
  
  // Sync external errors with internal state
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const validateFASTA = (text) => {
    // Basic FASTA validation
    const lines = text.trim().split('\n');
    if (lines.length < 2) return false;
    if (!lines[0].startsWith('>')) return false;
    
    const sequence = lines.slice(1).join('').toUpperCase();
    return /^[ATCGN]+$/.test(sequence);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (validateFASTA(content)) {
        setError('');
        if (onClearError) onClearError();
        onFileUpload(content);
      } else {
        setError('Invalid FASTA format. Please ensure your file starts with ">" and contains only valid DNA bases (A, T, C, G).');
      }
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again with a different file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleTextSubmit = () => {
    if (validateFASTA(sequence)) {
      setError('');
      if (onClearError) onClearError();
      onFileUpload(sequence);
    } else {
      setError('Invalid FASTA format. Please ensure your sequence starts with ">" and contains only valid DNA bases (A, T, C, G).');
    }
  };

  const sampleFASTA = `>Sample DNA Sequence
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
TCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGA
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG`;

  const loadSample = () => {
    setSequence(sampleFASTA);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Upload Your DNA Sequence
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Upload FASTA File</h3>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragging 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-white/30 hover:border-white/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <p className="text-white/80 mb-4">
                Drag & drop your FASTA file here, or
              </p>
              <label className="btn-primary cursor-pointer inline-block">
                Choose File
                <input
                  type="file"
                  accept=".fasta,.fa,.txt"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </label>
              <p className="text-sm text-white/60 mt-2">
                Supports .fasta, .fa, .txt files
              </p>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Paste Sequence</h3>
              <button
                onClick={loadSample}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              placeholder="Paste your FASTA sequence here..."
              className="w-full h-48 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none resize-none font-mono text-sm"
            />
            <button
              onClick={handleTextSubmit}
              disabled={!sequence.trim()}
              className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4 mr-2" />
              Analyze Sequence
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-200 text-sm flex-grow">{error}</p>
            <button 
              onClick={() => {
                setError('');
                if (onClearError) onClearError();
              }}
              className="text-red-300 hover:text-red-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <h4 className="text-white font-medium mb-2">FASTA Format Example:</h4>
          <pre className="text-sm text-white/80 font-mono">
{`>Sequence Name
ATCGATCGATCGATCG...`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
