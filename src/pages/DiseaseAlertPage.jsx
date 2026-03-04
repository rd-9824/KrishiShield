import React, { useState } from 'react'

const sampleAlerts = [
  { id: 1, crop: 'Tomato', disease: 'Early Blight', severity: 'High', location: 'Field A', date: '2026-02-28' },
  { id: 2, crop: 'Wheat', disease: 'Rust', severity: 'Medium', location: 'Field C', date: '2026-02-20' },
]

export default function DiseaseAlertPage() {
  const [alerts, setAlerts] = useState(sampleAlerts)
  const [form, setForm] = useState({ crop: '', disease: '', location: '', severity: 'Low' })

  function handleSubmit(e) {
    e.preventDefault()
    const newAlert = { ...form, id: Date.now(), date: new Date().toISOString().slice(0,10) }
    setAlerts([newAlert, ...alerts])
    setForm({ crop: '', disease: '', location: '', severity: 'Low' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Disease Alerts</h2>
        <div className="text-sm text-forest-500">Monitor recent reports and submit new alerts</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="bg-white rounded-lg p-4 shadow-sm border flex items-center justify-between">
              <div>
                <div className="font-semibold text-forest-800">{a.crop} — {a.disease}</div>
                <div className="text-xs text-forest-500">{a.location} • {a.date}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs ${a.severity === 'High' ? 'bg-red-100 text-red-700' : a.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {a.severity}
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-sm font-semibold mb-2">Report New Alert</div>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Crop (e.g., Tomato)" value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} required />
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Disease (e.g., Blight)" value={form.disease} onChange={e => setForm({...form, disease: e.target.value})} required />
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Location (e.g., Field B)" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <button className="btn-primary w-full py-2">Submit Alert</button>
            </form>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border text-sm text-forest-500">
            <div className="font-semibold mb-1">Quick Guidance</div>
            - Isolate affected area
            <br />- Avoid irrigating until treated
            <br />- Apply recommended fungicide
          </div>
        </aside>
      </div>
    </div>
  )
}
