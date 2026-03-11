/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, AlertTriangle, Globe, Maximize2, Monitor, Plus, RefreshCw, Trash2 } from 'lucide-react';
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
        {devices.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center border border-[#2a2a2a] bg-[#141414]">
            <Monitor className="w-12 h-12 mb-4 text-[#2a2a2a]" />
            <h3 className="text-xs font-bold tracking-widest text-gray-500 mb-6 uppercase">{t.noDevices}</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-transparent hover:bg-[#2a2a2a] border border-[#2a2a2a] text-gray-300 px-4 py-2 text-xs font-bold tracking-wider transition-colors uppercase"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.addScreen}
            </button>
          </div>
        ) : (
          <div className={`h-full w-full grid gap-1 ${getGridClass(devices.length)}`}>
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
      className={`flex flex-col bg-[#141414] border border-[#2a2a2a] min-h-0 min-w-0 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full w-full rounded-none'}`}
    >
      {/* Panel Header */}
      <div className="h-[36px] px-3 flex items-center justify-between border-b border-[#1a1a1a] bg-[#141414] flex-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
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

