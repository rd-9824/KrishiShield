import { useState, useRef } from 'react'
import { useAppStore, api } from '../store/useAppStore'
import { Camera, Upload, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

const sevConfig = {
  mild:     { color: 'text-forest-600', bg: 'bg-forest-50 border-forest-200', badge: 'badge-low',    icon: <CheckCircle size={16} className="text-forest-500" /> },
  moderate: { color: 'text-earth-600',  bg: 'bg-earth-50 border-earth-200',   badge: 'badge-medium', icon: <AlertTriangle size={16} className="text-earth-500" /> },
  severe:   { color: 'text-red-600',    bg: 'bg-red-50 border-red-200',       badge: 'badge-high',   icon: <XCircle size={16} className="text-red-500" /> },
}

const urgencyColor = { Low: 'text-forest-600', Medium: 'text-earth-600', High: 'text-red-600', Critical: 'text-red-700 font-bold' }

export default function ScanCropPage() {
  const { diseaseResult, setDiseaseResult } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const fileRef = useRef()

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setLoading(true)
    setError(null)
    setDiseaseResult(null)
    try {
      const result = await api.detectDisease({ imageFile: file })
      setDiseaseResult(result)
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to analyze image'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const d = diseaseResult
  const sev = d ? sevConfig[d.level] || sevConfig.moderate : null

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-800 flex items-center gap-2">
          <Camera className="text-forest-500" /> AI Crop Disease Detection
        </h1>
        <p className="text-forest-500 text-sm mt-1">Upload a photo of your crop to detect diseases and get treatment recommendations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upload area */}
        <div className="card">
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFile} />
          <div
            onClick={() => !loading && fileRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
              loading ? 'border-forest-300 bg-forest-50' :
              preview ? 'border-forest-400 bg-forest-50' :
              'border-forest-200 hover:border-forest-400 hover:bg-forest-50'
            }`}>
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={40} className="text-forest-500 animate-spin" />
                <div className="font-semibold text-forest-700">Analyzing with AI Model...</div>
                <div className="text-forest-400 text-sm">Detecting disease & severity</div>
              </div>
            ) : preview ? (
              <div className="space-y-3">
                <img src={preview} alt="Crop" className="w-full h-48 object-cover rounded-xl" />
                <div className="text-forest-500 text-sm">Click to upload a different photo</div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center">
                  <Upload size={28} className="text-forest-500" />
                </div>
                <div className="font-semibold text-forest-700">Upload Crop Photo</div>
                <div className="text-forest-400 text-sm">Supports JPG, PNG · Mobile camera friendly</div>
                <div className="text-xs text-forest-300">Works live during demo</div>
              </div>
            )}
          </div>

          {!loading && (
            <button onClick={() => fileRef.current.click()}
              className="mt-4 btn-primary w-full flex items-center justify-center gap-2 text-sm">
              <Camera size={16} /> {preview ? 'Upload New Photo' : 'Take / Upload Photo'}
            </button>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Analysis failed</div>
                <div className="text-red-600 mt-0.5">{error}</div>
                <div className="text-red-500 text-xs mt-2">Try again or use a different image.</div>
              </div>
            </div>
          )}
        </div>

        {/* Disease result */}
        {d && sev && (
          <div className="space-y-4 animate-fade-up">
            {/* Header */}
            <div className={`card border ${sev.bg}`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="font-display font-bold text-forest-800 text-xl mb-1">🦠 {d.name}</div>
                  <div className="text-forest-500 text-sm">Detected with <span className="font-bold text-forest-700">{d.confidence}%</span> confidence</div>
                </div>
                <span className={sev.badge + ' flex items-center gap-1 text-xs shrink-0'}>
                  {sev.icon} {d.level.charAt(0).toUpperCase() + d.level.slice(1)}
                </span>
              </div>

              {/* Severity bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-forest-500 mb-1.5">
                  <span>Damage Severity</span><span className="font-bold">{d.severity}%</span>
                </div>
                <div className="h-3 bg-forest-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${d.severity}%`,
                      background: d.severity < 10 ? '#52b788' : d.severity < 30 ? '#f4a261' : '#e63946'
                    }} />
                </div>
                <div className="flex justify-between text-xs text-forest-400 mt-1">
                  <span>Mild</span><span>Moderate</span><span>Severe</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border border-forest-100">
                  <div className="text-xs text-forest-400 mb-0.5">Yield Loss</div>
                  <div className="font-bold text-red-600 text-sm">{d.yieldLoss}</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-forest-100">
                  <div className="text-xs text-forest-400 mb-0.5">Financial Impact</div>
                  <div className="font-bold text-red-600 text-sm">{d.financialImpact}</div>
                </div>
              </div>
            </div>

            {/* Treatments */}
            <div className="card">
              <h4 className="font-semibold text-forest-800 mb-3 flex items-center gap-2">
                💊 Treatment Recommendations
              </h4>
              <div className="space-y-3">
                {d.treatments.map((t, i) => (
                  <div key={i} className="bg-forest-50 rounded-xl p-4 border border-forest-100">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-forest-800 text-sm">{t.name}</div>
                      <span className={`text-xs font-semibold ${urgencyColor[t.urgency] || 'text-forest-600'}`}>
                        {t.urgency} Urgency
                      </span>
                    </div>
                    <div className="text-forest-500 text-xs mb-2">Dose: {t.dose}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-forest-200 rounded-full overflow-hidden">
                        <div className="h-full bg-forest-500 rounded-full" style={{ width: `${t.recovery}%` }} />
                      </div>
                      <span className="text-xs text-forest-500 font-medium shrink-0">{t.recovery}% recovery</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
