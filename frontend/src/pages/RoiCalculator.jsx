import React, { useState } from 'react';
import { DollarSign, Percent, ShieldCheck, HelpCircle, AlertCircle, BarChart3 } from 'lucide-react';

const RoiCalculator = () => {
  // Calculator states
  const [capital, setCapital] = useState(150000);
  const [unitCost, setUnitCost] = useState(1200);
  const [sellingPrice, setSellingPrice] = useState(2000);
  const [monthlyVolume, setMonthlyVolume] = useState(250);
  const [fixedOverhead, setFixedOverhead] = useState(15000); // e.g., rent/transport

  // Calculations
  const unitProfit = Math.max(0, sellingPrice - unitCost);
  const grossMargin = sellingPrice > 0 ? ((unitProfit / sellingPrice) * 100).toFixed(1) : 0;
  
  const monthlyRevenue = sellingPrice * monthlyVolume;
  const monthlyGrossProfit = unitProfit * monthlyVolume;
  const monthlyNetProfit = Math.max(0, monthlyGrossProfit - fixedOverhead);
  
  const breakEvenVolume = unitProfit > 0 ? Math.ceil(fixedOverhead / unitProfit) : 0;
  const yearlyReturnRate = capital > 0 ? (((monthlyNetProfit * 12) / capital) * 100).toFixed(1) : 0;

  // Format currency
  const formatNaira = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">Merchant ROI & Margin Calculator</h3>
        <p className="text-slate-500 text-sm mt-1 font-normal">
          Simulate startup margins, break-even unit volumes, and projected annualized returns on your investment capital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-105 pb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-850" />
            Financial Parameters
          </h4>

          {/* Investment Capital */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Initial Investment (₦)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">₦</span>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              />
            </div>
          </div>

          {/* Unit Cost */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Cost Price / Unit (₦)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">₦</span>
              <input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              />
            </div>
          </div>

          {/* Selling Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Selling Price / Unit (₦)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">₦</span>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              />
            </div>
          </div>

          {/* Monthly Sales Volume */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Est. Monthly Unit Sales</label>
            <input
              type="number"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
            />
          </div>

          {/* Fixed Overhead */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex justify-between">
              <span>Monthly Fixed Overhead</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer" title="Rent, transport, electricity" />
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">₦</span>
              <input
                type="number"
                value={fixedOverhead}
                onChange={(e) => setFixedOverhead(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calculations Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Financial KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profit Margin */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Gross Profit Margin</span>
              <span className="text-2xl font-black text-brand-800 flex items-center gap-0.5">
                {grossMargin}%
                <Percent className="w-4 h-4 text-brand-500" />
              </span>
              <span className="text-slate-400 text-[10px] block mt-1.5">Percentage of selling price that is markup</span>
            </div>

            {/* Break Even */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Break-Even Volume</span>
              <span className="text-2xl font-black text-slate-800">{breakEvenVolume} units</span>
              <span className="text-slate-400 text-[10px] block mt-1.5">Units to sell monthly to cover overheads</span>
            </div>

            {/* Annual Return Rate */}
            <div className={`rounded-2xl p-6 shadow-sm border ${
              yearlyReturnRate > 50 
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' 
                : yearlyReturnRate > 15 
                ? 'bg-indigo-50/50 border-indigo-200 text-indigo-800' 
                : 'bg-rose-50/50 border-rose-200 text-rose-800'
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-70">Annualized ROI Estimate</span>
              <span className="text-2xl font-black">{yearlyReturnRate}%</span>
              <span className="text-[10px] block mt-1.5 opacity-80">Projected returns over a 12-month period</span>
            </div>
          </div>

          {/* Detailed Projections Sheet */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
              Monthly Cashflow Projection Sheet
            </h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-slate-500 font-normal">Gross Revenue</span>
                <span className="text-slate-800 font-semibold">{formatNaira(monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-t border-slate-50">
                <span className="text-slate-500 font-normal">Cost of Goods Sold (COGS)</span>
                <span className="text-rose-600 font-medium">- {formatNaira(unitCost * monthlyVolume)}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-t border-slate-50">
                <span className="text-slate-500 font-normal">Gross Profit</span>
                <span className="text-slate-800 font-semibold">{formatNaira(monthlyGrossProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-t border-slate-50">
                <span className="text-slate-500 font-normal">Operating Overhead (Rent/Logistics)</span>
                <span className="text-rose-600 font-medium">- {formatNaira(fixedOverhead)}</span>
              </div>
              
              <div className="flex justify-between items-center text-base font-bold py-3 border-t border-slate-200 text-slate-800">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Projected Net Profit
                </span>
                <span className="text-emerald-700 text-lg">{formatNaira(monthlyNetProfit)}</span>
              </div>
            </div>
          </div>

          {/* Helpful tips box */}
          {sellingPrice <= unitCost && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-normal flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                <strong>Pricing Alert:</strong> Your unit selling price is less than or equal to your unit cost price. You will run at a loss. Increase your selling price or source materials at a lower cost!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoiCalculator;
