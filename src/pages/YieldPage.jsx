import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingDown } from 'lucide-react'

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
  const [crop,  setCrop]  = useState('Maize')
  const [sev,   setSev]   = useState(22)
  const [area,  setArea]  = useState(10)
  const [price, setPrice] = useState(1850)
  const [res,   setRes]   = useState(null)

  useEffect(() => {
    const cfg = CROPS[crop] || CROPS.Maize
    const base = cfg.base * area
    const lp = sev * cfg.sens / 100
    const actual = +(base * (1 - lp)).toFixed(1)
    const lossQ  = +(base - actual).toFixed(1)
    const lossR  = Math.round(lossQ * price / 10)
    const rev    = Math.round(actual * price / 10)
    setRes({ base, actual, lossQ, lossR, rev, lp: Math.round(lp * 1000) / 10 })
    setPrice(cfg.price)
  }, [crop, sev, area])

  useEffect(() => {
    if (!res) return
    const cfg = CROPS[crop] || CROPS.Maize
    const base = cfg.base * area
    const lp = sev * cfg.sens / 100
    const actual = +(base * (1 - lp)).toFixed(1)
    const lossQ  = +(base - actual).toFixed(1)
    const lossR  = Math.round(lossQ * price / 10)
    const rev    = Math.round(actual * price / 10)
    setRes({ base, actual, lossQ, lossR, rev, lp: Math.round(lp * 1000) / 10 })
  }, [price])

  const barData = res ? [
    { name: 'Expected', value: res.base,   fill: '#52b788' },
    { name: 'Actual',   value: res.actual, fill: '#f4a261' },
    { name: 'Loss',     value: res.lossQ,  fill: '#e63946' },
  ] : []

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-800 flex items-center gap-2">
          <TrendingDown className="text-forest-500" /> Yield Loss Estimator
        </h1>
        <p className="text-forest-500 text-sm mt-1">Calculate estimated yield reduction and financial impact</p>
      </div>

      {/* Inputs */}
      <div className="card">
        <h3 className="font-semibold text-forest-800 mb-4 pb-3 border-b border-forest-100">📐 Parameters</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">Crop Type</label>
            <select className="input-field text-sm" value={crop} onChange={e => setCrop(e.target.value)}>
              {Object.keys(CROPS).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">Disease Severity (%)</label>
            <input type="number" className="input-field text-sm" min={0} max={100}
              value={sev} onChange={e => setSev(+e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">Farm Area (acres)</label>
            <input type="number" className="input-field text-sm" min={1}
              value={area} onChange={e => setArea(+e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">Market Price (₹/quintal)</label>
            <input type="number" className="input-field text-sm" min={100}
              value={price} onChange={e => setPrice(+e.target.value)} />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {res && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
          <div className="stat-card border-l-4 border-forest-400">
            <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">Expected Yield</div>
            <div className="font-display font-bold text-forest-800 text-2xl">{res.base} q</div>
            <div className="text-xs text-forest-400 mt-1">Without damage</div>
          </div>
          <div className="stat-card border-l-4 border-earth-400">
            <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">Yield After Loss</div>
            <div className="font-display font-bold text-earth-700 text-2xl">{res.actual} q</div>
            <div className="text-xs text-forest-400 mt-1">After {res.lp}% reduction</div>
          </div>
          <div className="stat-card border-l-4 border-red-400">
            <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">Financial Loss</div>
            <div className="font-display font-bold text-red-600 text-2xl">₹{res.lossR.toLocaleString('en-IN')}</div>
            <div className="text-xs text-forest-400 mt-1">{res.lp}% yield reduction</div>
          </div>
          <div className="stat-card border-l-4 border-forest-300">
            <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">Projected Revenue</div>
            <div className="font-display font-bold text-forest-700 text-2xl">₹{res.rev.toLocaleString('en-IN')}</div>
            <div className="text-xs text-forest-400 mt-1">Net after losses</div>
          </div>
        </div>
      )}

      {/* Bar chart */}
      {res && (
        <div className="card">
          <h4 className="font-semibold text-forest-800 mb-4">📊 Yield Comparison (quintals)</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0faf4" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} q`, 'Yield']} />
              <Bar dataKey="value" radius={[8,8,0,0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Severity info */}
      <div className="card">
        <h4 className="font-semibold text-forest-800 mb-3">🎯 Severity Classification Guide</h4>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Mild',     range: '< 10%',  color: 'bg-forest-50 border-forest-200', badge: 'badge-low',    desc: 'Minimal impact, monitor regularly' },
            { label: 'Moderate', range: '10–30%', color: 'bg-earth-50 border-earth-200',   badge: 'badge-medium', desc: 'Significant loss, apply treatment soon' },
            { label: 'Severe',   range: '> 30%',  color: 'bg-red-50 border-red-200',       badge: 'badge-high',   desc: 'Critical — immediate intervention needed' },
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
