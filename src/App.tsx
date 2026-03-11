/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, AlertTriangle, Camera, Droplet, Gauge, Globe, Maximize2, Monitor, Plus, RefreshCw, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Translations
const translations = {
  vi: {
    title: "WORLD MONITOR - WASTEWATER",
    dashboard: "DASHBOARD",
    addScreen: "ADD SCREEN",
    deviceName: "DEVICE NAME",
    ipAddress: "IP ADDRESS",
    port: "PORT (OPTIONAL)",
    description: "DESCRIPTION",
    save: "SAVE",
    cancel: "CANCEL",
    reload: "RELOAD",
    delete: "DELETE",
    fullscreen: "FULLSCREEN",
    connectionStatus: "STATUS",
    online: "ONLINE",
    offline: "OFFLINE",
    noDevices: "NO DATA FEEDS DETECTED. ADD A DEVICE TO COMMENCE MONITORING.",
    addDeviceTitle: "ADD NEW DEVICE",
    systemTime: "SYS.TIME",
    liveCamera: "CAMERA KHU VỰC",
    chemicals: "KHO HÓA CHẤT",
    systemMetrics: "CHỈ SỐ HỆ THỐNG",
    acid6: "AXIT 6%",
    acid60: "AXIT 60%",
    pac: "PAC",
    polymer: "POLYMER",
    flowRate: "LƯU LƯỢNG",
  },
  ja: {
    title: "WORLD MONITOR - 排水処理",
    dashboard: "ダッシュボード",
    addScreen: "画面追加",
    deviceName: "デバイス名",
    ipAddress: "IPアドレス",
    port: "ポート（任意）",
    description: "説明",
    save: "保存",
    cancel: "キャンセル",
    reload: "再読み込み",
    delete: "削除",
    fullscreen: "全画面",
    connectionStatus: "状態",
    online: "オンライン",
    offline: "オフライン",
    noDevices: "データフィードが検出されません。監視を開始するにはデバイスを追加してください。",
    addDeviceTitle: "新規デバイス追加",
    systemTime: "システム時刻",
    liveCamera: "エリアカメラ",
    chemicals: "化学薬品保管",
    systemMetrics: "システム指標",
    acid6: "酸 6%",
    acid60: "酸 60%",
    pac: "PAC",
    polymer: "ポリマー",
    flowRate: "流量",
  }
};

type Language = 'vi' | 'ja';

interface Device {
  id: string;
  name: string;
  ip: string;
  port: string;
  description: string;
}

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [devices, setDevices] = useState<Device[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const t = translations[lang];

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    const savedDevices = localStorage.getItem('wastewater_devices');
    if (savedDevices) {
      try {
        setDevices(JSON.parse(savedDevices));
      } catch (e) {
        console.error("Failed to parse devices from local storage");
      }
    }
    
    const savedLang = localStorage.getItem('wastewater_lang') as Language;
    if (savedLang && (savedLang === 'vi' || savedLang === 'ja')) {
      setLang(savedLang);
    }
    
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('wastewater_devices', JSON.stringify(devices));
  }, [devices]);

  const toggleLanguage = () => {
    const newLang = lang === 'vi' ? 'ja' : 'vi';
    setLang(newLang);
    localStorage.setItem('wastewater_lang', newLang);
  };

  const addDevice = (device: Omit<Device, 'id'>) => {
    const newDevice = {
      ...device,
      id: Date.now().toString(),
    };
    setDevices([...devices, newDevice]);
    setIsModalOpen(false);
  };

  const deleteDevice = (id: string) => {
    if (window.confirm(lang === 'vi' ? 'DELETE THIS DEVICE?' : 'このデバイスを削除しますか？')) {
      setDevices(devices.filter(d => d.id !== id));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false }) + '.' + date.getMilliseconds().toString().padStart(3, '0').slice(0, 1);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  };

  // Calculate dynamic grid layout to fit all screens in one view
  // We add 4 to the count because we have 3 fixed widgets (Camera, Chemicals, Metrics) + 1 Add Button Card
  const getGridClass = (deviceCount: number) => {
    const count = deviceCount + 4; 
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    if (count === 5 || count === 6) return "grid-cols-3 grid-rows-2";
    if (count >= 7 && count <= 9) return "grid-cols-3 grid-rows-3";
    if (count >= 10 && count <= 12) return "grid-cols-4 grid-rows-3";
    if (count >= 13 && count <= 16) return "grid-cols-4 grid-rows-4";
    // Fallback for many screens
    return "grid-cols-5 grid-rows-4";
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-gray-300 font-mono selection:bg-[#2a2a2a] overflow-hidden">
      {/* World Monitor Style Header */}
      <header className="flex-none z-30 bg-[#141414] border-b border-[#2a2a2a] h-[40px]">
        <div className="px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-gray-400" />
            <h1 className="text-xs font-bold tracking-widest text-gray-200 uppercase hidden sm:block">{t.title}</h1>
            <h1 className="text-xs font-bold tracking-widest text-gray-200 uppercase sm:hidden">{t.dashboard}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* System Time */}
            <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-400">
              <span className="uppercase tracking-wider">{t.systemTime}:</span>
              <span className="text-gray-200">{formatDate(currentTime)} {formatTime(currentTime)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 h-6 px-2 bg-transparent hover:bg-[#2a2a2a] border border-[#2a2a2a] text-[10px] font-bold tracking-wider text-gray-400 hover:text-gray-200 transition-colors"
              >
                <Globe className="w-3 h-3" />
                <span>VI | JA</span>
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 h-6 px-2 bg-transparent hover:bg-[#2a2a2a] border border-[#2a2a2a] text-[10px] font-bold tracking-wider text-gray-400 hover:text-gray-200 transition-colors"
                title={t.addScreen}
              >
                <Plus className="w-3 h-3" />
                <span className="hidden sm:inline">{t.addScreen}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Dynamic Grid */}
      <main className="flex-1 p-1 overflow-hidden">
        <div className={`h-full w-full grid gap-1 ${getGridClass(devices.length)}`}>
          
          {/* Fixed Widget 1: Live Camera */}
          <CameraWidget t={t} />

          {/* Fixed Widget 2: Chemical Levels */}
          <ChemicalWidget t={t} />

          {/* Fixed Widget 3: System Metrics */}
          <MetricsWidget t={t} />

          {/* User Added Devices */}
          {devices.map(device => (
            <DeviceCard 
              key={device.id} 
              device={device} 
              onDelete={() => deleteDevice(device.id)} 
              t={t} 
            />
          ))}

          {/* Add Device Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center gap-3 bg-[#0a0a0a] hover:bg-[#141414] border border-dashed border-[#2a2a2a] hover:border-gray-500 text-gray-500 hover:text-gray-300 transition-all min-h-0 min-w-0 h-full w-full group"
          >
            <div className="w-10 h-10 rounded-full border border-dashed border-gray-500 group-hover:border-gray-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase">{t.addScreen}</span>
          </button>
        </div>
      </main>

      {/* Add Device Modal */}
      {isModalOpen && (
        <AddDeviceModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={addDevice} 
          t={t} 
        />
      )}
    </div>
  );
}

// --- FIXED WIDGETS ---

function CameraWidget({ t }: { t: any }) {
  return (
    <div className="flex flex-col bg-[#141414] border border-[#2a2a2a] min-h-0 min-w-0 h-full w-full">
      <div className="h-[36px] px-3 flex items-center justify-between border-b border-[#1a1a1a] flex-none">
        <div className="flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-gray-500" />
          <h3 className="font-bold text-xs tracking-wider text-gray-200 uppercase">{t.liveCamera}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_#ef4444]"></div>
          <span className="text-[10px] text-red-500 tracking-widest font-bold">LIVE</span>
        </div>
      </div>
      <div className="flex-1 relative bg-[#0a0a0a] min-h-0 p-1">
        <div className="absolute inset-1 border border-[#2a2a2a] overflow-hidden bg-black relative">
          {/* Mock Camera Feed Image */}
          <img 
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" 
            alt="Live Camera" 
            className="w-full h-full object-cover opacity-50 grayscale"
            referrerPolicy="no-referrer"
          />
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]"></div>
          {/* OSD (On-Screen Display) */}
          <div className="absolute top-2 left-2 text-[10px] text-green-400 font-mono bg-black/60 px-1 border border-green-900/50">
            CAM-01: MAIN_TANK
          </div>
          <div className="absolute bottom-2 right-2 text-[10px] text-white font-mono bg-black/60 px-1">
            REC 1080p 30FPS
          </div>
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-8 h-8 border border-white rounded-full"></div>
            <div className="absolute w-12 h-[1px] bg-white"></div>
            <div className="absolute h-12 w-[1px] bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChemicalWidget({ t }: { t: any }) {
  return (
    <div className="flex flex-col bg-[#141414] border border-[#2a2a2a] min-h-0 min-w-0 h-full w-full">
      <div className="h-[36px] px-3 flex items-center gap-2 border-b border-[#1a1a1a] flex-none">
        <Droplet className="w-3.5 h-3.5 text-gray-500" />
        <h3 className="font-bold text-xs tracking-wider text-gray-200 uppercase">{t.chemicals}</h3>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden gap-2">
        <ProgressBar label={t.acid6} value={78} color="bg-green-500" />
        <ProgressBar label={t.acid60} value={24} color="bg-red-500" warning />
        <ProgressBar label={t.pac} value={85} color="bg-blue-500" />
        <ProgressBar label={t.polymer} value={60} color="bg-purple-500" />
      </div>
    </div>
  );
}

function ProgressBar({ label, value, color, warning = false }: { label: string, value: number, color: string, warning?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-end">
        <span className={`text-[10px] font-bold tracking-wider uppercase ${warning ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
          {label} {warning && ' (LOW)'}
        </span>
        <span className="text-[10px] text-gray-200 font-mono">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#0a0a0a] border border-[#2a2a2a] overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function MetricsWidget({ t }: { t: any }) {
  return (
    <div className="flex flex-col bg-[#141414] border border-[#2a2a2a] min-h-0 min-w-0 h-full w-full">
      <div className="h-[36px] px-3 flex items-center gap-2 border-b border-[#1a1a1a] flex-none">
        <Gauge className="w-3.5 h-3.5 text-gray-500" />
        <h3 className="font-bold text-xs tracking-wider text-gray-200 uppercase">{t.systemMetrics}</h3>
      </div>
      <div className="flex-1 p-2 grid grid-cols-2 grid-rows-2 gap-2 overflow-hidden">
        <MetricBox label="pH (IN)" value="4.2" unit="" color="text-red-400" />
        <MetricBox label="pH (OUT)" value="7.4" unit="" color="text-green-400" />
        <MetricBox label="COD" value="120" unit="mg/L" color="text-yellow-400" />
        <MetricBox label={t.flowRate} value="350" unit="m³/h" color="text-blue-400" />
      </div>
    </div>
  );
}

function MetricBox({ label, value, unit, color }: { label: string, value: string, unit: string, color: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#2a2a2a] p-2 flex flex-col justify-between">
      <span className="text-[9px] text-gray-500 tracking-wider uppercase">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</span>
        {unit && <span className="text-[9px] text-gray-600">{unit}</span>}
      </div>
    </div>
  );
}

// --- USER DEVICE CARD ---

function DeviceCard({ device, onDelete, t }: { device: Device, onDelete: () => void, t: any }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const url = `http://${device.ip}${device.port ? `:${device.port}` : ''}`;

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      cardRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`flex flex-col bg-[#141414] border border-[#2a2a2a] min-h-0 min-w-0 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full w-full rounded-none'}`}
    >
      {/* Panel Header */}
      <div className="h-[36px] px-3 flex items-center justify-between border-b border-[#1a1a1a] bg-[#141414] flex-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600 shadow-[0_0_5px_#16a34a]"></div>
              <h3 className="font-bold text-xs tracking-wider text-gray-200 uppercase truncate" title={device.name}>{device.name}</h3>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 flex-none">
          <span className="hidden sm:inline-block text-[10px] text-gray-500 mr-2 truncate">
            {device.ip}{device.port ? `:${device.port}` : ''}
          </span>
          <button 
            onClick={handleReload}
            className="p-1 text-gray-500 hover:text-gray-200 hover:bg-[#2a2a2a] transition-colors"
            title={t.reload}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-1 text-gray-500 hover:text-gray-200 hover:bg-[#2a2a2a] transition-colors"
            title={t.fullscreen}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {!isFullscreen && (
            <button 
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-400 hover:bg-[#2a2a2a] transition-colors ml-1"
              title={t.delete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Iframe Container */}
      <div className="flex-1 relative bg-[#0a0a0a] min-h-0">
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={url}
          className="absolute inset-0 w-full h-full border-0"
          title={`HMI ${device.name}`}
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function AddDeviceModal({ onClose, onSave, t }: { onClose: () => void, onSave: (d: any) => void, t: any }) {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ip.trim()) return;
    onSave({ name, ip, port, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-none overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="h-[40px] px-4 border-b border-[#1a1a1a] flex items-center gap-3">
          <Monitor className="w-4 h-4 text-gray-400" />
          <h2 className="text-xs font-bold tracking-widest text-gray-200 uppercase">{t.addDeviceTitle}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
              {t.deviceName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#2a2a2a] focus:border-gray-500 text-gray-200 text-xs focus:outline-none transition-colors rounded-none"
              placeholder="PUMP_STATION_01"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                {t.ipAddress} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ip}
                onChange={e => setIp(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#2a2a2a] focus:border-gray-500 text-gray-200 text-xs focus:outline-none transition-colors rounded-none"
                placeholder="192.168.1.100"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                {t.port}
              </label>
              <input
                type="text"
                value={port}
                onChange={e => setPort(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#2a2a2a] focus:border-gray-500 text-gray-200 text-xs focus:outline-none transition-colors rounded-none"
                placeholder="8080"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
              {t.description}
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#2a2a2a] focus:border-gray-500 text-gray-200 text-xs focus:outline-none transition-colors resize-none rounded-none"
              placeholder="MAIN_TREATMENT_AREA"
            />
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#1a1a1a]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-transparent hover:bg-[#2a2a2a] border border-[#2a2a2a] text-gray-400 text-[10px] font-bold tracking-wider uppercase rounded-none transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] text-gray-200 text-[10px] font-bold tracking-wider uppercase rounded-none transition-colors"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}