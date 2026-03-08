import React from 'react';
import AppLayout from '../components/AppLayout';
import { Siren } from 'lucide-react';

const EmergencyResponse: React.FC = () => {
  return (
    <AppLayout title="通用应急应用 (Emergency Application)">
      <div className="flex flex-col items-center justify-center h-[60vh] text-center border border-red-500/20 bg-red-500/5 rounded-2xl">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Siren size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Emergency Command Protocol</h2>
        <p className="text-slate-400 max-w-md">Instantly deploy nearby drones, robotic dogs, and ground units for coordinated emergency resolution. Real-time datalink active.</p>
        <button className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded font-bold shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all uppercase tracking-wide">
          Initiate Red Alert Task
        </button>
      </div>
    </AppLayout>
  );
};

export default EmergencyResponse;

