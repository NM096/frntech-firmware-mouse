import { create } from 'zustand'

export interface RGBColor {
  r: number
  g: number
  b: number
}

export interface DPILevel {
  level: number
  value: number
  active: boolean
}

export interface MacroItem {
  id: string
  name: string
  folder: string
  actions: any[]
}

export interface KeyConfig {
  key: string
  function: string
  label: string
  active: boolean
}

interface MouseConfigState {
  // 主题和语言
  isDarkMode: boolean
  language: 'zh' | 'en'
  activeTab: string
  
  // 设备信息
  deviceInfo: {
    name: string
    battery: number
    connection: string
    firmware: string
  }
  
  // RGB灯光设置
  rgbSettings: {
    mode: string
    color: RGBColor
    brightness: number
    speed: number
  }
  
  // 按键配置
  keyConfigs: KeyConfig[]
  selectedKey: string | null
  selectedFunction: string
  
  // 宏设置
  macros: MacroItem[]
  selectedMacroFolder: string
  isRecording: boolean
  recordedActions: any[]
  
  // DPI设置
  dpiLevels: DPILevel[]
  currentDPI: number
  pollingRate: number
  
  // 睡眠和性能设置
  sleepSettings: {
    enabled: boolean
    timeout: number
  }
  performanceSettings: {
    acceleration: boolean
    smoothing: number
  }
  
  // Actions
  setActiveTab: (tab: string) => void
  toggleDarkMode: () => void
  toggleLanguage: () => void
  updateRGBColor: (color: RGBColor) => void
  updateRGBMode: (mode: string) => void
  updateRGBBrightness: (brightness: number) => void
  updateRGBSpeed: (speed: number) => void
  selectKey: (key: string) => void
  updateKeyFunction: (key: string, func: string) => void
  setSelectedFunction: (func: string) => void
  addMacro: (macro: MacroItem) => void
  deleteMacro: (id: string) => void
  setSelectedMacroFolder: (folder: string) => void
  startRecording: () => void
  stopRecording: () => void
  addRecordedAction: (action: any) => void
  clearRecordedActions: () => void
  updateDPI: (dpi: number) => void
  setDPILevel: (level: number, active: boolean) => void
  updatePollingRate: (rate: number) => void
  updateSleepSettings: (settings: any) => void
  updatePerformanceSettings: (settings: any) => void
  resetToDefaults: () => void
  saveConfiguration: () => void
  applyConfiguration: () => void
}

export const useMouseConfigStore = create<MouseConfigState>((set) => ({
  // 初始状态
  isDarkMode: false,
  language: 'zh',
  activeTab: 'mouse',
  
  deviceInfo: {
    name: 'TMKB M1 游戏鼠标',
    battery: 85,
    connection: '2.4GHz',
    firmware: 'v2.1.5'
  },
  
  rgbSettings: {
    mode: '呼吸模式',
    color: { r: 128, g: 64, b: 200 },
    brightness: 75,
    speed: 5
  },
  
  keyConfigs: [
    { key: 'left', function: '左键', label: '左键', active: false },
    { key: 'right', function: '右键', label: '右键', active: false },
    { key: 'side1', function: 'DPI+', label: '侧键1', active: true },
    { key: 'side2', function: '宏1', label: '侧键2', active: false },
    { key: 'wheel-up', function: '音量+', label: '滚轮上', active: false },
    { key: 'wheel-down', function: '音量-', label: '滚轮下', active: false },
    { key: 'wheel-press', function: '静音', label: '滚轮中', active: false },
    { key: 'dpi', function: 'DPI切换', label: 'DPI键', active: false },
  ],
  selectedKey: null,
  selectedFunction: '',
  
  macros: [
    { id: '1', name: '快速连点', folder: 'FPS 游戏', actions: [] },
    { id: '2', name: '压枪宏', folder: 'FPS 游戏', actions: [] },
    { id: '3', name: '组合技能', folder: 'MOBA 游戏', actions: [] },
    { id: '4', name: '文本快捷键', folder: '办公效率', actions: [] },
  ],
  selectedMacroFolder: 'FPS 游戏',
  isRecording: false,
  recordedActions: [],
  
  dpiLevels: [
    { level: 1, value: 800, active: false },
    { level: 2, value: 1600, active: true },
    { level: 3, value: 3200, active: false },
    { level: 4, value: 6400, active: false },
    { level: 5, value: 12000, active: false },
    { level: 6, value: 16000, active: false },
    { level: 7, value: 24000, active: false },
  ],
  currentDPI: 4800,
  pollingRate: 1000,
  
  sleepSettings: {
    enabled: true,
    timeout: 300
  },
  performanceSettings: {
    acceleration: true,
    smoothing: 3
  },
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  toggleLanguage: () => set((state) => ({ 
    language: state.language === 'zh' ? 'en' : 'zh' 
  })),
  
  updateRGBColor: (color) => set((state) => ({
    rgbSettings: { ...state.rgbSettings, color }
  })),
  
  updateRGBMode: (mode) => set((state) => ({
    rgbSettings: { ...state.rgbSettings, mode }
  })),
  
  updateRGBBrightness: (brightness) => set((state) => ({
    rgbSettings: { ...state.rgbSettings, brightness }
  })),
  
  updateRGBSpeed: (speed) => set((state) => ({
    rgbSettings: { ...state.rgbSettings, speed }
  })),
  
  selectKey: (key) => set({ selectedKey: key }),
  
  updateKeyFunction: (key, func) => set((state) => ({
    keyConfigs: state.keyConfigs.map(config => 
      config.key === key ? { ...config, function: func, active: true } : 
      { ...config, active: false }
    )
  })),
  
  setSelectedFunction: (func) => set({ selectedFunction: func }),
  
  addMacro: (macro) => set((state) => ({
    macros: [...state.macros, macro]
  })),
  
  deleteMacro: (id) => set((state) => ({
    macros: state.macros.filter(macro => macro.id !== id)
  })),
  
  setSelectedMacroFolder: (folder) => set({ selectedMacroFolder: folder }),
  
  startRecording: () => set({ isRecording: true, recordedActions: [] }),
  
  stopRecording: () => set({ isRecording: false }),
  
  addRecordedAction: (action) => set((state) => ({
    recordedActions: [...state.recordedActions, action]
  })),
  
  clearRecordedActions: () => set({ recordedActions: [] }),
  
  updateDPI: (dpi) => set({ currentDPI: dpi }),
  
  setDPILevel: (level, active) => set((state) => ({
    dpiLevels: state.dpiLevels.map(dpiLevel => 
      dpiLevel.level === level ? { ...dpiLevel, active } : 
      { ...dpiLevel, active: false }
    )
  })),
  
  updatePollingRate: (rate) => set({ pollingRate: rate }),
  
  updateSleepSettings: (settings) => set((state) => ({
    sleepSettings: { ...state.sleepSettings, ...settings }
  })),
  
  updatePerformanceSettings: (settings) => set((state) => ({
    performanceSettings: { ...state.performanceSettings, ...settings }
  })),
  
  resetToDefaults: () => {
    // 重置到默认设置的逻辑
    console.log('重置到默认设置')
  },
  
  saveConfiguration: () => {
    // 保存配置的逻辑
    console.log('保存配置')
  },
  
  applyConfiguration: () => {
    // 应用配置的逻辑
    console.log('应用配置')
  },
}))