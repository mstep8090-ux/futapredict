import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Coins, 
  Sparkles,
  ArrowUpRight,
  Info,
  Percent
} from 'lucide-react';

const AnalyticsDashboard = ({ data, startMonth, productName, locationName }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Format data for the 6-month AreaChart
  const demandChartData = data.demand_trend.map((value, index) => {
    const currentMonthIndex = (startMonth + index - 1) % 12;
    return {
      name: monthNames[currentMonthIndex],
      demand: value
    };
  });

  // Format data for the Footfall vs Saturation chart
  const comparisonData = [
    {
      name: 'Footfall Index',
      value: data.location_metrics.footfall_index,
      fill: '#6366f1' // indigo-500
    },
    {
      name: 'Competitor Saturation',
      value: data.location_metrics.saturation_level,
      fill: data.location_metrics.saturation_level > 60 ? '#f43f5e' : '#f59e0b' // rose-500 or amber-500
    }
  ];

  // Helper to format currency
  const formatNaira = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const isSaturationHigh = data.location_metrics.saturation_level > 60;

  return (
    <div className="space-y-6">
      {/* Grid Layout: Bento-Box Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Expected ROI */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[200px] hover:shadow-lg transition duration-200">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected ROI</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Percent className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                +{data.financial_forecast.expected_roi_percentage}%
              </div>
              <div className="flex items-center mt-1.5">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  High Yield
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-[11px] mt-4 pt-3 border-t border-slate-100 font-normal leading-relaxed">
            Annualized profit return rate scaled by FUTA season models.
          </p>
        </div>

        {/* Card 2: Location Saturation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[200px] hover:shadow-lg transition duration-200">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location Saturation</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isSaturationHigh 
                  ? 'bg-rose-50 border-rose-100 text-rose-500' 
                  : 'bg-amber-50 border-amber-100 text-amber-500'
              }`}>
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-4xl font-extrabold tracking-tight ${isSaturationHigh ? 'text-rose-600' : 'text-slate-800'}`}>
                {data.location_metrics.saturation_level}%
              </div>
              <div className="flex items-center mt-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  isSaturationHigh 
                    ? 'bg-rose-50 text-rose-700 animate-pulse' 
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  {isSaturationHigh ? 'High Risk' : 'Moderate'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-[11px] mt-4 pt-3 border-t border-slate-100 font-normal leading-relaxed">
            Competitive density index measured across {locationName}.
          </p>
        </div>

        {/* Card 3: Capital Recommendation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[200px] hover:shadow-lg transition duration-200">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Allocation</span>
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-800">
                <Coins className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold tracking-tight text-slate-800 truncate">
                {formatNaira(data.financial_forecast.recommended_capital_allocation)}
              </div>
              <div className="flex items-center mt-1.5">
                <span className="text-[10px] font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-full">
                  Rec. Allocation
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-[11px] mt-4 pt-3 border-t border-slate-100 font-normal leading-relaxed">
            Suggested initial stock allocation of capital to optimize cash liquidity.
          </p>
        </div>

      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Middle Left: 6-Month Demand AreaChart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-brand-850" />
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              6-Month Demand volume trend for {productName}
            </h4>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl text-white text-xs">
                          <p className="font-bold text-slate-400">{label}</p>
                          <p className="text-brand-300 font-bold mt-1">Predicted Demand: <span className="text-white font-extrabold">{payload[0].value} units</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="demand" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Middle Right: Footfall Index vs Competitor Density Custom Sleek Metrics */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition duration-200">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Footfall vs Saturation
              </h4>
            </div>

            <div className="space-y-6 py-2">
              {/* Footfall Progress Block */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                    <span className="text-xs font-bold text-slate-650">Footfall Index</span>
                  </div>
                  <span className="text-xs font-black text-indigo-650 bg-indigo-50/60 px-2 py-0.5 rounded-md">
                    {data.location_metrics.footfall_index}%
                  </span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-2.5 overflow-hidden border border-slate-100/50 shadow-inner">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.25)] transition-all duration-500"
                    style={{ width: `${data.location_metrics.footfall_index}%` }}
                  ></div>
                </div>
              </div>

              {/* Saturation Progress Block */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${isSaturationHigh ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                    <span className="text-xs font-bold text-slate-650">Competitor Saturation</span>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                    isSaturationHigh 
                      ? 'text-rose-650 bg-rose-50/60' 
                      : 'text-amber-650 bg-amber-50/60'
                  }`}>
                    {data.location_metrics.saturation_level}%
                  </span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-2.5 overflow-hidden border border-slate-100/50 shadow-inner">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                      isSaturationHigh 
                        ? 'from-rose-500 to-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.25)]' 
                        : 'from-amber-500 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                    }`}
                    style={{ width: `${data.location_metrics.saturation_level}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-normal leading-relaxed">
            Comparing local pedestrian flow indices to vendor market congestion metrics at {locationName}.
          </div>
        </div>

      </div>

      {/* Bottom Row: AI strategy text in highlighted glassmorphism card */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start gap-4">
        {/* Glow */}
        <div className="absolute top-[-50%] left-[-20%] w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
        
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-brand-400 shrink-0 relative z-10">
          <Sparkles className="w-5 h-5 text-brand-400" />
        </div>
        
        <div className="space-y-2 relative z-10">
          <h5 className="text-xs font-bold text-brand-400 uppercase tracking-wider">AI Marketing Insight</h5>
          <p className="text-slate-300 text-sm leading-relaxed font-normal">
            "{data.ai_strategy}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
