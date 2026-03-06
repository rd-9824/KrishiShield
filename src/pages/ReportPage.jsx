import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { FileText, Download, AlertTriangle } from 'lucide-react'

export default function ReportPage() {
  const { t } = useTranslation()
  const { user, onboarding, cropRecommendation, diseaseResult, yieldData } = useAppStore()

  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  const rec = cropRecommendation?.recommendations?.[0]
  const d = diseaseResult
  const y = yieldData

  const severityPct = typeof d?.severity === 'number' ? d.severity : 0
  const severityLabel = d?.level || (severityPct >= 30 ? 'severe' : severityPct >= 15 ? 'moderate' : 'mild')

  const suggestedActions = useMemo(() => {
    if (!d) return []
    if (severityLabel === 'severe') {
      return [
        [t('immediate'), t('actionImmediateSevere'), 'text-red-600'],
        [t('within7days'), t('actionWithin7Days'), 'text-earth-600'],
        [t('thisMonth'), t('actionThisMonth'), 'text-forest-600'],
      ]
    }
    if (severityLabel === 'moderate') {
      return [
        [t('immediate'), t('actionImmediateModerate'), 'text-earth-600'],
        [t('within7days'), t('actionWithin7Days'), 'text-forest-600'],
      ]
    }
    return [[t('immediate'), t('actionImmediateLow'), 'text-forest-600']]
  }, [d, severityLabel, t])

  const handleDownload = () => {
    const fmtR = (n) => (typeof n === 'number' ? `₹${n.toLocaleString('en-IN')}` : '—')
    const content = `
${t('healthReport')}
================================
${t('generated')}: ${today}
${t('farmer')}: ${user?.username || '—'}
${t('location')}: ${user?.state || '—'}
${t('soilType')}: ${onboarding?.landType || '—'}
${t('farmSizeInput')}: ${onboarding?.farmSize || '—'}

${t('cropRecommendationSection')}
-------------------
${t('topCrop')}: ${rec?.name || '—'}
${t('confidence')}: ${rec?.confidence ?? '—'}%
${t('riskLevel')}: ${rec?.risk ? t(rec.risk) : '—'}
${t('roi')}: ${rec?.roi || '—'}

${t('diseaseAnalysisSection')}
----------------
${t('disease')}: ${d?.name || '—'}
${t('confidence')}: ${d?.confidence ?? '—'}%
${t('severity')}: ${t(severityLabel)} (${severityPct}%)
${t('yieldloss')}: ${d?.yieldLoss || '—'}
${t('financialLoss')}: ${d?.financialImpact || '—'}

${t('treatment')}
---------
${d?.treatments?.map(tt => `• ${tt.name} — ${tt.dose} (${tt.urgency}, ${tt.recovery}%)`).join('\n') || '—'}

${t('yieldAnalysisSection')}
--------------
${t('expectedYield')}: ${y?.base ?? '—'} q
${t('yieldAfterLoss')}: ${y?.actual ?? '—'} q
${t('estimatedLoss')}: ${y?.lp ?? '—'}%
${t('projectedRevenue')}: ${y?.rev != null ? fmtR(y.rev) : '—'}
${t('financialLoss')}: ${y?.lossR != null ? fmtR(y.lossR) : '—'}

${t('suggestedActionsSection')}
-----------------
${suggestedActions.map(([k, v]) => `• ${k}: ${v}`).join('\n') || '—'}

${t('reportFooter')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KrishiShield_Report_${today.replace(/\s/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const Section = ({ title, rows }) => (
    <div className="card">
      <h3 className="font-semibold text-forest-800 mb-4 pb-3 border-b border-forest-100">{title}</h3>
      <div className="space-y-2">
        {rows.map(([k, v, style]) => (
          <div key={k} className="flex justify-between items-center py-2 border-b border-forest-50 last:border-0 text-sm">
            <span className="text-forest-500">{k}</span>
            <span className={`font-semibold ${style || 'text-forest-800'}`}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-800 flex items-center gap-2">
            <FileText className="text-forest-500" /> {t('healthReport')}
          </h1>
          <p className="text-forest-500 text-sm mt-1">{t('healthReportSubtitle')}</p>
        </div>
        <button onClick={handleDownload} className="btn-primary flex items-center gap-2 text-sm">
          <Download size={16} /> {t('downloadReport')}
        </button>
      </div>

      {/* Critical alert */}
      {severityLabel === 'severe' && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-sm text-red-700 flex items-start gap-2">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">{t('severeAlertTitle')}</div>
            <div className="text-red-600 mt-0.5">{t('severeAlertMessage')}</div>
          </div>
        </div>
      )}

      {/* Header card */}
      <div className="bg-gradient-to-br from-forest-800 to-forest-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">🌾</span>
          <div>
            <div className="font-display font-bold text-xl">{t('healthReport')}</div>
            <div className="text-forest-300 text-sm">{t('aiPowered')}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            [t('farmer'), user?.username || '—'],
            [t('location'), user?.state || '—'],
            [t('soilType'), onboarding?.landType || '—'],
            [t('reportDate'), today],
            [t('season'), t('seasonCurrent')],
            [t('farmSizeInput'), onboarding?.farmSize || '—'],
          ].map(([k, v]) => (
            <div key={k} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 flex justify-between items-center">
              <span className="text-forest-200 text-xs">{k}</span>
              <span className="text-white font-semibold text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Report sections */}
      <div className="grid md:grid-cols-2 gap-5">
        <Section
          title={t('cropRecommendationSection')}
          rows={[
            [t('topCrop'), rec?.name || '—', 'text-forest-700'],
            [t('confidence'), `${rec?.confidence ?? 0}%`, 'text-forest-700'],
            [t('riskLevel'), rec?.risk ? t(rec.risk) : '—', rec?.risk === 'high' ? 'text-red-600' : rec?.risk === 'low' ? 'text-forest-600' : 'text-earth-600'],
            [t('roi'), rec?.roi || '—', 'text-forest-700'],
            [t('insight'), cropRecommendation?.rainfallDeviation ? `${t('rainfallDeviation')}: ${cropRecommendation.rainfallDeviation}` : t('normalConditions'), 'text-forest-500'],
          ]}
        />

        <Section
          title={t('diseaseAnalysisSection')}
          rows={[
            [t('disease'), d?.name || '—', 'text-red-600'],
            [t('confidence'), `${d?.confidence ?? 0}%`, 'text-forest-700'],
            [t('severity'), `${t(severityLabel)} (${severityPct}%)`, severityLabel === 'severe' ? 'text-red-600' : 'text-earth-600'],
            [t('yieldloss'), d?.yieldLoss || '—', 'text-red-600'],
            [t('financialLoss'), d?.financialImpact || '—', 'text-red-600'],
          ]}
        />

        <Section
          title={t('yieldAnalysisSection')}
          rows={[
            [t('expectedYield'), y?.base != null ? `${y.base} q` : '—', 'text-forest-700'],
            [t('yieldAfterLoss'), y?.actual != null ? `${y.actual} q` : '—', 'text-forest-700'],
            [t('estimatedLoss'), y?.lp != null ? `${y.lp}%` : '—', 'text-red-600'],
            [t('financialLoss'), y?.lossR != null ? `₹${y.lossR.toLocaleString('en-IN')}` : '—', 'text-red-600'],
            [t('projectedRevenue'), y?.rev != null ? `₹${y.rev.toLocaleString('en-IN')}` : '—', 'text-forest-700'],
          ]}
        />

        <Section title={t('suggestedActionsSection')} rows={suggestedActions} />
      </div>

      {/* Treatment detail */}
      {d?.treatments && (
        <div className="card">
          <h3 className="font-semibold text-forest-800 mb-4">{t('detailedTreatmentPlan')}</h3>
          <div className="space-y-3">
            {d.treatments.map((tt, i) => (
              <div key={i} className="flex items-start gap-4 bg-forest-50 rounded-xl p-4 border border-forest-100">
                <div className="w-8 h-8 bg-forest-500 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="font-semibold text-forest-800 text-sm">{tt.name}</div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tt.urgency === 'Critical' || tt.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-earth-100 text-earth-700'}`}>
                      {tt.urgency} {t('urgency')}
                    </span>
                  </div>
                  <div className="text-forest-500 text-xs mt-1 mb-2">{t('dose')}: {tt.dose}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-forest-200 rounded-full overflow-hidden">
                      <div className="h-full bg-forest-500 rounded-full" style={{ width: `${tt.recovery}%` }} />
                    </div>
                    <span className="text-xs text-forest-500 font-medium">{tt.recovery}% {t('estimatedRecovery')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download CTA */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-500 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="font-display font-bold text-white text-lg">{t('downloadFullReport')}</div>
          <div className="text-forest-200 text-sm">{t('downloadFullReportSubtitle')}</div>
        </div>
        <button
          onClick={handleDownload}
          className="bg-white text-forest-700 hover:bg-forest-50 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all text-sm shadow-md hover:shadow-lg"
        >
          <Download size={16} /> {t('downloadReport')}
        </button>
      </div>
    </div>
  )
}
