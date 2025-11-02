import type { Config } from '@/types/data-config';
let astilectron: any = {};
document.addEventListener('astilectron-ready', function () {
  // @ts-expect-error
  astilectron = window.astilectron;
});

export function openDevTools() {
  astilectron.sendMessage({ name: 'OpenDevTools' });
}

export function closeDevTools() {
  astilectron.sendMessage({ name: 'CloseDevTools' });
}

export function closeApp() {
  astilectron.sendMessage({ name: 'CloseApp' });
}

export function minimizeApp() {
  astilectron.sendMessage({ name: 'MinimizeApp' });
}

export function maximizeApp() {
  astilectron.sendMessage({ name: 'MaximizeApp' });
}
export function unmaximizeApp() {
  astilectron.sendMessage({ name: 'UnmaximizeApp' });
}

export function showWindow() {
  astilectron.sendMessage({ name: 'ShowWindow' });
}

export function hideWindow() {
  astilectron.sendMessage({ name: 'HideWindow' });
}

// 禁用Electron窗口滚动条
export function disableScrollbars() {
  astilectron.sendMessage({ name: 'DisableScrollbars' });
}

// 启用Electron窗口滚动条
export function enableScrollbars() {
  astilectron.sendMessage({ name: 'EnableScrollbars' });
}

type DriverMessageHandler = (payload: any) => void;

const driverMessageHandlers: Record<DriverMessageType, DriverMessageHandler[]> = {
  onAppReady: [],
  onAppConfig: [],
  DeviceListChanged: [],
  DeviceChanged: [],
  UpgradeProgress: [],
  ProfileAppActive: [],
  ProfileAppInactive: [],
};
type DriverMessageType =
  | 'onAppReady'
  | 'onAppConfig'
  | 'DeviceListChanged'
  | 'DeviceChanged'
  | 'UpgradeProgress'
  | 'ProfileAppActive'
  | 'ProfileAppInactive';
export function onDriverMessage(type: DriverMessageType, handler: DriverMessageHandler) {
  if (!driverMessageHandlers[type]) {
    driverMessageHandlers[type] = [];
  }
  driverMessageHandlers[type].push(handler);
}
export function offDriverMessage(type: DriverMessageType, handler: DriverMessageHandler) {
  if (!driverMessageHandlers[type]) return;
  driverMessageHandlers[type] = driverMessageHandlers[type].filter((h) => h !== handler);
}

export function listenDriverMessage() {
  astilectron.onMessage(function (message) {
    console.log('driverMessageHandlers', driverMessageHandlers);
    console.log(`-------${message?.name}-------`, message?.payload);
    console.log('Current handlers:', driverMessageHandlers[message.name]);
    const handlers = driverMessageHandlers[message.name];
    if (handlers && handlers.length) {
      handlers[handlers.length - 1](message.payload); // 只调用最后一个注册的处理函数
    }
  });
}

// 获取机型列表：
export function getModelList(callback?: (payload: any) => void) {
  astilectron.sendMessage({ name: 'GetModelList' }, function (message: any) {
    console.log(`-------${message?.name}-------`, message?.payload);
    callback?.(message?.payload);
  });
}

// 获取机型配置：
export function getModelConfig(modelID, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'GetModelConfig',
      payload: {
        ModelID: modelID,
      },
    },
    function (message: any) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

// 获取机型按键映射：
export function getModelKeyMap(modelID, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'GetModelKeyMap',
      payload: {
        ModelID: modelID,
      },
    },
    function (message: any) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

// 获取机型默认配置文件：
export function getModelProfile(modelID, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'GetModelProfile',
      payload: {
        ModelID: modelID,
      },
    },
    function (message: any) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function checkDriver(callback?: (payload: any) => void) {
  astilectron.sendMessage({ name: 'CheckDriver' }, function (message: any) {
    console.log(`-------${message?.name}-------`, message?.payload);
    callback?.(message?.payload);
  });
}

export function getProfileByName(modelID, name, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'ReadProfile',
      payload: {
        ModelID: modelID,
        Name: name,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setCurrentProfile(modelID, name, profile, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'SaveProfile',
      payload: {
        ModelID: modelID,
        Name: name,
        Profile: profile,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function getSoftwareVersion(callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'GetSoftwareVersion',
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function getDeviceList(callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'GetDeviceList',
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function importProfile(modelID, path, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'ImportProfile',
      payload: {
        ModelID: modelID,
        Path: path,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function exportProfile(modelID, name, profile, path, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'ExportProfile',
      payload: {
        ModelID: modelID,
        Name: name,
        Profile: profile,
        Path: path,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setLE(device, le, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'SetLEDEffect',
      payload: {
        Device: device,
        LEDEffect: le,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function getCustomLE(device, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'GetCustomLE',
      payload: {
        Device: device,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setCustomLE(device, cle, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'SetCustomLE',
      payload: {
        Device: device,
        CustomLE: cle,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setMode(device, mode, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'SetMode',
      payload: {
        Device: device,
        Mode: mode,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function getDPI(device, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'GetDPI',
      payload: {
        Device: device,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setDPI(device, mode, dpi, callback?: (payload: any) => void) {
  console.log('setDPI', device, mode, dpi);
  astilectron.sendMessage(
    {
      name: 'SetDPI',
      payload: {
        Device: device,
        Mode: mode,
        DPI: dpi,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setReportRate(device, rr, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'SetReportRate',
      payload: {
        Device: device,
        ReportRate: rr,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setAdvanceSetting(device, advance, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'SetAdvanceSetting',
      payload: {
        Device: device,
        AdvanceSetting: advance,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

//
export function getConfigData(device, callback?: (payload: Config) => void) {
  astilectron.sendMessage(
    {
      name: 'GetConfigData',
      payload: {
        Device: device,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setConfigData(device, config: Config, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'SetConfigData',
      payload: {
        Device: device,
        Config: config,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function apply(device, profile, callback?: (payload: any) => void) {
  console.log('SetKeyDefine', device, profile);
  astilectron.sendMessage(
    {
      name: 'SetKeyDefine',
      payload: {
        Device: device,
        Profile: profile,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function openMouseProperties(callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'OpenMouseProperties',
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function reset(device, callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'Reset',
      payload: {
        Device: device,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function getMacroCategorys(callback?: (payload: any) => void) {
  astilectron.sendMessage(
    {
      name: 'GetMacroCategorys',
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function addMacroCategory(category, callback?: (payload: any) => void) {
  console.log('addMacroCategory', category);
  astilectron.sendMessage(
    {
      name: 'AddMacroCategory',
      payload: {
        Category: category,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}
export function renameMacro(category, name, newName, callback?: (payload: any) => void) {
  console.log('renameMacro', category, name, newName);
  astilectron.sendMessage(
    {
      name: 'RenameMacro',
      payload: {
        Category: category,
        Name: name,
        NewName: newName,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function delMacroCategory(category, callback?: (payload: any) => void) {
  console.log('delMacroCategory', category);
  astilectron.sendMessage(
    {
      name: 'DelMacroCategory',
      payload: {
        Category: category,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function getMacros(category, callback?: (payload: any) => void) {
  console.log('getMacros', category);
  astilectron.sendMessage(
    {
      name: 'GetMacros',
      payload: {
        Category: category,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function addMacro(category, name, callback?: (payload: any) => void) {
  console.log('addMacro', category, name);
  astilectron.sendMessage(
    {
      name: 'AddMacro',
      payload: {
        Category: category,
        Name: name,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function delMacro(category, name, callback?: (payload: any) => void) {
  console.log('delMacro', category, name);
  astilectron.sendMessage(
    {
      name: 'DelMacro',
      payload: {
        Category: category,
        Name: name,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function readMacro(category, name, callback?: (payload: any) => void) {
  console.log('readMacro', category, name);
  astilectron.sendMessage(
    {
      name: 'ReadMacro',
      payload: {
        Category: category,
        Name: name,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function saveMacro(category, name, macrofile, callback?: (payload: any) => void) {
  console.log('saveMacro', category, name);
  astilectron.sendMessage(
    {
      name: 'SaveMacro',
      payload: {
        Category: category,
        Name: name,
        Macrofile: macrofile,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function importMacro(path, callback?: (payload: any) => void) {
  console.log('importMacro', path);

  astilectron.sendMessage(
    {
      name: 'ImportMacro',
      payload: {
        Path: path,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function exportMacro(name, macrofile, path, callback?: (payload: any) => void) {
  console.log('exportMacro', name, macrofile, path);

  astilectron.sendMessage(
    {
      name: 'ExportMacro',
      payload: {
        Name: name,
        Macrofile: macrofile,
        Path: path,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function upgradeFireware(device, modelID, callback?: (payload: any) => void) {
  console.log('upgradeFireware', device, modelID);
  astilectron.sendMessage(
    {
      name: 'UpgradeFireware',
      payload: {
        Device: device,
        ModelID: modelID,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function loadAppConfig(callback?: (payload: any) => void) {
  console.log('loadAppConfig');
  astilectron.sendMessage(
    {
      name: 'LoadAppConfig',
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function saveAppConfig(config, callback?: (payload: any) => void) {
  console.log('saveAppConfig', config);
  astilectron.sendMessage(
    {
      name: 'SaveAppConfig',
      payload: {
        Config: config,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function getSystemConfig(callback?: (payload: any) => void) {
  console.log('getSystemConfig');

  astilectron.sendMessage(
    {
      name: 'GetSystemConfig',
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setSystemConfig(config, callback?: (payload: any) => void) {
  console.log('setSystemConfig', config);

  astilectron.sendMessage(
    {
      name: 'SetSystemConfig',
      payload: {
        Config: config,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function GetProfiles(modelID, callback?: (payload: any) => void) {
  console.log('GetProfiles', modelID);

  astilectron.sendMessage(
    {
      name: 'GetProfiles',
      payload: {
        ModelID: modelID,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}
export function AddProfile(modelID, name, callback?: (payload: any) => void) {
  console.log('AddProfile', modelID, name);
  astilectron.sendMessage(
    {
      name: 'AddProfile',
      payload: {
        ModelID: modelID,
        Name: name,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}
export function RenameProfile(modelID, name, newName, callback?: (payload: any) => void) {
  console.log('RenameProfile', modelID, name, newName);

  astilectron.sendMessage(
    {
      name: 'RenameProfile',
      payload: {
        ModelID: modelID,
        Name: name,
        NewName: newName,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function DelProfile(modelID, name, callback?: (payload: any) => void) {
  console.log('DelProfile', modelID, name);
  astilectron.sendMessage(
    {
      name: 'DelProfile',
      payload: {
        ModelID: modelID,
        Name: name,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function getSelectProfile(modelID, callback?: (payload: any) => void) {
  console.log('getSelectProfile', modelID);
  astilectron.sendMessage(
    {
      name: 'GetSelectProfile',
      payload: {
        ModelID: modelID,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}

export function setSelectProfile(modelID, name, callback?: (payload: any) => void) {
  console.log('setSelectProfile', modelID, name);
  astilectron.sendMessage(
    {
      name: 'SetSelectProfile',
      payload: {
        ModelID: modelID,
        Name: name,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}
export function getExeIcon(path, callback?: (payload: any) => void) {
  console.log('getExeIcon', path);

  astilectron.sendMessage(
    {
      name: 'GetExeIcon',
      payload: {
        Path: path,
      },
    },
    function (message) {
      console.log(`-------${message?.name}-------`, message?.payload);
      callback?.(message?.payload);
    }
  );
}
