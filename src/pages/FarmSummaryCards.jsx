export default function FarmSummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Recommended Crop */}
      <div className="stat-card border-l-4 border-forest-400">
        <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">
          Recommended Crop
        </div>
        <div className="text-lg font-display font-bold text-forest-700">
          🌾 Wheat
        </div>
        <div className="text-xs text-forest-400 mt-1">
          Best match for soil & climate
        </div>
      </div>

      {/* Farm Health */}
      <div className="stat-card border-l-4 border-green-400">
        <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">
          Farm Health Score
        </div>
        <div className="text-lg font-display font-bold text-green-600">
          82 / 100
        </div>
        <div className="text-xs text-green-600 mt-1">
          🟢 Healthy
        </div>
      </div>

      {/* Expected Harvest */}
      <div className="stat-card border-l-4 border-blue-400">
        <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">
          Expected Harvest
        </div>
        <div className="text-lg font-display font-bold text-forest-800">
          4.2 Tons/Acre
        </div>
        <div className="text-xs text-forest-400 mt-1">
          Stable crop growth expected
        </div>
      </div>

      {/* Expected Profit */}
      <div className="stat-card border-l-4 border-purple-400">
        <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">
          Expected Profit
        </div>
        <div className="text-lg font-display font-bold text-forest-800">
          ₹52,000
        </div>
        <div className="text-xs text-green-600 mt-1">
          📈 +12% compared to last season
        </div>
      </div>

    </div>
  )
}