import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sprout, ShieldCheck, BarChart2, Camera, FlaskConical, FileText, ChevronDown } from 'lucide-react'

const features = [
  { icon: '🌱', title: 'Smart Crop Recommendation', desc: 'Random Forest ML model suggests top 3 crops based on soil N, P, K, pH, temperature, humidity & rainfall.' },
  { icon: '⛈️', title: 'Risk-Aware Analysis',       desc: 'Rainfall deviation, temperature suitability scoring & live risk meter with Green / Yellow / Red indicators.' },
  { icon: '📷', title: 'AI Disease Detection',       desc: 'Upload a crop photo to detect disease name, confidence score & instant treatment recommendations.' },
  { icon: '📊', title: 'Damage Severity Estimation', desc: 'OpenCV color-based detection classifies damage as Mild (<10%), Moderate (10–30%), or Severe (>30%).' },
  { icon: '💹', title: 'Yield Loss Estimator',       desc: 'Estimates yield reduction % and approximate financial impact using crop type & sensitivity factors.' },
  { icon: '🧪', title: 'What-If Simulator',          desc: 'Modify rainfall, price & severity to instantly recalculate risk level, yield impact & profit projection.' },
  { icon: '📄', title: 'Downloadable Health Report', desc: 'Auto-generated PDF with all findings — crop recommendation, disease, severity & action plan.' },
  { icon: '💊', title: 'Treatment Recommendations',  desc: 'For each detected disease: suggested treatment type, urgency level, and estimated recovery chance.' },
  { icon: '🌐', title: 'Hindi / English Toggle',     desc: 'Bilingual interface supports English and Hindi so every farmer can use it comfortably.' },
]

const steps = [
  { n: '01', title: 'Sign Up',        desc: 'Create account & select language preference' },
  { n: '02', title: 'Enter Farm Data', desc: 'Share soil N/P/K/pH, weather & location' },
  { n: '03', title: 'AI Analysis',    desc: 'Our Random Forest model crunches all parameters' },
  { n: '04', title: 'Get Report',     desc: 'Download complete crop health PDF report' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="font-body bg-white min-h-screen">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌾</span>
          <span className="font-display font-bold text-white text-xl">KrishiShield</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#features" className="nav-link hidden md:block">Features</a>
          <a href="#how"      className="nav-link hidden md:block">How it Works</a>
          <button onClick={() => navigate('/login')}
            className="bg-forest-500 hover:bg-forest-400 text-white font-semibold px-5 py-2 rounded-full text-sm transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-hero-farm bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-forest-500/20 border border-forest-400/40 text-forest-300 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-forest-400 rounded-full animate-pulse"></span>
            AI-Powered Agricultural Intelligence
          </div>

          <h1 className="font-display text-white font-bold leading-tight mb-5 animate-fade-up"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)' }}>
            Smart Crop Planning &amp;{' '}
            <span className="text-forest-400">Risk-Aware</span>{' '}
            Decision Support
          </h1>

          <p className="text-forest-200 text-lg leading-relaxed mb-8 max-w-xl mx-auto animate-fade-up delay-100">
            AI-powered crop recommendations based on soil analysis, weather patterns, and market insights — built for India's farmers.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-up delay-200">
            <button onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-forest-500 hover:bg-forest-400 text-white font-bold px-8 py-3.5 rounded-full text-base transition-all shadow-lg hover:shadow-forest-500/40 hover:shadow-xl">
              Get Crop Recommendation
              <ArrowRight size={18} />
            </button>
            <a href="#features"
              className="flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all">
              Learn More
              <ChevronDown size={18} />
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 grid grid-cols-4 border-t border-white/10 backdrop-blur-md bg-black/40">
          {[['95%','Model Accuracy'],['22+','Crop Types'],['12','Risk Factors'],['Free','For Farmers']].map(([v,l]) => (
            <div key={l} className="text-center py-5 border-r border-white/10 last:border-0">
              <div className="text-forest-400 font-display font-bold text-2xl">{v}</div>
              <div className="text-white/60 text-xs uppercase tracking-wider mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-forest-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sprout size={13} /> Complete Feature Set
            </div>
            <h2 className="section-title mb-3">Everything You Need to <span className="text-forest-500">Grow Smarter</span></h2>
            <p className="text-forest-500 text-lg max-w-xl mx-auto">A complete connected agricultural intelligence system — from soil to harvest</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} onClick={() => navigate('/login')}
                className="bg-white rounded-2xl p-6 border border-forest-100 hover:border-forest-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-forest-800 mb-2 group-hover:text-forest-600">{f.title}</h3>
                <p className="text-forest-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6 bg-forest-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-white mb-3">How KrishiShield Works</h2>
            <p className="text-forest-400 text-lg">Four simple steps to smarter farming decisions</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-forest-600 hidden md:block" />
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-forest-500 text-white font-display font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-forest-900/40 relative z-10">
                  {s.n}
                </div>
                <h4 className="text-white font-semibold mb-2">{s.title}</h4>
                <p className="text-forest-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-forest-600 to-forest-700 text-center">
        <div className="max-w-xl mx-auto">
          <ShieldCheck size={48} className="text-forest-300 mx-auto mb-5" />
          <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Farm Smarter?</h2>
          <p className="text-forest-200 text-lg mb-8">Join thousands of farmers across India already using KrishiShield</p>
          <button onClick={() => navigate('/login')}
            className="bg-white text-forest-700 hover:bg-forest-50 font-bold px-10 py-4 rounded-full text-base transition-all shadow-xl hover:shadow-2xl">
            Get Started Free →
          </button>
        </div>
      </section>

      <footer className="bg-forest-900 text-forest-500 text-center py-6 text-sm">
        © 2025 KrishiShield · AI-Powered Crop Decision & Damage Intelligence System
      </footer>
    </div>
  )
}
