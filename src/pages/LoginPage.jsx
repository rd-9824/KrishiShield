import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

const LANGS = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'hi', flag: '🇮🇳', label: 'हिंदी' },
  { code: 'mr', flag: '🇮🇳', label: 'मराठी' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register, setLanguage, language } = useAppStore()
  const [form, setForm] = useState({ phone: '', password: '', name: '' })
  const [isRegister, setIsRegister] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.phone) { setError('Please enter your email'); return }
    if (!form.password) { setError('Please enter your password'); return }

    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await register({ username: form.name || form.phone.split('@')[0] || 'Farmer', email: form.phone, password: form.password });
      } else {
        await login({ email: form.phone, password: form.password });
      }
      navigate('/onboarding')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Authentication failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex font-body">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-farm bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900/80 via-forest-800/70 to-forest-700/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🌾</span>
            <span className="font-display font-bold text-white text-xl">KrishiShield</span>
          </Link>
          <div>
            <div className="text-forest-300 text-sm font-semibold uppercase tracking-widest mb-3">Smart Agriculture</div>
            <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
              Empowering farmers with AI-driven crop intelligence
            </h2>
            <p className="text-forest-200 text-lg leading-relaxed max-w-md">
              From soil analysis to disease detection — make smarter decisions every season.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[['95%','Accuracy'],['22+','Crops'],['Free','Always']].map(([v,l]) => (
                <div key={l} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="font-display font-bold text-white text-2xl">{v}</div>
                  <div className="text-forest-300 text-xs mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-forest-400 text-xs">© 2025 KrishiShield · AI-Powered Agricultural Intelligence</div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-forest-50">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={18} className="text-forest-500" />
              <span className="text-sm text-forest-500">Back</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-forest-100">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🌾</div>
              <h1 className="font-display font-bold text-forest-800 text-2xl">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-forest-500 text-sm mt-1">
                {isRegister ? 'Start your farming intelligence journey' : 'Sign in to your farming dashboard'}
              </p>
            </div>

            {/* Language selector */}
            <div className="mb-6">
              <div className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-2">
                🌐 Language / भाषा
              </div>
              <div className="flex gap-2">
                {LANGS.map(l => (
                  <button key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      language === l.code
                        ? 'border-forest-500 bg-forest-50 text-forest-700'
                        : 'border-forest-100 text-forest-400 hover:border-forest-300'
                    }`}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input className="input-field" placeholder="Your name"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">📱 Phone / Email</label>
                <input className="input-field" placeholder="Enter phone number or email"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
              <div>
                <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">🔒 Password</label>
                <div className="relative">
                  <input className="input-field pr-11"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                  <button onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-600">
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="mt-6 w-full bg-forest-600 hover:bg-forest-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</span>
                : isRegister ? 'Create Account →' : 'Sign In →'
              }
            </button>

            <div className="mt-4 text-center text-sm text-forest-500">
              {isRegister ? 'Already have an account? ' : 'New to KrishiShield? '}
              <button onClick={() => { setIsRegister(!isRegister); setError('') }}
                className="text-forest-600 font-semibold hover:underline">
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
