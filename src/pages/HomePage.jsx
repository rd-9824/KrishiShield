import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { AlertTriangle, ArrowRight, TrendingDown, Zap } from 'lucide-react'
import { api, useAppStore } from '../store/useAppStore'
import FarmSummaryCards from './FarmSummaryCards'
import WeatherForecastCard from './WeatherForecastCard'
import WhatShouldIDoToday from './WhatShouldIDoToday'

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, onboarding, cropRecommendation, diseaseResult, yieldData, riskLevel } = useAppStore((s) => ({
    user: s.user,
    onboarding: s.onboarding,
    cropRecommendation: s.cropRecommendation,
    diseaseResult: s.diseaseResult,
    yieldData: s.yieldData,
    riskLevel: s.riskLevel,
  }))

  const [advisory, setAdvisory] = useState(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const data = await api.getAdvisory()
        if (!cancelled) setAdvisory(data)
      } catch (e) {
        // advisory is optional for dashboard; don't block UI
        if (!cancelled) setAdvisory(null)
      }
    }
    run()
    const interval = setInterval(run, 5 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening')

  const topRec = cropRecommendation?.recommendations?.[0]
  const topCropName = topRec?.name || '—'
  const topCropConfidence = topRec?.confidence ?? null
  const topCropRoi = topRec?.roi || null

  const risk = (riskLevel || topRec?.risk || 'medium').toLowerCase()
  const diseaseName = diseaseResult?.name || '—'
  const severityPct = typeof diseaseResult?.severity === 'number' ? diseaseResult.severity : 0
  const severityLabel = (diseaseResult?.level || (severityPct >= 30 ? 'severe' : severityPct >= 15 ? 'moderate' : 'mild')).toLowerCase()

  const yieldLossPct = yieldData?.lp ?? Math.round(severityPct * 0.65)
  const financialImpact = yieldData?.lossR != null ? `₹${yieldData.lossR.toLocaleString('en-IN')}` : (diseaseResult?.financialImpact || '—')

  const weather = advisory?.weather || null
  const hasWeatherAlert = weather?.rain === 'Rain' || (weather?.humidity ?? 0) > 75 || (weather?.temp ?? 0) > 34
  const hasSevereAlert = severityLabel === 'severe'
  const hasHighPriorityAdvisory = Array.isArray(advisory?.recommendations) && advisory.recommendations.some((r) => r?.priority === 'high')
  const showAlertBanner = hasSevereAlert || hasWeatherAlert || hasHighPriorityAdvisory

  const riskScore100 = useMemo(() => {
    const base = risk === 'high' ? 78 : risk === 'medium' ? 55 : 30
    const sevBoost = Math.min(20, Math.round(severityPct / 5))
    const weatherBoost = hasWeatherAlert ? 10 : 0
    return Math.max(1, Math.min(99, base + sevBoost + weatherBoost))
  }, [risk, severityPct, hasWeatherAlert])

  const riskData = useMemo(() => ([{ name: 'risk', value: riskScore100, fill: risk === 'high' ? '#e63946' : risk === 'medium' ? '#f4a261' : '#52b788' }]), [riskScore100, risk])

  const recentAlerts = useMemo(() => {
    const items = []
    if (diseaseResult?.name) {
      items.push({
        icon: '🦠',
        type: severityLabel === 'severe' ? 'danger' : 'warning',
        title: t('diseaseAlert'),
        desc: `${diseaseResult.name} · ${t('severity')}: ${t(severityLabel)} ${severityPct}%`,
      })
    }
    if (weather) {
      items.push({
        icon: '⛈️',
        type: hasWeatherAlert ? 'warning' : 'success',
        title: t('weatherAlert'),
        desc: `${t('currentConditions')}: ${weather.temp}°C · ${t('humidity')}: ${weather.humidity}% · ${weather.rain}`,
      })
    }
    if (topRec?.risk) {
      items.push({
        icon: '📈',
        type: topRec.risk === 'high' ? 'warning' : 'success',
        title: t('riskOverview'),
        desc: `${t('riskLevel')}: ${t(String(topRec.risk).toLowerCase())}`,
      })
    }
    return items.slice(0, 4)
  }, [diseaseResult, severityLabel, severityPct, weather, hasWeatherAlert, topRec, t])

  const quickActions = [
    { icon: '🌱', label: t('analyzeCrop'), path: '/app/crop-planner', color: 'bg-forest-500' },
    { icon: '📷', label: t('scanCrop'), path: '/app/scan-crop', color: 'bg-earth-500' },
    { icon: '🧪', label: t('riskSimulator'), path: '/app/simulator', color: 'bg-blue-500' },
    { icon: '📄', label: t('healthReport'), path: '/app/report', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-800">
            {greeting}, {user?.username || t('farmer')}!
          </h1>
          <p className="text-forest-500 text-sm mt-0.5">
            {(user?.state || '—')}{' '}
            · {(onboarding?.landType || '—')} {t('soilType')}
            {' '}· {(onboarding?.farmSize || '—')} {t('farmSize')}
          </p>
        </div>
        <button onClick={() => navigate('/app/crop-planner')} className="btn-primary flex items-center gap-2 text-sm">
          <Zap size={15} /> {t('newAnalysis')}
        </button>
      </div>

      {/* Severe / Weather alerts */}
      {showAlertBanner && (
        <div className={`rounded-2xl p-4 border flex items-start gap-3 ${hasSevereAlert ? 'bg-red-50 border-red-200' : 'bg-earth-50 border-earth-200'}`}>
          <AlertTriangle size={18} className={`${hasSevereAlert ? 'text-red-600' : 'text-earth-700'} mt-0.5 shrink-0`} />
          <div className="flex-1">
            <div className={`font-semibold ${hasSevereAlert ? 'text-red-700' : 'text-earth-700'}`}>{t('criticalAlerts')}</div>
            <div className={`text-sm mt-0.5 ${hasSevereAlert ? 'text-red-600' : 'text-earth-600'}`}>
              {hasSevereAlert ? t('severeAlertMessage') : t('weatherAlertMessage')}
            </div>
          </div>
          <button onClick={() => navigate(hasSevereAlert ? '/app/scan-crop' : '/app/home')} className="text-xs font-semibold text-forest-700 hover:underline">
            {t('viewDetails')}
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border-l-4 border-forest-400">
          <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">{t('topCrop')}</div>
          <div className="text-lg font-display font-bold text-forest-700">{topCropName}</div>
          <div className="text-xs text-forest-400 mt-1">
            {topCropConfidence != null ? `${t('confidence')}: ${topCropConfidence}%` : ''}
            {topCropRoi ? ` · ${t('roi')}: ${topCropRoi}` : ''}
          </div>
        </div>

        <div className="stat-card border-l-4 border-earth-400">
          <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">{t('riskLevel')}</div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={18} className="text-earth-500" />
            <span className="text-lg font-display font-bold text-earth-600">{t(risk)}</span>
          </div>
          <div className="text-xs text-forest-400 mt-1">
            {cropRecommendation?.rainfallDeviation ? `${t('rainfallDeviation')}: ${cropRecommendation.rainfallDeviation}` : ''}
          </div>
        </div>

        <div className="stat-card border-l-4 border-red-400">
          <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">{t('diseaseAlert')}</div>
          <div className="text-base font-display font-bold text-red-600">{diseaseName}</div>
          <div className="text-xs text-forest-400 mt-1">{t('severity')}: {t(severityLabel)} {severityPct}%</div>
        </div>

        <div className="stat-card border-l-4 border-forest-300">
          <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">{t('estimatedYieldLoss')}</div>
          <div className="flex items-center gap-1.5">
            <TrendingDown size={18} className="text-red-400" />
            <span className="text-lg font-display font-bold text-forest-800">{yieldLossPct}%</span>
          </div>
          <div className="text-xs text-forest-400 mt-1">{t('financialImpact')}: {financialImpact}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <button
            key={a.path}
            onClick={() => navigate(a.path)}
            className="flex flex-col items-center gap-2.5 bg-white hover:bg-forest-50 border border-forest-100 hover:border-forest-300 rounded-2xl p-4 transition-all hover:-translate-y-0.5 group"
          >
            <div className={`w-11 h-11 ${a.color} rounded-xl flex items-center justify-center text-xl shadow-sm`}>{a.icon}</div>
            <span className="text-xs font-semibold text-forest-600 group-hover:text-forest-800 text-center leading-tight">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <FarmSummaryCards />
        </div>

        <div className="card flex flex-col">
          <h3 className="font-semibold text-forest-800 flex items-center gap-2 mb-4">
            <AlertTriangle size={17} className="text-earth-500" /> {t('riskOverview')}
          </h3>
          <div className="flex justify-center mb-4">
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={riskData} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#f0faf4' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                <span className="font-display font-bold text-earth-600 text-xl">{riskScore100}</span>
                <span className="text-forest-500 text-xs">/ 100</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            {[
              [t('rainfallDeviation'), cropRecommendation?.rainfallDeviation || '—', 'bm'],
              [t('temperature'), hasWeatherAlert ? t('high') : t('optimal'), hasWeatherAlert ? 'bm' : 'bl'],
              [t('marketTrend'), t('neutral'), 'bm'],
              [t('pestPressure'), severityLabel === 'severe' ? t('high') : severityLabel === 'moderate' ? t('medium') : t('low'), 'bm'],
            ].map(([k, v, c]) => (
              <div key={k} className="flex items-center justify-between text-xs">
                <span className="text-forest-500">{k}</span>
                <span className={c === 'bl' ? 'badge-low' : 'badge-medium'}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhatShouldIDoToday />
        <WeatherForecastCard />
      </div>

      {/* Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-forest-800">{t('recentAlertsInsights')}</h3>
          <button onClick={() => navigate('/app/insights')} className="text-forest-500 hover:text-forest-700 text-xs font-semibold flex items-center gap-1">
            {t('viewAll')} <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {recentAlerts.length === 0 ? (
            <div className="text-sm text-forest-500">{t('noAlerts')}</div>
          ) : (
            recentAlerts.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  a.type === 'danger' ? 'bg-red-50 border-red-100' : a.type === 'warning' ? 'bg-earth-50 border-earth-100' : 'bg-forest-50 border-forest-100'
                }`}
              >
                <span className="text-xl mt-0.5 shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-forest-800">{a.title}</div>
                  <div className="text-forest-500 text-xs mt-0.5">{a.desc}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
