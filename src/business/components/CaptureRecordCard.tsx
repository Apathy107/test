import React from 'react';
import { MapPin, Clock, Cpu, FileBox } from 'lucide-react';
import { CaptureRecord } from '../types/drone';

interface Props {
  record?: CaptureRecord;
}

const defaultRecord: CaptureRecord = {
  id: 'CAP-2023-0801',
  imgUrl: 'https://images.unsplash.com/photo-1549313861-39fe9024fbd0?q=80&w=400&h=300&fit=crop',
  gps: '113.9351° E, 22.5312° N',
  time: '2023-10-24 14:32:01',
  algorithm: 'Vehicle Tracking v2',
  source: 'Drone-A01',
  status: 'uploaded'
};

const CaptureRecordCard: React.FC<Props> = ({ record = defaultRecord }) => {
  return (
    <div data-cmp="CaptureRecordCard" className="bg-[#141b2d] border border-slate-800 rounded-lg overflow-hidden group hover:border-cyan-500/50 transition-colors shadow-lg">
      {/* 缩略图区 */}
      <div className="h-40 w-full relative overflow-hidden bg-slate-900">
        <img 
          src={record.imgUrl} 
          alt="Capture Thumbnail" 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded shadow ${
            record.status === 'uploaded' ? 'bg-cyan-500/80 text-white' : 'bg-red-500/80 text-white'
          }`}>
            {record.status}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] text-white flex items-center">
          <FileBox size={10} className="mr-1" /> {record.source}
        </div>
      </div>
      
      {/* 信息区 */}
      <div className="p-4 space-y-2">
        <div className="flex items-start">
          <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0 mr-2" />
          <span className="text-xs text-slate-300 font-mono tracking-tight">{record.gps}</span>
        </div>
        <div className="flex items-center">
          <Clock size={14} className="text-slate-400 shrink-0 mr-2" />
          <span className="text-xs text-slate-400">{record.time}</span>
        </div>
        <div className="flex items-center">
          <Cpu size={14} className="text-cyan-400/70 shrink-0 mr-2" />
          <span className="text-xs text-cyan-400/80 font-medium truncate">{record.algorithm}</span>
        </div>
        
        <div className="pt-3 mt-2 border-t border-slate-800 flex justify-between">
          <button className="text-xs text-slate-400 hover:text-cyan-400 transition-colors px-2 py-1">View Detail</button>
          <button className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1">Edit</button>
        </div>
      </div>
    </div>
  );
};

export default CaptureRecordCard;

