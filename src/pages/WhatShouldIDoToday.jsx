import { Sprout } from "lucide-react";

export default function WhatShouldIDoToday() {
  return (
    <div className="bg-gradient-to-br from-[#16a34a] to-[#15803d] text-white rounded-2xl shadow-lg p-6 space-y-4">
      
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Sprout className="w-6 h-6" />
          What Should I Do Today?
        </h2>
        <p className="text-sm text-white/80">
          Today's Recommendations
        </p>
      </div>

      {/* Irrigation */}
      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💧</div>
          <div>
            <h4 className="font-semibold text-lg">
              Irrigation Suggested
            </h4>
            <p className="text-sm text-white/90">
              Soil moisture is slightly low. Consider light irrigation today or tomorrow morning.
            </p>
          </div>
        </div>
      </div>

      {/* Fertilizer */}
      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🧪</div>
          <div>
            <h4 className="font-semibold text-lg">
              Fertilizer Window
            </h4>
            <p className="text-sm text-white/90">
              Best time to apply nitrogen fertilizer in next 3 days.
            </p>
          </div>
        </div>
      </div>

      {/* Pest */}
      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">⚠️</div>
          <div>
            <h4 className="font-semibold text-lg">
              Pest Monitoring
            </h4>
            <p className="text-sm text-white/90">
              Weather conditions may increase pest risk. Check crops regularly.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}