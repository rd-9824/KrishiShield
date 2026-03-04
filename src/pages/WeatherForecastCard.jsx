import { Cloud, Droplets, Wind } from "lucide-react";

export default function WeatherForecastCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      
      <div className="flex items-center gap-2 text-[#1f5f3d] text-lg font-semibold">
        <Cloud className="w-5 h-5" />
        Weather Forecast
      </div>

      <div className="bg-[#f0f9f4] rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">Tomorrow</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌧</span>
            <span className="text-xl font-bold text-[#1f5f3d]">28°C</span>
          </div>
        </div>

        <p className="text-gray-700 font-medium mb-3">
          Light Rain Expected
        </p>

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#16a34a]" />
            65% Humidity
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#16a34a]" />
            12 km/h
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Rain will improve soil moisture levels and help your crops grow better.
      </div>

    </div>
  );
}