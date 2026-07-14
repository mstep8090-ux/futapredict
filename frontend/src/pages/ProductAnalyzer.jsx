import React, { useState } from 'react';
import api from '../services/api';
import { 
  Building, 
  MapPin, 
  ChevronRight, 
  Loader2, 
  TrendingUp, 
  Percent, 
  Award,
  AlertCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';

const ProductAnalyzer = () => {
  const token = localStorage.getItem('token');

  // Locations list
  const campusLocations = [
    'Student Union Building (SUB)', 'ETF Lecture Theatre', 'CCE', 
    'Obafemi Awolowo Hall', 'Akindeko Hall', 'FCSC (Cooperative)'
  ];

  const offCampusLocations = [
    'South Gate', 'North Gate', 'West Gate', 'Obanla', 
    'Apatapiti', 'Stateline Junction', 'FUTA Road'
  ];

  const [selectedLocation, setSelectedLocation] = useState('Student Union Building (SUB)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comparisonResults, setComparisonResults] = useState([]);

  // Products to compare
  const comparisonProducts = [
    { name: 'Noodles (Indomie/Egg)', category: 'Fast Food' },
    { name: 'Branded FUTA Hoodies', category: 'Fashion' },
    { name: 'Phone Chargers/Cords', category: 'Electronics' },
    { name: 'Garri', category: 'Provisions' },
    { name: 'POS Operations', category: 'Services' }
  ];

  const runComparison = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setComparisonResults([]);

    const resultsBuffer = [];

    try {
      // Loop through each product and call prediction API
      for (const prod of comparisonProducts) {
        const response = await api.post(
          '/api/predict',
          {
            specific_product: prod.name,
            investment_capital: 100000.0,
            launch_date: '2026-09-15',
            location_zone: selectedLocation,
            academic_phase: 'Resumption'
          }
        );

        resultsBuffer.push({
          product: prod.name,
          category: prod.category,
          demand: response.data.demand_trend[0],
          suitability: response.data.location_metrics.viability_status,
          score: response.data.location_score,
          roi: response.data.financial_forecast.expected_roi_percentage
        });
      }

      // Sort by suitability score descending
      resultsBuffer.sort((a, b) => b.score - a.score);
      setComparisonResults(resultsBuffer);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch comparison data. Check if uvicorn is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">Product Niche Comparison Matrix</h3>
        <p className="text-slate-500 text-sm mt-1 font-normal">
          Select a FUTA location to compare how different products perform side-by-side. 
          Discover the highest yielding product niches for your chosen site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form: Select Location */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-850" />
            Comparison Target Site
          </h4>

          <form onSubmit={runComparison} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Select Zone
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              >
                <optgroup label="Inside Campus">
                  {campusLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </optgroup>
                <optgroup label="Off-Campus">
                  {offCampusLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 hover:shadow-lg transition text-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Comparing niches...
                </>
              ) : (
                <>
                  Analyze Location Niches
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Columns: Comparison Results */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-normal flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {comparisonResults.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-brand-800" />
                  Niche Rankings for {selectedLocation}
                </h4>
                <p className="text-xs text-slate-500 font-normal mt-0.5">Products sorted by AI suitability score</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 font-bold text-xs uppercase">
                      <th className="p-4 font-semibold pl-6">Rank & Product</th>
                      <th className="p-4 font-semibold">Base Sector</th>
                      <th className="p-4 font-semibold">Suitability Score</th>
                      <th className="p-4 font-semibold">Est. Target Demand</th>
                      <th className="p-4 font-semibold pr-6">Expected ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                    {comparisonResults.map((res, index) => (
                      <tr key={res.product} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 pl-6 flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-850">{res.product}</span>
                        </td>
                        <td className="p-4 text-slate-500">{res.category}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            res.score > 75 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : res.score >= 50
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {res.suitability} ({res.score}%)
                          </span>
                        </td>
                        <td className="p-4 font-medium">{res.demand} units</td>
                        <td className="p-4 pr-6 font-bold text-brand-850 flex items-center gap-0.5">
                          <Percent className="w-3 h-3 text-slate-405" />
                          {res.roi}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100/50 border border-dashed border-slate-300 rounded-2xl py-24 text-center text-slate-400 flex flex-col justify-center items-center gap-3">
              <Briefcase className="w-12 h-12 text-slate-300" />
              <p className="text-sm font-semibold max-w-sm">
                Select a target site and trigger the comparison tool to see side-by-side product metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAnalyzer;
