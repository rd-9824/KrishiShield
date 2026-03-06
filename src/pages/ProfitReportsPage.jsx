import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../store/useAppStore'
import { useTranslation } from 'react-i18next'

function SummaryCard({ title, value, delta }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="text-xs text-forest-500">{title}</div>
      <div className="text-2xl font-semibold text-forest-800">{value}</div>
      {delta && <div className="text-xs text-forest-500">{delta}</div>}
    </div>
  )
}

export default function ProfitReportsPage() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState([]);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    api.profitReport()
      .then(data => {
        setSummary(data.summary || []);
        setRows(data.rows || []);
        setMeta(data.meta || null);
      })
      .catch(console.error);
  }, []);

  const formatRupees = useMemo(() => (n) => {
    const v = Number(n) || 0;
    return `₹${v.toLocaleString('en-IN')}`;
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('profitReports')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {summary.map(s => (
          <SummaryCard
            key={s.key || s.title}
            title={s.key ? t(s.key) : s.title}
            value={typeof s.value === 'number' ? formatRupees(s.value) : s.value}
            delta={s.deltaPct != null ? t('deltaVsLastMonth', { pct: s.deltaPct }) : s.delta}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-forest-50 text-forest-600">
            <tr>
              <th className="text-left px-4 py-3">{t('crop')}</th>
              <th className="text-right px-4 py-3">{t('revenue')}</th>
              <th className="text-right px-4 py-3">{t('cost')}</th>
              <th className="text-right px-4 py-3">{t('profit')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.crop} className="border-t">
                <td className="px-4 py-3">{r.crop}</td>
                <td className="px-4 py-3 text-right">{formatRupees(r.revenue)}</td>
                <td className="px-4 py-3 text-right">{formatRupees(r.cost)}</td>
                <td className={`px-4 py-3 text-right font-semibold ${r.profit < 0 ? 'text-red-600' : 'text-forest-800'}`}>
                  {formatRupees(r.profit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta?.area && (
        <div className="mt-4 text-xs text-forest-500">
          {t('profitMeta', { area: meta.area, severity: meta.severity ?? 0 })}
        </div>
      )}

      <div className="mt-6 text-sm text-forest-500">{t('profitTip')}</div>
    </div>
  )
}
