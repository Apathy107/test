import React from 'react';
import { Battery, Navigation, ArrowUp, Wifi, Clock, Satellite, MoveUpRight, Square, RotateCcw, Pause, Play, Hand } from 'lucide-react';

interface FlightTopBarProps {
  battery?: number;
  speed?: number;
  altitude?: number;
  coordinates?: string;
  distance?: string;
  signal?: string;
  signalStrength?: 0 | 1 | 2 | 3 | 4;
  time?: string;
  rtkStatus?: 'RTK固定解' | 'RTK浮点解' | '未定位';
  rtkSats?: number;
  routePaused?: boolean;
  emergencyOverride?: boolean;
  onTransfer?: () => void;
  onEmergencyStop?: () => void;
  onRth?: () => void;
  onPauseRoute?: () => void;
  onResumeRoute?: () => void;
  onManualTakeover?: () => void;
}

export default function FlightTopBar({
  battery = 82,
  speed = 12.5,
  altitude = 120,
  coordinates = '118.452, 32.124',
  distance = '2223.14m',
  signal = 'RC',
  signalStrength = 4,
  time = '13:25',
  rtkStatus = 'RTK固定解',
  rtkSats = 39,
  routePaused = false,
  emergencyOverride = false,
  onTransfer,
  onEmergencyStop,
  onRth,
  onPauseRoute,
  onResumeRoute,
  onManualTakeover,
}: FlightTopBarProps) {
  return (
    <div
      data-cmp="FlightTopBar"
      className="h-10 flex items-center px-4 gap-1 flex-shrink-0 z-30"
      style={{ background: 'rgba(5,8,15,0.92)', borderBottom: '1px solid rgba(30,58,138,0.5)' }}
    >
      {/* Battery */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <Battery size={14} style={{ color: 'rgb(34,197,94)' }} />
        <span className="text-xs font-bold font-mono" style={{ color: 'rgb(34,197,94)' }}>{battery}%</span>
      </div>

      <div className="w-px h-5 mx-1" style={{ background: 'rgba(30,58,138,0.6)' }}></div>

      {/* Speed */}
      <div className="flex items-center gap-1.5 px-2">
        <Navigation size={13} className="text-primary" />
        <span className="text-xs font-mono text-foreground">{speed} m/s</span>
      </div>

      {/* Altitude */}
      <div className="flex items-center gap-1.5 px-2">
        <ArrowUp size={13} className="text-primary" />
        <span className="text-xs font-mono text-foreground">{altitude}m</span>
      </div>

      {/* Coordinates */}
      <div className="flex items-center gap-1.5 px-2">
        <Satellite size={13} className="text-primary" />
        <span className="text-xs font-mono text-foreground">{coordinates}</span>
      </div>

      {/* Distance */}
      <div className="flex items-center gap-1.5 px-2">
        <span className="text-xs text-muted-foreground">距离起飞点</span>
        <span className="text-xs font-mono text-foreground">{distance}</span>
      </div>

      {/* RTK */}
      <div className="flex items-center gap-1.5 px-2">
        <span className="text-xs text-muted-foreground font-mono">RTK</span>
        <span className="text-xs font-mono text-foreground">{rtkStatus}</span>
        <span className="text-xs text-muted-foreground font-mono">{rtkSats}</span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5 px-2">
        <Clock size={13} className="text-primary" />
        <span className="text-xs font-mono text-foreground">{time}</span>
      </div>

      <div className="flex-1"></div>

      {/* Emergency override tag */}
      {emergencyOverride && (
        <div className="flex items-center gap-2 px-3 py-1 rounded mr-2" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.45)' }}>
          <span className="text-xs font-bold tracking-widest" style={{ color: 'rgb(239,68,68)' }}>应急接管</span>
          <span className="text-[10px] text-muted-foreground">权限覆盖中</span>
        </div>
      )}

      {/* Signal mode */}
      <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(30,58,138,0.6)' }}>
        <Wifi size={13} className="text-primary" />
        <span className="text-xs font-mono text-foreground">{signal}</span>
        <div className="flex items-end gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 rounded-sm"
              style={{
                height: 4 + i * 2,
                background: i <= signalStrength ? 'rgba(0,229,255,0.95)' : 'rgba(100,116,139,0.6)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 ml-2">
        <button
          type="button"
          onClick={onTransfer}
          className="px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-95 hover:shadow-[0_0_12px_rgba(0,229,255,0.12)]"
          style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.55)', color: 'rgb(0,229,255)' }}
          title="移交控制权"
        >
          <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.18)', border: '1px solid rgba(0,229,255,0.25)' }}>
            <MoveUpRight size={12} />
          </span>
          <span className="hidden sm:inline">移交</span>
        </button>
        <button
          type="button"
          onClick={onEmergencyStop}
          className="px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-95 hover:shadow-[0_0_12px_rgba(239,68,68,0.12)]"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', color: 'rgb(239,68,68)' }}
          title="急停"
        >
          <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.16)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <Square size={12} />
          </span>
          <span className="hidden sm:inline">急停</span>
        </button>
        <button
          type="button"
          onClick={onRth}
          className="px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-95 hover:shadow-[0_0_12px_rgba(239,68,68,0.10)]"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', color: 'rgb(239,68,68)' }}
          title="一键返航"
        >
          <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.16)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <RotateCcw size={12} />
          </span>
          <span className="hidden sm:inline">返航</span>
        </button>
        {routePaused ? (
          <button
            type="button"
            onClick={onResumeRoute}
            className="px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-95 hover:shadow-[0_0_12px_rgba(0,229,255,0.18)]"
            style={{ background: 'rgba(0,229,255,1)', color: 'rgb(9,14,23)' }}
            title="继续航线"
          >
            <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(9,14,23,0.12)', border: '1px solid rgba(9,14,23,0.18)' }}>
              <Play size={12} />
            </span>
            <span className="hidden sm:inline">继续</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPauseRoute}
            className="px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-95 hover:shadow-[0_0_12px_rgba(0,229,255,0.18)]"
            style={{ background: 'rgba(0,229,255,1)', color: 'rgb(9,14,23)' }}
            title="暂停航线"
          >
            <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(9,14,23,0.12)', border: '1px solid rgba(9,14,23,0.18)' }}>
              <Pause size={12} />
            </span>
            <span className="hidden sm:inline">暂停</span>
          </button>
        )}
        <button
          type="button"
          onClick={onManualTakeover}
          className="px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-95 hover:shadow-[0_0_12px_rgba(30,58,138,0.14)]"
          style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(30,58,138,0.6)', color: 'rgb(148,163,184)' }}
          title="人工接管"
        >
          <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(30,58,138,0.35)', border: '1px solid rgba(30,58,138,0.35)' }}>
            <Hand size={12} />
          </span>
          <span className="hidden sm:inline">接管</span>
        </button>
      </div>
    </div>
  );
}