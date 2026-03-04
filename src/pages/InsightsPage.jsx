import { Lightbulb, AlertTriangle, XCircle, CheckCircle, TrendingUp, Calendar, Droplets, Thermometer } from 'lucide-react'

const insights = [
  {
    id: 1, type: 'danger', icon: '🦠',
    title: 'Severe Infection Risk — Immediate Action Required',
    body: 'Leaf Blight detected at Moderate severity (22%). Apply Mancozeb 75% WP within 48 hours to prevent escalation to Severe (>30%). Estimated yield loss: 14–18%.',
    time: '2 hours ago', tag: 'Disease Alert', action: { label: 'Scan Crop', path: '/app/scan-crop' }
  },
  {
    id: 2, type: 'warning', icon: '⛈️',
    title: 'High Rainfall Variability Detected',
    body: 'Rainfall is 12% above seasonal average for Maharashtra this month. Consider switching to drought-resistant Maize varieties or adjusting drainage channels to prevent waterlogging.',
    time: '5 hours ago', tag: 'Weather Alert', action: { label: 'Run Simulator', path: '/app/simulator' }
  },
  {
    id: 3, type: 'success', icon: '💰',
    title: 'Market Opportunity Window',
    body: 'Maize prices are projected to rise 8–12% in Q2 2025 due to reduced Maharashtra supply. Consider staggered harvesting strategy for better price capture across multiple market days.',
    time: '1 day ago', tag: 'Market Insight', action: null
  },
  {
    id: 4, type: 'info', icon: '🌱',
    title: 'Soil Health: Good',
    body: 'Your N-P-K ratio is well balanced for Kharif crops. A 5% Nitrogen top-up in Week 3 post-sowing is recommended for optimal yield. Current pH 6.5 is ideal for Maize.',
    time: '1 day ago', tag: 'Soil Health', action: { label: 'View Planner', path: '/app/crop-planner' }
  },
  {
    id: 5, type: 'warning', icon: '🌡️',
    title: 'Temperature Anomaly Detected',
    body: 'Daytime temperatures are 2°C above optimal range for Maize pollination. Consider morning irrigation between 6–8 AM to cool the crop canopy. This can reduce heat stress by up to 40%.',
    time: '2 days ago', tag: 'Weather Alert', action: null
  },
  {
    id: 6, type: 'success', icon: '📅',
    title: 'Optimal Harvest Window',
    body: 'Based on current crop growth stage, weather forecast, and market projections, the ideal harvest window is March 18–25. Early harvest before this window may reduce yield by 6%.',
    time: '2 days ago', tag: 'Planning', action: null
  },
]

const typeConfig = {
  danger:  { bg: 'bg-red-50 border-red-200',    icon: <XCircle    size={15} className="text-red-500" />,    tag: 'bg-red-100 text-red-700' },
  warning: { bg: 'bg-earth-50 border-earth-200', icon: <AlertTriangle size={15} className="text-earth-500" />, tag: 'bg-earth-100 text-earth-700' },
  success: { bg: 'bg-forest-50 border-forest-200', icon: <CheckCircle size={15} className="text-forest-500" />, tag: 'bg-forest-100 text-forest-700' },
  info:    { bg: 'bg-blue-50 border-blue-200',   icon: <Lightbulb  size={15} className="text-blue-500" />,   tag: 'bg-blue-100 text-blue-700' },
}

const summaryStats = [
  { icon: <AlertTriangle size={20} className="text-red-500" />,    label: 'Active Alerts',    value: '2', sub: 'Require action' },
  { icon: <CheckCircle   size={20} className="text-forest-500" />, label: 'Opportunities',    value: '2', sub: 'This week' },
  { icon: <TrendingUp    size={20} className="text-earth-500" />,  label: 'Market Signals',   value: '1', sub: 'Bullish' },
  { icon: <Calendar      size={20} className="text-blue-500" />,   label: 'Harvest Window',   value: '7d', sub: 'Mar 18–25' },
]

export default function InsightsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-800 flex items-center gap-2">
          <Lightbulb className="text-forest-500" /> Smart Insights Panel
        </h1>
        <p className="text-forest-500 text-sm mt-1">AI-generated actionable insights based on your farm data</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s, i) => (
          <div key={i} className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center shrink-0">{s.icon}</div>
            <div>
              <div className="font-display font-bold text-forest-800 text-xl leading-none">{s.value}</div>
              <div className="text-xs font-semibold text-forest-600 mt-0.5">{s.label}</div>
              <div className="text-xs text-forest-400">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights list */}
      <div className="space-y-4">
        {insights.map((ins) => {
          const cfg = typeConfig[ins.type] || typeConfig.info
          return (
            <div key={ins.id} className={`card border ${cfg.bg} hover:-translate-y-0.5 transition-all`}>
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5 shrink-0">{ins.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                    <div className="font-semibold text-forest-800">{ins.title}</div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.tag}`}>{ins.tag}</span>
                      <span className="text-xs text-forest-400">{ins.time}</span>
                    </div>
                  </div>
                  <p className="text-forest-600 text-sm leading-relaxed">{ins.body}</p>
                  {ins.action && (
                    <a href={ins.action.path}
                      className="inline-flex items-center gap-1 mt-3 text-forest-600 hover:text-forest-800 text-xs font-semibold border border-forest-200 hover:border-forest-400 bg-white rounded-lg px-3 py-1.5 transition-all">
                      → {ins.action.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
