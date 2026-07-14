import React, { useState } from 'react';
import { User, Mail, Briefcase, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const userName = localStorage.getItem('user_name') || 'FUTA Merchant';
  const userEmail = localStorage.getItem('user_email') || 'merchant@futa.edu.ng';
  const userInterest = localStorage.getItem('user_interest') || 'Fast Food & Eatery';

  const [name, setName] = useState(userName);
  const [interest, setInterest] = useState(userInterest);
  const [message, setMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_interest', interest);
    setMessage('Settings updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const businessCategories = [
    'Fast Food & Eatery',
    'Electronics & Gadgets',
    'Fashion & Apparel',
    'Provisions & Groceries',
    'Services'
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">Account Settings</h3>
        <p className="text-slate-500 text-sm mt-1 font-normal">
          Manage your student merchant profile details and preferences.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Merchant Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
          />
        </div>

        {/* Email - Readonly */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Email Address
          </label>
          <input
            type="email"
            value={userEmail}
            readOnly
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-400 bg-slate-50 cursor-not-allowed text-sm font-medium focus:outline-none"
          />
          <p className="text-[10px] text-slate-400 mt-1 font-normal">Your account email address cannot be changed.</p>
        </div>

        {/* Primary Business Interest */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            Primary Business Sector
          </label>
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 text-sm transition font-medium"
          >
            {businessCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 hover:shadow-lg transition text-sm font-semibold"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
