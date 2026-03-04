import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      language: 'en',

      // Onboarding data
      onboarding: {
        landType: '',
        state: '',
        requirement: '',
        farmSize: '',
      },

      // Analysis results (simulated)
      cropRecommendation: null,
      diseaseResult: null,
      yieldData: null,
      riskLevel: 'medium',

      // Actions
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, cropRecommendation: null, diseaseResult: null }),

      setLanguage: (lang) => set({ language: lang }),

      updateOnboarding: (data) => set((s) => ({
        onboarding: { ...s.onboarding, ...data }
      })),

      setCropRecommendation: (data) => set({ cropRecommendation: data }),
      setDiseaseResult: (data) => set({ diseaseResult: data }),
      setYieldData: (data) => set({ yieldData: data }),
      setRiskLevel: (level) => set({ riskLevel: level }),
    }),
    { name: 'krishishield-store', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated, language: s.language, onboarding: s.onboarding }) }
  )
)

// Mock API helpers (replace with real axios calls to FastAPI backend)
export const api = {
  analyzeCrop: async (params) => {
    await new Promise(r => setTimeout(r, 1400))
    const crops = ['Maize', 'Soybean', 'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Sugarcane', 'Chickpea']
    const idx = Math.floor((params.nitrogen / 200) * crops.length) % crops.length
    return {
      recommendations: [
        { name: crops[idx],             confidence: 87, risk: 'low',  roi: '₹28,000–₹35,000' },
        { name: crops[(idx+1)%8],       confidence: 74, risk: 'medium', roi: '₹22,000–₹29,000' },
        { name: crops[(idx+2)%8],       confidence: 61, risk: 'high', roi: '₹38,000–₹50,000' },
      ],
      riskScore: 42,
      rainfallDeviation: '+12%',
      insight: 'Based on your soil pH and current rainfall, the top crop is optimal for this season.',
    }
  },
  detectDisease: async (file) => {
    await new Promise(r => setTimeout(r, 1800))
    const diseases = [
      { name: 'Leaf Blight (Helminthosporium)', confidence: 91, severity: 22, level: 'moderate', yieldLoss: '14–18%', financialImpact: '₹4,200', treatments: [ { name: 'Mancozeb 75% WP', dose: '2g/litre water', urgency: 'High', recovery: 75 }, { name: 'Neem Oil Spray', dose: '5ml/litre weekly', urgency: 'Medium', recovery: 60 }, { name: 'Remove Affected Leaves', dose: 'Immediately', urgency: 'High', recovery: 80 } ] },
      { name: 'Powdery Mildew', confidence: 85, severity: 15, level: 'mild', yieldLoss: '8–12%', financialImpact: '₹2,100', treatments: [ { name: 'Sulfur Dust', dose: '25g/10L water', urgency: 'Medium', recovery: 70 }, { name: 'Potassium Bicarbonate', dose: '15g/L water', urgency: 'Low', recovery: 65 } ] },
      { name: 'Stem Rot (Fusarium)', confidence: 88, severity: 38, level: 'severe', yieldLoss: '25–32%', financialImpact: '₹8,400', treatments: [ { name: 'Carbendazim 50% WP', dose: '1g/litre water', urgency: 'Critical', recovery: 55 }, { name: 'Trichoderma viride', dose: '4g/kg seed', urgency: 'High', recovery: 60 } ] },
    ]
    return diseases[Math.floor(Math.random() * diseases.length)]
  },
}
