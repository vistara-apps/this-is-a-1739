// Mock DNA analysis functions
// In a real app, this would connect to GenoBank.io or similar API

const SNP_DATABASE = [
  { id: 'rs1815739', position: 23423, allele: 'T', trait: 'Muscle Fiber Type' },
  { id: 'rs713598', position: 45234, allele: 'C', trait: 'Bitter Taste Sensitivity' },
  { id: 'rs4680', position: 67845, allele: 'A', trait: 'Stress Response' },
  { id: 'rs1805007', position: 89456, allele: 'T', trait: 'Hair Color' },
  { id: 'rs12913832', position: 123567, allele: 'G', trait: 'Eye Color' },
  { id: 'rs6152', position: 156789, allele: 'C', trait: 'Androgen Sensitivity' },
  { id: 'rs4994', position: 178901, allele: 'A', trait: 'Addiction Risk' },
  { id: 'rs53576', position: 201234, allele: 'G', trait: 'Social Behavior' },
  { id: 'rs1426654', position: 223456, allele: 'A', trait: 'Skin Pigmentation' },
  { id: 'rs885479', position: 245678, allele: 'T', trait: 'Hair Thickness' },
];

const BASIC_TRAITS = [
  {
    name: 'Muscle Fiber Composition',
    prediction: 'Fast-twitch dominant',
    description: 'You likely excel at explosive, short-duration activities.',
    confidence: 'High'
  },
  {
    name: 'Bitter Taste Sensitivity',
    prediction: 'High sensitivity',
    description: 'You probably dislike bitter foods like coffee or dark chocolate.',
    confidence: 'Medium'
  },
  {
    name: 'Stress Response',
    prediction: 'Enhanced under pressure',
    description: 'You tend to perform better when stress levels are moderate.',
    confidence: 'High'
  },
  {
    name: 'Morning Alertness',
    prediction: 'Night owl tendency',
    description: 'You likely feel more alert and productive in the evening.',
    confidence: 'Medium'
  },
  {
    name: 'Hair Texture',
    prediction: 'Straight hair likely',
    description: 'Your genetic variants suggest naturally straight hair.',
    confidence: 'High'
  },
  {
    name: 'Earwax Type',
    prediction: 'Wet type',
    description: 'You most likely have wet, sticky earwax.',
    confidence: 'High'
  }
];

const DETAILED_TRAITS = [
  {
    name: 'Athletic Performance Potential',
    prediction: 'Optimized for power sports',
    description: 'Your genetic profile suggests natural advantages in activities requiring explosive power and strength.',
    confidence: 'High',
    scientificBasis: 'Based on ACTN3 gene variants that affect fast-twitch muscle fiber distribution and mitochondrial efficiency.',
    recommendation: 'Consider incorporating high-intensity interval training and power-based exercises into your fitness routine.'
  },
  {
    name: 'Caffeine Metabolism',
    prediction: 'Slow metabolizer',
    description: 'You likely feel caffeine effects for longer periods and may be more sensitive to its stimulating effects.',
    confidence: 'Medium',
    scientificBasis: 'CYP1A2 gene variants affect how quickly your liver processes caffeine.',
    recommendation: 'Limit caffeine intake in the afternoon to avoid sleep disruption. Consider smaller, more frequent doses.'
  },
  {
    name: 'Stress Resilience',
    prediction: 'High resilience under acute stress',
    description: 'You tend to maintain cognitive performance better than average during stressful situations.',
    confidence: 'High',
    scientificBasis: 'COMT gene variants affect dopamine breakdown in the prefrontal cortex during stress.',
    recommendation: 'Leverage your stress resilience in challenging situations, but ensure adequate recovery time.'
  },
  {
    name: 'Skin Sun Sensitivity',
    prediction: 'Moderate sensitivity',
    description: 'You have intermediate risk for sun damage and should use appropriate sun protection.',
    confidence: 'Medium',
    scientificBasis: 'MC1R and related gene variants influence melanin production and UV protection capacity.',
    recommendation: 'Use SPF 30+ sunscreen daily and limit direct sun exposure during peak hours (10am-4pm).'
  },
  {
    name: 'Omega-3 Fatty Acid Needs',
    prediction: 'Higher requirements',
    description: 'Your genetic variants suggest you may benefit from increased omega-3 fatty acid intake.',
    confidence: 'Medium',
    scientificBasis: 'FADS gene variants affect how efficiently you convert plant-based omega-3s to EPA and DHA.',
    recommendation: 'Include fatty fish 2-3 times per week or consider a high-quality omega-3 supplement.'
  },
  {
    name: 'Carbohydrate Sensitivity',
    prediction: 'Lower tolerance',
    description: 'You may be more prone to blood sugar spikes and benefit from complex carbohydrates.',
    confidence: 'Medium',
    scientificBasis: 'TCF7L2 and other diabetes-related gene variants affect insulin sensitivity and glucose metabolism.',
    recommendation: 'Focus on low-glycemic index foods and pair carbohydrates with protein or healthy fats.'
  }
];

function extractSequence(fastaText) {
  const lines = fastaText.trim().split('\n');
  return lines.slice(1).join('').toUpperCase().replace(/\s/g, '');
}

function findSNPs(sequence) {
  // Mock SNP detection - in reality this would be much more complex
  const foundSNPs = [];
  
  SNP_DATABASE.forEach(snp => {
    // Simulate finding SNPs based on sequence length and content
    if (sequence.length > snp.position && Math.random() > 0.3) {
      foundSNPs.push({
        ...snp,
        position: Math.floor(Math.random() * sequence.length),
        confidence: Math.random() > 0.5 ? 'High' : 'Medium'
      });
    }
  });
  
  return foundSNPs;
}

export function mockAnalyzeDNA(fastaInput) {
  const sequence = extractSequence(fastaInput);
  const snps = findSNPs(sequence);
  
  // Shuffle and select random subsets for variety
  const shuffledBasic = [...BASIC_TRAITS].sort(() => Math.random() - 0.5);
  const shuffledDetailed = [...DETAILED_TRAITS].sort(() => Math.random() - 0.5);
  
  return {
    sequenceLength: sequence.length,
    snps: snps,
    basicResults: shuffledBasic.slice(0, 6),
    detailedResults: shuffledDetailed,
    processingTime: Math.floor(Math.random() * 3000) + 1000 // 1-4 seconds
  };
}