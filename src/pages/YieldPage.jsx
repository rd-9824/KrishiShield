import { useMemo, useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingDown } from 'lucide-react'
import { api, useAppStore } from '../store/useAppStore'
import { useTranslation } from 'react-i18next'

const CROPS = {
  Maize:     { sens: 0.65, base: 55,  price: 1850 },
  Wheat:     { sens: 0.55, base: 45,  price: 2200 },
  Rice:      { sens: 0.70, base: 65,  price: 1950 },
  Soybean:   { sens: 0.60, base: 30,  price: 3800 },
  Cotton:    { sens: 0.75, base: 20,  price: 6500 },
  Sugarcane: { sens: 0.50, base: 400, price: 285  },
  Chickpea:  { sens: 0.55, base: 18,  price: 4800 },
  Groundnut: { sens: 0.60, base: 25,  price: 5200 },
}

export default function YieldPage() {
  const { t } = useTranslation()
  const { onboarding, cropRecommendation, diseaseResult, setYieldData } = useAppStore((s) => ({
    onboarding: s.onboarding,
    cropRecommendation: s.cropRecommendation,
    diseaseResult: s.diseaseResult,
    setYieldData: s.setYieldData,
  }))

  const suggestedCrop = cropRecommendation?.recommendations?.[0]?.name || 'Maize'
  const suggestedSeverity = typeof diseaseResult?.severity === 'number' ? diseaseResult.severity : 0
  const suggestedArea = (() => {
    const v = parseFloat(onboarding?.farmSize)
    return Number.isFinite(v) && v > 0 ? v : 1
  })()

  const [crop,  setCrop]  = useState(suggestedCrop)
  const [sev,   setSev]   = useState(suggestedSeverity)
  const [area,  setArea]  = useState(suggestedArea)
  const [price, setPrice] = useState(CROPS[suggestedCrop]?.price || CROPS.Maize.price)
  const [res,   setRes]   = useState(null)

  // keep inputs in sync when user data updates (e.g., new disease scan / onboarding)
  useEffect(() => {
    setCrop((prev) => prev || suggestedCrop)
  }, [suggestedCrop])
  useEffect(() => {
    setSev(suggestedSeverity)
  }, [suggestedSeverity])
  useEffect(() => {
    setArea(suggestedArea)
  }, [suggestedArea])
  useEffect(() => {
    setPrice((prev) => (prev ? prev : (CROPS[suggestedCrop]?.price || CROPS.Maize.price)))
  }, [suggestedCrop])

  // call backend whenever parameters change
  useEffect(() => {
    api.yieldEstimate({ crop, area, severity: sev, price })
      .then(data => {
        setRes(data)
        setYieldData(data)
      })
      .catch(console.error);
  }, [crop, sev, area, price]);

  const barData = useMemo(() => (res ? [
    { name: t('expected'), value: res.base,   fill: '#52b788' },
    { name: t('actual'),   value: res.actual, fill: '#f4a261' },
    { name: t('loss'),     value: res.lossQ,  fill: '#e63946' },
  ] : []), [res, t])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-800 flex items-center gap-2">
          <TrendingDown className="text-forest-500" /> {t('yieldEstimator')}
        </h1>
        <p className="text-forest-500 text-sm mt-1">{t('yieldEstimatorSubtitle')}</p>
      </div>

      {/* Inputs */}
      <div className="card">
        <h3 className="font-semibold text-forest-800 mb-4 pb-3 border-b border-forest-100">{t('yieldParameters')}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('cropType')}</label>
            <select className="input-field text-sm" value={crop} onChange={e => setCrop(e.target.value)}>
              {Object.keys(CROPS).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('diseaseSeverityPct')}</label>
            <input type="number" className="input-field text-sm" min={0} max={100}
              value={sev} onChange={e => setSev(+e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('farmAreaAcres')}</label>
            <input type="number" className="input-field text-sm" min={1}
              value={area} onChange={e => setArea(+e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('marketPricePerQuintal')}</label>
            <input type="number" className="input-field text-sm" min={100}
              value={price} onChange={e => setPrice(+e.target.value)} />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {res && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
          <div className="stat-card border-l-4 border-forest-400">
            <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">{t('expectedYield')}</div>
            <div className="font-display font-bold text-forest-800 text-2xl">{res.base} q</div>
            <div className="text-xs text-forest-400 mt-1">{t('withoutDamage')}</div>
          </div>
          <div className="stat-card border-l-4 border-earth-400">
            <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">{t('yieldAfterLoss')}</div>
            <div className="font-display font-bold text-earth-700 text-2xl">{res.actual} q</div>
            <div className="text-xs text-forest-400 mt-1">{t('afterReduction', { lp: res.lp })}</div>
          </div>
          <div className="stat-card border-l-4 border-red-400">
            <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">{t('financialLoss')}</div>
            <div className="font-display font-bold text-red-600 text-2xl">₹{res.lossR.toLocaleString('en-IN')}</div>
            <div className="text-xs text-forest-400 mt-1">{t('yieldReduction', { lp: res.lp })}</div>
          </div>
          <div className="stat-card border-l-4 border-forest-300">
            <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">{t('projectedRevenue')}</div>
            <div className="font-display font-bold text-forest-700 text-2xl">₹{res.rev.toLocaleString('en-IN')}</div>
            <div className="text-xs text-forest-400 mt-1">{t('netAfterLosses')}</div>
          </div>
        </div>
      )}

      {/* Bar chart */}
      {res && (
        <div className="card">
          <h4 className="font-semibold text-forest-800 mb-4">{t('yieldComparison')}</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0faf4" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} q`, t('yield')]} />
              <Bar dataKey="value" radius={[8,8,0,0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Severity info */}
      <div className="card">
        <h4 className="font-semibold text-forest-800 mb-3">{t('severityGuide')}</h4>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: t('mild'),     range: '< 10%',  color: 'bg-forest-50 border-forest-200', badge: 'badge-low',    desc: t('severityMildDesc') },
            { label: t('moderate'), range: '10–30%', color: 'bg-earth-50 border-earth-200',   badge: 'badge-medium', desc: t('severityModerateDesc') },
            { label: t('severe'),   range: '> 30%',  color: 'bg-red-50 border-red-200',       badge: 'badge-high',   desc: t('severitySevereDesc') },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 border ${s.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={s.badge}>{s.label}</span>
                <span className="font-mono text-sm font-bold text-forest-700">{s.range}</span>
              </div>
              <p className="text-xs text-forest-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
