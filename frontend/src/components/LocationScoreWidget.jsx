import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

const LocationScoreWidget = ({ score }) => {
  const roundedScore = Math.round(score);

  let status = '';
  let colorClass = '';
  let bgClass = '';
  let progressClass = '';
  let Icon = Shield;
  let description = '';

  if (score > 75) {
    status = 'Highly Viable';
    colorClass = 'text-emerald-600';
    bgClass = 'bg-emerald-50 border-emerald-100';
    progressClass = 'bg-emerald-500';
    Icon = ShieldCheck;
    description = 'High customer footfall, favorable demographic match, and low competition density make this zone extremely attractive.';
  } else if (score >= 50) {
    status = 'Moderate Risk';
    colorClass = 'text-amber-600';
    bgClass = 'bg-amber-50 border-amber-100';
    progressClass = 'bg-amber-500';
    Icon = Shield;
    description = 'Adequate demand but higher competitor density or phase-specific footfall volatility. Requires active market differentiation.';
  } else {
    status = 'Saturated/Low Footfall';
    colorClass = 'text-rose-600';
    bgClass = 'bg-rose-50 border-rose-100';
    progressClass = 'bg-rose-500';
    Icon = ShieldAlert;
    description = 'Significant competition saturation or poor footfall index. Entering this zone presents a high risk of low margins.';
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location Suitability</h4>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass} ${bgClass}`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
          </span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className={`text-5xl font-extrabold tracking-tight ${colorClass}`}>{score}%</span>
        </div>

        {/* Progress track */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${progressClass}`} 
            style={{ width: `${roundedScore}%` }}
          />
        </div>
      </div>

      <p className="text-slate-500 text-xs leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
};

export default LocationScoreWidget;
