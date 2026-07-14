import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  History, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Activity, 
  Bookmark,
  Calendar,
  AlertCircle
} from 'lucide-react';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('user_name') || 'FUTA Merchant';
  const userInterest = localStorage.getItem('user_interest') || 'Fast Food & Eatery';

  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/predictions/history');
      setHistoryList(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the database to retrieve prediction history logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Welcome, {userName}!</h3>
          <p className="text-slate-500 text-sm mt-1 font-normal">
            Analyze campus micro-economic demand trends and plan your capital allocation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-150/60 px-3.5 py-2 rounded-xl font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          FUTA Ticker: Connected
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Niche Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-brand-800" />
            Registered Sector
          </p>
          <p className="text-xl font-bold text-slate-800">{userInterest}</p>
          <p className="text-slate-400 text-xs mt-2 font-normal">Your primary target industry category</p>
        </div>

        {/* Total Simulations Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-brand-800" />
            Model Simulations Run
          </p>
          <p className="text-3xl font-extrabold text-slate-800">{historyList.length}</p>
          <p className="text-slate-400 text-xs mt-2 font-normal">Total AI queries logged on this profile</p>
        </div>

        {/* Micro-economy state Card */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-36 h-36 bg-brand-500/10 rounded-full blur-2xl"></div>
          <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            FUTA Campus Status
          </p>
          <p className="text-xl font-bold">Mid-Semester Phase</p>
          <p className="text-slate-350 text-xs mt-2 font-normal">High student activity & liquidity</p>
        </div>
      </div>

      {/* History Log Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <History className="w-4 h-4 text-brand-800" />
              Your Simulation Logs
            </h4>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Audit log of all queries run by your account</p>
          </div>
          <button 
            onClick={fetchHistory}
            className="text-xs font-semibold text-brand-800 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            Refresh Logs
          </button>
        </div>

        {error && (
          <div className="p-6 bg-rose-50 border-b border-rose-100 text-rose-600 text-sm font-normal flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <span className="w-6 h-6 border-2 border-brand-800 border-t-transparent rounded-full animate-spin inline-block mr-2 align-middle"></span>
            Retrieving database records...
          </div>
        ) : historyList.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h5 className="text-base font-bold text-slate-800 mb-1">No Simulation Logs</h5>
            <p className="text-slate-500 text-sm font-normal max-w-sm mx-auto">
              You haven't run any business models yet. Head over to the Product Analyzer panel to run your first simulation!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 font-bold text-xs uppercase">
                  <th className="p-4 font-semibold pl-6">Timestamp</th>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Location Zone</th>
                  <th className="p-4 font-semibold">Predicted Demand</th>
                  <th className="p-4 font-semibold pr-6">Suitability Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {historyList.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 text-slate-500 pl-6">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{log.queried_product}</td>
                    <td className="p-4 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {log.target_location}
                    </td>
                    <td className="p-4 font-medium">{log.predicted_demand} units</td>
                    <td className="p-4 pr-6">
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
    </div>
  );
};

export default DashboardOverview;
