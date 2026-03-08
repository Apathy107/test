import React, { useState } from 'react';
import { X, User, CheckCircle, AlertTriangle, ShieldCheck, ShieldX, Search, ChevronRight } from 'lucide-react';

// Pilot data with qualification info
interface Pilot {
  id: string;
  name: string;
  department: string;
  level: string;
  qualified: boolean;
  online: boolean;
  certNo: string;
  expiry: string;
}

const PILOTS: Pilot[] = [
  { id: 'P001', name: '李明', department: '东城分局', level: '高级飞手', qualified: true, online: true, certNo: 'CAAC-2024-0821', expiry: '2026-08-01' },
  { id: 'P002', name: '王芳', department: '西城分局', level: '中级飞手', qualified: true, online: true, certNo: 'CAAC-2023-1104', expiry: '2025-11-04' },
  { id: 'P003', name: '赵雷', department: '南区支队', level: '初级飞手', qualified: false, online: true, certNo: 'CAAC-2022-0312', expiry: '2024-03-12' },
  { id: 'P004', name: '陈静', department: '北区支队', level: '高级飞手', qualified: true, online: false, certNo: 'CAAC-2024-0507', expiry: '2026-05-07' },
];

type Step = 'select' | 'verify' | 'unqualified_confirm' | 'success';

interface TransferControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferControlModal({ isOpen, onClose }: TransferControlModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [selected, setSelected] = useState<Pilot | null>(null);
  const [search, setSearch] = useState('');
  const [verifying, setVerifying] = useState(false);

  const filtered = PILOTS.filter(p =>
    p.name.includes(search) || p.department.includes(search)
  );

  const handleSelect = (pilot: Pilot) => {
    setSelected(pilot);
  };

  const handleVerify = () => {
    if (!selected) return;
    setVerifying(true);
    // Simulate async qualification check
    setTimeout(() => {
      setVerifying(false);
      if (selected.qualified) {
        setStep('verify');
      } else {
        setStep('unqualified_confirm');
      }
    }, 1200);
  };

  const handleConfirmTransfer = () => {
    setStep('success');
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setStep('select');
    setSelected(null);
    setSearch('');
    setVerifying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      data-cmp="TransferControlModal"
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative w-[520px] rounded-sm tech-border flex flex-col overflow-hidden"
        style={{ background: 'rgba(10, 18, 35, 0.98)', boxShadow: '0 0 40px rgba(0,229,255,0.15)' }}
      >
        {/* Modal Header */}
        <div className="h-12 flex items-center justify-between px-5 border-b border-border bg-gradient-to-r from-secondary/40 to-transparent flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded"></div>
            <span className="text-sm font-bold tracking-widest text-primary">移交飞行控制权</span>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step: Select Pilot */}
        <div style={{ display: step === 'select' ? 'flex' : 'none' }} className="flex-col flex-1 p-5 gap-4">
          <p className="text-xs text-muted-foreground">请选择接管飞行控制权的飞手，系统将自动进行资质验证。</p>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm rounded bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              placeholder="搜索飞手姓名或所属部门..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Pilot List */}
          <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
            {filtered.map(pilot => (
              <div
                key={pilot.id}
                onClick={() => handleSelect(pilot)}
                className="flex items-center gap-3 p-3 rounded cursor-pointer transition-all border"
                style={{
                  borderColor: selected?.id === pilot.id ? 'rgba(0,229,255,0.6)' : 'rgba(30,58,138,0.5)',
                  background: selected?.id === pilot.id ? 'rgba(0,229,255,0.08)' : 'rgba(15,23,42,0.5)',
                  boxShadow: selected?.id === pilot.id ? '0 0 10px rgba(0,229,255,0.1)' : 'none',
                }}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border"
                  style={{ background: 'rgba(30,58,138,0.4)', borderColor: pilot.online ? 'rgba(34,197,94,0.5)' : 'rgba(100,116,139,0.4)' }}>
                  <User size={18} className="text-primary" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{pilot.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border"
                      style={{ borderColor: pilot.qualified ? 'rgba(0,229,255,0.4)' : 'rgba(239,68,68,0.4)', color: pilot.qualified ? 'rgba(0,229,255,1)' : 'rgba(239,68,68,1)', background: pilot.qualified ? 'rgba(0,229,255,0.08)' : 'rgba(239,68,68,0.08)' }}>
                      {pilot.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{pilot.department} · 证书: {pilot.certNo}</p>
                </div>
                {/* Status */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: pilot.online ? 'rgb(34,197,94)' : 'rgb(100,116,139)' }}></div>
                    <span className="text-[10px]" style={{ color: pilot.online ? 'rgb(34,197,94)' : 'rgb(100,116,139)' }}>{pilot.online ? '在线' : '离线'}</span>
                  </div>
                  {selected?.id === pilot.id && <ChevronRight size={14} className="text-primary" />}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-border">
            <button onClick={handleClose} className="flex-1 py-2.5 text-sm rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">取消</button>
            <button
              onClick={handleVerify}
              disabled={!selected || verifying}
              className="flex-1 py-2.5 text-sm rounded font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: selected ? 'rgba(0,229,255,1)' : 'rgba(30,41,59,1)', color: selected ? 'rgb(9,14,23)' : 'rgb(100,116,139)' }}
            >
              {verifying ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                  资质验证中...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  验证并移交
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step: Verify Passed (Qualified) */}
        <div style={{ display: step === 'verify' ? 'flex' : 'none' }} className="flex-col p-8 items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.1)', border: '2px solid rgba(0,229,255,0.5)' }}>
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground mb-1">飞手资质验证通过</p>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-semibold">{selected?.name}</span>（{selected?.level}）资质有效，可接管控制权。
            </p>
            <p className="text-[11px] text-muted-foreground mt-2">证书有效期至：{selected?.expiry}</p>
          </div>
          <div className="w-full p-3 rounded border flex flex-col gap-1.5" style={{ borderColor: 'rgba(0,229,255,0.2)', background: 'rgba(0,229,255,0.04)' }}>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">接管飞手</span>
              <span className="text-foreground font-medium">{selected?.name} · {selected?.department}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">授权级别</span>
              <span className="text-primary font-medium">{selected?.level}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">当前飞机</span>
              <span className="text-foreground font-medium">高空瞭望-大疆M300 (UAV-A01)</span>
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={() => setStep('select')} className="flex-1 py-2.5 text-sm rounded border border-border text-muted-foreground hover:text-foreground transition-all">返回重选</button>
            <button onClick={handleConfirmTransfer} className="flex-1 py-2.5 text-sm rounded font-bold transition-all flex items-center justify-center gap-2" style={{ background: 'rgba(0,229,255,1)', color: 'rgb(9,14,23)' }}>
              <CheckCircle size={15} />
              确认移交
            </button>
          </div>
        </div>

        {/* Step: Unqualified Confirm */}
        <div style={{ display: step === 'unqualified_confirm' ? 'flex' : 'none' }} className="flex-col p-8 items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.5)' }}>
            <ShieldX size={32} className="text-destructive" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground mb-1">当前飞手资质不足</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold" style={{ color: 'rgb(239,68,68)' }}>{selected?.name}</span>（{selected?.level}）证书已过期或不满足本次任务授权要求。
            </p>
          </div>
          <div className="w-full p-3 rounded border" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs" style={{ color: 'rgb(239,68,68)' }}>
                当前飞手 <strong>{selected?.name}</strong> 无有效执飞资质，将控制权移交给无资质飞手存在安全风险。请确认是否强制移交控制权？
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={() => setStep('select')} className="flex-1 py-2.5 text-sm rounded font-bold transition-all" style={{ background: 'rgba(0,229,255,1)', color: 'rgb(9,14,23)' }}>
              返回重新选择
            </button>
            <button onClick={handleConfirmTransfer} className="flex-1 py-2.5 text-sm rounded border text-sm transition-all hover:opacity-80" style={{ borderColor: 'rgba(239,68,68,0.5)', color: 'rgb(239,68,68)', background: 'rgba(239,68,68,0.1)' }}>
              强制移交（风险自担）
            </button>
          </div>
        </div>

        {/* Step: Success */}
        <div style={{ display: step === 'success' ? 'flex' : 'none' }} className="flex-col p-8 items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.5)' }}>
            <CheckCircle size={32} style={{ color: 'rgb(34,197,94)' }} />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground mb-1">控制权移交成功</p>
            <p className="text-sm text-muted-foreground">
              飞行控制权已成功移交至 <span className="font-semibold" style={{ color: 'rgb(34,197,94)' }}>{selected?.name}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">系统将自动记录本次移交操作日志...</p>
          </div>
        </div>
      </div>
    </div>
  );
}