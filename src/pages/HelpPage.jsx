import React from 'react'

const faqs = [
  { q: 'How do I interpret the health report?', a: 'The health report highlights pest/disease detections and recommended actions.' },
  { q: 'How to submit a disease report?', a: 'Go to Disease Alerts → Report New Alert and provide crop, disease and location.' },
  { q: 'How are profit estimates calculated?', a: 'Estimates use historical yields, market prices and your provided costs.' },
]

export default function HelpPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Help & Support</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="font-semibold mb-2">FAQs</div>
          <div className="space-y-3 text-sm text-forest-600">
            {faqs.map(f => (
              <div key={f.q}>
                <div className="font-medium">{f.q}</div>
                <div className="text-forest-500">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="font-semibold mb-2">Contact</div>
          <div className="text-sm text-forest-600 space-y-2">
            <div>Email: support@krishishield.example</div>
            <div>Phone: +91 98765 43210</div>
            <div className="mt-3 text-forest-500">For urgent disease outbreaks, use the Disease Alerts page to report immediately.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
