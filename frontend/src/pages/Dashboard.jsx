import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, History, LogOut, Package, MapPin, Calendar, Activity, ChevronRight } from 'lucide-react';

import DemandChart from '../components/DemandChart';
import LocationScoreWidget from '../components/LocationScoreWidget';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Auth Check
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('user_name') || 'Entrepreneur';

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Navigation and active view state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'history'

  // Form states
  const [niche, setNiche] = useState('Fast Food');
  const [location, setLocation] = useState('South Gate');
  const [month, setMonth] = useState(1);
  const [phase, setPhase] = useState('Resumption');

  // Prediction results state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  // History states
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // Dropdown options
  const niches = ['Fast Food', 'Electronics', 'POS/Fintech', 'Fashion', 'Stationery/Printing'];
  const locations = ['South Gate', 'North Gate', 'Obanla', 'Apatapiti', 'West Gate'];
  const phases = ['Resumption', 'Mid-Semester', 'Exams', 'Holidays'];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchHistory = async () => {
    if (!token) return;
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const response = await axios.get('http://localhost:8000/api/predictions/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistoryList(response.data);
    } catch (err) {
      console.error(err);
      setHistoryError('Failed to retrieve query logs.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch history when switching tabs
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const runAnalysis = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/predict',
        {
          business_category: niche,
          location_zone: location,
          target_month: parseInt(month),
          academic_phase: phase,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(response.data);
      // Trigger background update of history list
      fetchHistory();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to fetch prediction data. Please verify the Python backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 border-b border-slate-200 px-6 flex items-center gap-2">
            <img src="/futa_market_logo.png" alt="FUTA Market AI Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-slate-800 text-base">FUTA Market AI</span>
          </div>
          <div className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-brand-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'history'
                  ? 'bg-brand-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="px-2">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Signed In As</p>
            <p className="text-sm font-bold text-slate-700 truncate">{userName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {activeTab === 'overview' ? 'AI Market Analysis' : 'Query Log History'}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            FUTA Micro-Economy Active
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 flex-1 overflow-y-auto">
          {activeTab === 'overview' ? (
            <div className="space-y-6 max-w-6xl">
              {/* Introduction Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Predictive Insights Hub</h3>
                <p className="text-slate-500 text-sm font-normal">
                  Configure your business criteria below. Our machine learning engines will run simulations
                  predicting demand volume trajectory and ideal site matching scores tailored to the FUTA ecosystem.
                </p>
              </div>

              {/* Horizontal Query Form */}
              <form onSubmit={runAnalysis} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                      <Package className="w-3 h-3 text-brand-800" />
                      Business Category (Niche)
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition"
                    >
                      {niches.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-brand-800" />
                      Location Zone
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-brand-800" />
                      Launch Month
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          {new Date(2026, m - 1).toLocaleString('default', { month: 'long' })} ({m})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-brand-800" />
                      Academic Phase
                    </label>
                    <select
                      value={phase}
                      onChange={(e) => setPhase(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition"
                    >
                      {phases.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-brand-800 text-white rounded-lg font-medium hover:bg-brand-700 active:bg-brand-900 transition text-sm flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Analyzing FUTA micro-economy...
                      </>
                    ) : (
                      <>
                        Run AI Analysis
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-normal">
                  {error}
                </div>
              )}

              {/* Prediction Results Block */}
              {results && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  {/* Left Column (2/3 width) - Demand Forecast Line Chart */}
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">6-Month Demand Forecast</h4>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Peak: {Math.max(...results.demand_forecast)} units
                        </span>
                      </div>
                      <div className="h-64">
                        <DemandChart forecastData={results.demand_forecast} startMonth={month} />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 font-normal">
                      AI-predicted monthly demand volumes for {niche} in {location} starting in {new Date(2026, month - 1).toLocaleString('default', { month: 'long' })}.
                    </div>
                  </div>

                  {/* Right Column (1/3 width) - Location Suitability Score Widget */}
                  <div className="lg:col-span-1">
                    <LocationScoreWidget score={results.location_score} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Query History View (Database logs fetched)
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden max-w-6xl">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-800">Your AI Analysis History</h3>
                  <p className="text-xs text-slate-500 font-normal">All simulation runs executed under this account</p>
                </div>
                <button 
                  onClick={fetchHistory}
                  className="text-xs font-semibold text-brand-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
                >
                  Refresh
                </button>
              </div>
              
              {historyLoading ? (
                <div className="p-12 text-center text-slate-500">
                  <span className="w-6 h-6 border-2 border-brand-800 border-t-transparent rounded-full animate-spin inline-block mr-2 align-middle"></span>
                  Loading history log...
                </div>
              ) : historyError ? (
                <div className="p-6 text-center text-red-600 text-sm font-normal">{historyError}</div>
              ) : historyList.length === 0 ? (
                <div className="p-12 text-center">
                  <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">No Simulation Logs</h3>
                  <p className="text-slate-500 text-sm font-normal max-w-sm mx-auto">
                    You haven't run any AI market analysis simulations yet. Go back to Overview to execute your first model run!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 font-bold text-xs uppercase">
                        <th className="p-4 font-semibold">Timestamp</th>
                        <th className="p-4 font-semibold">Niche (Category)</th>
                        <th className="p-4 font-semibold">Location Zone</th>
                        <th className="p-4 font-semibold">Est. Target Demand</th>
                        <th className="p-4 font-semibold">Suitability Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                      {historyList.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="p-4 font-semibold text-slate-850">{log.queried_category}</td>
                          <td className="p-4">{log.target_location}</td>
                          <td className="p-4 font-medium">{log.predicted_demand} units</td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              log.suitability_score > 75 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : log.suitability_score >= 50
                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {log.suitability_score}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
