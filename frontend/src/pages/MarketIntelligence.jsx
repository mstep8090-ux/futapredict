import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Brain, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Loader2, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  Percent,
  CheckCircle,
  XCircle,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const MarketIntelligence = () => {
  const token = localStorage.getItem('token');

  // Static product mapping for cascading dropdowns
  const productData = {
    'Fast Food': [
      'Shawarma', 'Burgers', 'Fried Rice/Jollof', 
      'Noodles (Indomie/Egg)', 'Meatpie/Pastries', 'Roasted Plantain (Boli)'
    ],
    'Electronics': [
      'Power Banks', 'Laptops (Used/New)', 'Phone Chargers/Cords', 
      'AirPods/Earpieces', 'Ring Lights'
    ],
    'Fashion': [
      'Branded FUTA Hoodies', 'Vintage Shirts', 'Sneakers', 
      'Crocs', 'Perfumes/Oils'
    ],
    'Provisions': [
      'Garri', 'Spaghetti', 'Palm/Groundnut Oil', 
      'Beverages (Milo/Milk)', 'Toiletries'
    ],
    'Services': [
      'POS Operations', 'Laptop Repair', 'Phone Screen Replacement', 
      'Hairdressing/Barbing', 'Photocopy/Printing'
    ]
  };

  const categories = Object.keys(productData);

  // Grouped FUTA locations
  const campusLocations = [
    'Student Union Building (SUB)', 'ETF Lecture Theatre', 'CCE', 
    'Obafemi Awolowo Hall', 'Akindeko Hall', 'FCSC (Cooperative)'
  ];

  const offCampusLocations = [
    'South Gate', 'North Gate', 'West Gate', 'Obanla', 
    'Apatapiti', 'Stateline Junction', 'FUTA Road'
  ];

  // Cascading dropdown states
  const [selectedCategory, setSelectedCategory] = useState('Fast Food');
  const [selectedProduct, setSelectedProduct] = useState('Shawarma');
  const [selectedLocation, setSelectedLocation] = useState('Student Union Building (SUB)');
  const [capital, setCapital] = useState(150000);
  const [launchDate, setLaunchDate] = useState('2026-09-15');
  const [phase, setPhase] = useState('Resumption');

  // API Call states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  // Handle Category change to update cascading product options
  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setSelectedProduct(productData[cat][0]);
  };

  const handleAnalysisSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await api.post(
        '/api/predict',
        {
          specific_product: selectedProduct,
          investment_capital: parseFloat(capital),
          launch_date: launchDate,
          location_zone: selectedLocation,
          academic_phase: phase
        }
      );
      setResults(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Connection failed. Please verify the FastAPI backend is running on port 8000.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNaira = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStartMonth = () => {
    try {
      return parseInt(launchDate.split('-')[1]);
    } catch (e) {
      return 1;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">FUTA Market Intelligence Builder</h3>
        <p className="text-slate-500 text-sm mt-1 font-normal">
          Evaluate site suitability, forecast product demand, and compute expected ROI using our FUTA micro-economy machine learning models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form (1/3 width) */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-800" />
            Query Builder
          </h4>

          <form onSubmit={handleAnalysisSubmit} className="space-y-5">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Select Category</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Product Select (Cascading) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Select Specific Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              >
                {productData[selectedCategory].map((prod) => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </select>
            </div>

            {/* Location Select (Grouped with Map Pin Icon) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Select Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              >
                <optgroup label="Inside Campus">
                  {campusLocations.map((loc) => (
                    <option key={loc} value={loc}>📍 {loc}</option>
                  ))}
                </optgroup>
                <optgroup label="Off-Campus">
                  {offCampusLocations.map((loc) => (
                    <option key={loc} value={loc}>📍 {loc}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Capital Input (Formatted) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex justify-between">
                <span>Planned Investment Capital (₦)</span>
                <span className="text-[10px] text-brand-800 font-bold">Naira</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₦</span>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(parseInt(e.target.value) || 0)}
                  min="5000"
                  step="5000"
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
                />
              </div>
            </div>

            {/* Launch Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Launch Date</label>
              <input
                type="date"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              />
            </div>

            {/* Academic Phase */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex justify-between">
                <span>Starting Academic Phase</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer" title="Expected phase at launch month" />
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
              >
                <option value="Resumption">Resumption</option>
                <option value="Mid-Semester">Mid-Semester</option>
                <option value="Exams">Exams</option>
                <option value="Holidays">Holidays</option>
              </select>
            </div>

            {/* Predict Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-800 to-indigo-900 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-900 transition-all duration-150 text-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing FUTA micro-economy...
                </>
              ) : (
                <>
                  Run AI Predictive Analysis
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Visualization Dashboard (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-normal flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {results ? (
            <AnalyticsDashboard 
              data={results} 
              startMonth={getStartMonth()} 
              productName={selectedProduct} 
              locationName={selectedLocation} 
            />
          ) : (
            <div className="bg-slate-100/50 border border-dashed border-slate-300 rounded-2xl py-24 text-center text-slate-400 flex flex-col justify-center items-center gap-3">
              <Brain className="w-12 h-12 text-slate-300" />
              <p className="text-sm font-semibold max-w-sm">
                Run an AI analysis query to model student footfall, competitor densities, and financial yields.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
