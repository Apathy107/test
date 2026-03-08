import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { Video, Building2, Siren, ArrowRight } from 'lucide-react';

const BusinessHub: React.FC = () => {
  console.log('BusinessHub page loaded');

  const modules = [
    { 
      title: '交通非现执法', 
      desc: 'Traffic Non-site Enforcement. Automated drone capture, AI analysis, and violation upload.',
      icon: Video, 
      path: '/business/traffic', 
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
    },
    { 
      title: '城市综合治理', 
      desc: 'Urban Comprehensive Governance. Patrols, event review, and work order management.',
      icon: Building2, 
      path: '/business/urban', 
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
    },
    { 
      title: '通用应急应用', 
      desc: 'General Emergency Application. Rapid response, multi-device sync, and real-time data.',
      icon: Siren, 
      path: '/business/emergency', 
      color: 'bg-red-500/10 text-red-400 border-red-500/30' 
    }
  ];

  return (
    <AppLayout title="业务应用中心主页 (Business Application Center)">
      <div className="max-w-5xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Drone Fleet Operations Hub</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Select a specialized module below to access real-time telemetry, automated enforcement tools, and governance dashboards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod, idx) => (
            <Link key={idx} to={mod.path} className="group block h-full">
              <div className="bg-[#141b2d] border border-slate-800 rounded-2xl p-6 h-full flex flex-col hover:border-slate-500 transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden">
                <div className={`p-4 rounded-xl inline-flex w-fit mb-6 ${mod.color}`}>
                  <mod.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{mod.title}</h3>
                <p className="text-slate-400 text-sm flex-1 leading-relaxed">{mod.desc}</p>
                <div className="mt-6 flex items-center text-sm font-medium text-slate-500 group-hover:text-cyan-400 transition-colors">
                  Enter Module <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default BusinessHub;

