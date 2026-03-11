/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, AlertTriangle, Globe, Maximize2, Monitor, Plus, RefreshCw, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Translations
const translations = {
  vi: {
    title: "HỆ THỐNG SCADA - XỬ LÝ NƯỚC THẢI",
    dashboard: "BẢNG ĐIỀU KHIỂN",
    addScreen: "THÊM MÀN HÌNH",
    deviceName: "TÊN THIẾT BỊ",
    ipAddress: "ĐỊA CHỈ IP",
    port: "CỔNG (TÙY CHỌN)",
    description: "MÔ TẢ",
    save: "LƯU",
    cancel: "HỦY",
    reload: "TẢI LẠI",
    delete: "XÓA",
    fullscreen: "TOÀN MÀN HÌNH",
    connectionStatus: "TRẠNG THÁI",
    online: "KẾT NỐI",
    offline: "MẤT KẾT NỐI",
    noDevices: "HỆ THỐNG TRỐNG. VUI LÒNG THÊM THIẾT BỊ ĐỂ GIÁM SÁT.",
    addDeviceTitle: "THÊM THIẾT BỊ MỚI",
    systemTime: "THỜI GIAN HỆ THỐNG",
  },
  ja: {
    title: "SCADAシステム - 排水処理",
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
    noDevices: "システムは空です。監視するデバイスを追加してください。",
    addDeviceTitle: "新規デバイス追加",
    systemTime: "システム時刻",
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
    
    // Force dark mode for SCADA
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
    if (window.confirm(lang === 'vi' ? 'XÁC NHẬN XÓA THIẾT BỊ NÀY?' : 'このデバイスを削除してもよろしいですか？')) {
      setDevices(devices.filter(d => d.id !== id));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false }) + '.' + date.getMilliseconds().toString().padStart(3, '0').slice(0, 1);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // Calculate dynamic grid layout to fit all screens in one view
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1 grid-rows-1";
    if (count === 2) return "grid-cols-2 grid-rows-1";
    if (count === 3 || count === 4) return "grid-cols-2 grid-rows-2";
    if (count === 5 || count === 6) return "grid-cols-3 grid-rows-2";
    if (count >= 7 && count <= 9) return "grid-cols-3 grid-rows-3";
    if (count >= 10 && count <= 12) return "grid-cols-4 grid-rows-3";
    if (count >= 13 && count <= 16) return "grid-cols-4 grid-rows-4";
    // Fallback for many screens
    return "grid-cols-5 grid-rows-4";
  };

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-300 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* SCADA Top Bar */}
      <header className="flex-none z-30 bg-[#1e1e1e] border-b-2 border-[#333] shadow-md">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-900/50 border border-blue-500/50 rounded text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-widest text-gray-100 hidden sm:block">{t.title}</h1>
            <h1 className="text-lg font-bold tracking-widest text-gray-100 sm:hidden">{t.dashboard}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {/* System Time */}
            <div className="hidden md:flex flex-col items-end justify-center bg-[#111] border border-[#333] px-3 py-1 rounded">
              <div className="text-[10px] text-gray-500 font-bold tracking-wider mb-0.5">{t.systemTime}</div>
              <div className="flex items-center gap-2 font-mono text-green-400 text-sm leading-none">
                <span>{formatDate(currentTime)}</span>
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#252526] hover:bg-[#2d2d30] border border-[#3e3e42] rounded text-xs font-bold tracking-wider text-gray-300 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>VI | JA</span>
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 border border-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold tracking-wider transition-colors shadow-[0_0_10px_rgba(29,78,216,0.3)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.addScreen}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Dynamic Grid */}
      <main className="flex-1 p-2 sm:p-4 overflow-hidden">
        {devices.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center border-2 border-dashed border-[#333] bg-[#1a1a1a] rounded-lg">
            <AlertTriangle className="w-16 h-16 mb-4 text-yellow-600/50" />
            <h3 className="text-lg font-bold tracking-widest text-gray-400 mb-6">{t.noDevices}</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#252526] hover:bg-[#2d2d30] border border-[#3e3e42] text-gray-300 px-6 py-2.5 rounded font-bold tracking-wider transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.addScreen}
            </button>
          </div>
        ) : (
          <div className={`h-full w-full grid gap-2 sm:gap-4 ${getGridClass(devices.length)}`}>
            {devices.map(device => (
              <DeviceCard 
                key={device.id} 
                device={device} 
                onDelete={() => deleteDevice(device.id)} 
                t={t} 
              />
            ))}
          </div>
        )}
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
      className={`flex flex-col bg-[#1e1e1e] border border-[#333] shadow-lg min-h-0 min-w-0 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full w-full rounded-sm'}`}
    >
      {/* SCADA Panel Header */}
      <div className="px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between bg-[#252526] border-b border-[#333] flex-none">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Status LED */}
          <div className="hidden sm:flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-[#111] border border-[#333] rounded-sm shadow-inner flex-none">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
          </div>
          
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-xs sm:text-sm tracking-wider text-gray-100 uppercase truncate" title={device.name}>{device.name}</h3>
            <div className="hidden sm:flex items-center gap-3 text-[10px] sm:text-[11px] mt-0.5">
              <span className="font-mono text-blue-400 bg-[#111] px-1.5 py-0.5 rounded-sm border border-[#333] truncate">
                {device.ip}{device.port ? `:${device.port}` : ''}
              </span>
              <span className="font-bold tracking-wider text-green-500 uppercase flex-none">{t.online}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-1.5 flex-none">
          <button 
            onClick={handleReload}
            className="p-1 sm:p-1.5 bg-[#1e1e1e] hover:bg-[#2d2d30] border border-[#333] rounded-sm text-gray-400 hover:text-gray-200 transition-colors"
            title={t.reload}
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-1 sm:p-1.5 bg-[#1e1e1e] hover:bg-[#2d2d30] border border-[#333] rounded-sm text-gray-400 hover:text-gray-200 transition-colors"
            title={t.fullscreen}
          >
            <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          {!isFullscreen && (
            <button 
              onClick={onDelete}
              className="p-1 sm:p-1.5 bg-[#1e1e1e] hover:bg-red-900/30 border border-[#333] hover:border-red-900/50 rounded-sm text-gray-500 hover:text-red-400 transition-colors ml-1 sm:ml-2"
              title={t.delete}
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Iframe Container */}
      <div className="flex-1 relative bg-[#0a0a0a] p-0.5 sm:p-1 min-h-0">
        <div className="absolute inset-0.5 sm:inset-1 border border-[#333] bg-black">
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            title={`HMI ${device.name}`}
            sandbox="allow-scripts allow-same-origin allow-forms"
            loading="lazy"
          />
        </div>
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
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#444] shadow-2xl rounded-sm overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3 bg-[#252526] border-b border-[#444] flex items-center gap-3">
          <Monitor className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold tracking-widest text-gray-100 uppercase">{t.addDeviceTitle}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-gray-400 mb-1.5 uppercase">
              {t.deviceName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#111] border border-[#333] focus:border-blue-500 text-gray-100 font-mono text-sm focus:outline-none transition-colors rounded-sm"
              placeholder="PUMP_STATION_01"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-[11px] font-bold tracking-wider text-gray-400 mb-1.5 uppercase">
                {t.ipAddress} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ip}
                onChange={e => setIp(e.target.value)}
                className="w-full px-3 py-2 bg-[#111] border border-[#333] focus:border-blue-500 text-gray-100 font-mono text-sm focus:outline-none transition-colors rounded-sm"
                placeholder="192.168.1.100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-gray-400 mb-1.5 uppercase">
                {t.port}
              </label>
              <input
                type="text"
                value={port}
                onChange={e => setPort(e.target.value)}
                className="w-full px-3 py-2 bg-[#111] border border-[#333] focus:border-blue-500 text-gray-100 font-mono text-sm focus:outline-none transition-colors rounded-sm"
                placeholder="8080"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-gray-400 mb-1.5 uppercase">
              {t.description}
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#111] border border-[#333] focus:border-blue-500 text-gray-100 font-mono text-sm focus:outline-none transition-colors resize-none rounded-sm"
              placeholder="MAIN_TREATMENT_AREA"
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#252526] hover:bg-[#2d2d30] border border-[#444] text-gray-300 text-xs font-bold tracking-wider uppercase rounded-sm transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 border border-blue-500 text-white text-xs font-bold tracking-wider uppercase rounded-sm transition-colors shadow-[0_0_10px_rgba(29,78,216,0.2)]"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

