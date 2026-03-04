import React from 'react'

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
  // Placeholder sample data
  const summary = [
    { title: 'This Month Profit', value: '₹12,450', delta: '+8% vs last month' },
    { title: 'Estimated Annual', value: '₹1,45,200', delta: '+12% YoY' },
    { title: 'Average per Acre', value: '₹6,200', delta: '' },
  ]

  const sampleRows = [
    { crop: 'Wheat', revenue: '₹45,000', cost: '₹20,000', profit: '₹25,000' },
    { crop: 'Rice', revenue: '₹38,000', cost: '₹18,500', profit: '₹19,500' },
    { crop: 'Maize', revenue: '₹22,000', cost: '₹9,000', profit: '₹13,000' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profit Reports</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {summary.map(s => (
          <SummaryCard key={s.title} {...s} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-forest-50 text-forest-600">
            <tr>
              <th className="text-left px-4 py-3">Crop</th>
              <th className="text-right px-4 py-3">Revenue</th>
              <th className="text-right px-4 py-3">Cost</th>
              <th className="text-right px-4 py-3">Profit</th>
            </tr>
          </thead>
          <tbody>
            {sampleRows.map(r => (
              <tr key={r.crop} className="border-t">
                <td className="px-4 py-3">{r.crop}</td>
                <td className="px-4 py-3 text-right">{r.revenue}</td>
                <td className="px-4 py-3 text-right">{r.cost}</td>
                <td className="px-4 py-3 text-right font-semibold">{r.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-forest-500">Tip: Use seasonal price estimates and input costs to refine profit forecasts.</div>
    </div>
  )
}
