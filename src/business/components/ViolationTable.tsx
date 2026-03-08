import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ViolationData } from '../types/drone';

const mockData: ViolationData[] = [
  { id: 'V-1001', plate: '粤B·12345', deviceId: 'UAV-001', address: 'Shennan Ave Sec 5', type: 'Illegal Parking', code: '1039', time: '10-24 14:30', status: 'reported' },
  { id: 'V-1002', plate: '粤B·A8839', deviceId: 'UAV-002', address: 'Binhai Blvd', type: 'Speeding', code: '1603', time: '10-24 13:15', status: 'processing' },
  { id: 'V-1003', plate: '粤S·9K021', deviceId: 'CAM-X1', address: 'Nanshan Tech Park', type: 'Running Red Light', code: '1625', time: '10-24 09:45', status: 'warned' },
  { id: 'V-1004', plate: '粤B·88998', deviceId: 'UAV-001', address: 'Shennan Ave Sec 5', type: 'Illegal Lane Change', code: '1344', time: '10-24 08:20', status: 'reported' },
];

const ViolationTable: React.FC = () => {
  return (
    <div data-cmp="ViolationTable" className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 bg-slate-800/50 uppercase border-b border-slate-800">
            <tr>
              <th className="px-5 py-3 font-medium">Plate No.</th>
              <th className="px-5 py-3 font-medium">Device ID</th>
              <th className="px-5 py-3 font-medium">Address</th>
              <th className="px-5 py-3 font-medium">Type (Code)</th>
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {mockData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-4 font-mono text-cyan-400 font-medium">{row.plate}</td>
                <td className="px-5 py-4 text-slate-300">{row.deviceId}</td>
                <td className="px-5 py-4 text-slate-400 truncate max-w-[150px]">{row.address}</td>
                <td className="px-5 py-4">
                  <div className="text-slate-200">{row.type}</div>
                  <div className="text-xs text-slate-500">Code: {row.code}</div>
                </td>
                <td className="px-5 py-4 text-slate-400 text-xs">{row.time}</td>
                <td className="px-5 py-4">
                  {row.status === 'reported' && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      <CheckCircle2 size={12} className="mr-1" /> Reported
                    </span>
                  )}
                  {row.status === 'processing' && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Processing
                    </span>
                  )}
                  {row.status === 'warned' && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      <AlertTriangle size={12} className="mr-1" /> Warned
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right space-x-3">
                  <button className="text-cyan-400 hover:text-cyan-300 text-xs font-medium">Review</button>
                  <button className="text-slate-400 hover:text-slate-200 text-xs font-medium">Export</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViolationTable;

